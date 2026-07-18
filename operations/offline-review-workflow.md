# Offline Review Workflow

Target: Local operations review and visual iteration workflow

## Decision

Add an offline Ask / Feedback capture flow before adding model-backed answers.

This is separate from Demo 002.5's physical coherence proposal and from development docs. Demo 002.5 concerns visual and model-claim coherence. The offline review workflow concerns how users inspect the demo, ask questions, and leave actionable feedback during local operations review.

## Rationale

- A local OpenAI API integration would require the user's API key and separate API billing.
- API calls would not automatically inherit the current Codex or ChatGPT session context.
- Useful review context should therefore be stored as structured operations records before model calls are introduced.
- Screenshots are useful for visual feedback, but should not be embedded directly into JSONL logs because they make records hard to diff and easy to bloat.
- Ask / Feedback records are operations data, not development documentation.

## MVP

- Right-click the canvas to open an offline review menu.
- Save questions to `operations/questions-local.jsonl`.
- Save feedback to `operations/feedback-local.jsonl`.
- Optionally save a compact canvas snapshot to `operations/review-snapshots/`.
- Record the current app state with each entry:
  - view mode
  - scale mode
  - selected or targeted object
  - simulation date
  - frame / scale / route contract
  - enabled layers
  - camera state
  - viewport size
- Keep local logs and snapshots ignored by Git.

## Language

Add a global English / Chinese toggle for core UI and review controls.

Object names, route names, and technical model data may remain in English until a fuller terminology pass is done.

## Out Of Scope

- Calling a model API.
- Reusing a ChatGPT or Codex login session as an app credential.
- Syncing feedback to GitHub Pages.
- Uploading screenshots or feedback to a remote service.

## Future Upgrade

Once the offline interaction feels useful, add a local model endpoint:

```text
POST /api/ask
  -> read API key from local environment
  -> include relevant docs/spec excerpts
  -> call model
  -> return answer
  -> save question / answer / feedback locally
```

The production version would require a real backend such as a Cloudflare Worker, Vercel Function, Netlify Function, or VPS.
