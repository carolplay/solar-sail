import { createReadStream } from "node:fs";
import { appendFile, mkdir, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "dist");
const projectRoot = resolve(import.meta.dirname, "..");
const recordsRoot = resolve(projectRoot, "operations");
const screenshotRoot = resolve(recordsRoot, "review-snapshots");
const requestedPort = readPort();
const host = process.env.HOST || "127.0.0.1";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};
const maxJsonBytes = 4_500_000;

function readPort() {
  const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
  const portValue = portArgIndex >= 0 ? process.argv[portArgIndex + 1] : process.env.PORT;
  const port = Number(portValue || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(`Invalid preview port: ${portValue}`);
    process.exit(1);
  }
  return port;
}

async function readJsonBody(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > maxJsonBytes) throw new Error("Request body too large");
  }
  return JSON.parse(body || "{}");
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function safeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function saveSnapshot(kind, snapshot) {
  if (!snapshot || typeof snapshot !== "string") return null;
  const match = snapshot.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) return null;
  await mkdir(screenshotRoot, { recursive: true });
  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const relativePath = `operations/review-snapshots/${safeTimestamp()}-${kind}.${extension}`;
  const absolutePath = resolve(projectRoot, relativePath);
  if (!absolutePath.startsWith(screenshotRoot)) throw new Error("Invalid snapshot path");
  await writeFile(absolutePath, Buffer.from(match[2], "base64"));
  return relativePath;
}

async function saveReviewRecord(kind, payload) {
  await mkdir(recordsRoot, { recursive: true });
  const snapshotPath = await saveSnapshot(kind, payload.snapshot);
  const record = {
    timestamp: new Date().toISOString(),
    kind,
    language: payload.language || "en",
    prompt: payload.prompt || "",
    feedback: payload.feedback || "",
    rating: payload.rating || "",
    context: payload.context || {},
    snapshotPath
  };
  const fileName = kind === "feedback" ? "feedback-local.jsonl" : "questions-local.jsonl";
  const filePath = resolve(recordsRoot, fileName);
  if (!filePath.startsWith(recordsRoot)) throw new Error("Invalid record path");
  await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
  return { file: `operations/${fileName}`, snapshotPath };
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && (req.url === "/api/ask" || req.url === "/api/feedback")) {
    try {
      const payload = await readJsonBody(req);
      const kind = req.url === "/api/feedback" ? "feedback" : "question";
      const saved = await saveReviewRecord(kind, payload);
      sendJson(res, 200, { ok: true, ...saved });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || "Could not save record" });
    }
    return;
  }

  const requestPath = normalize(decodeURIComponent(new URL(req.url, `http://localhost:${server.address().port}`).pathname));
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = resolve(join(root, safePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < 65535) {
      console.warn(`Port ${port} is in use; trying ${port + 1}.`);
      server.removeAllListeners("listening");
      listen(port + 1);
      return;
    }
    throw error;
  });
  server.once("listening", () => {
    const actualPort = server.address().port;
    console.log(`Preview running at http://${host}:${actualPort}`);
  });
  server.listen(port, host);
}

listen(requestedPort);
