# Savannah Local v0.1

Savannah's typed conversation can run on Poppe's Mac instead of opening a Vapi call.

## What is local in v0.1

- typed Savannah on the main site
- typed Savannah in client rooms
- local reasoning through Ollama
- Savannah's existing browser transcript and field-note context

Voice is deliberately unchanged in v0.1. It still uses the current Vapi voice path until local speech-to-text and text-to-speech are added.

## Start

1. Install and start Ollama.
2. Make sure at least one model is installed.
3. From the ctrl+love repo:

```bash
npm run savannah:local
```

Savannah Local listens on:

```
http://127.0.0.1:4517
```

The server auto-selects an installed model. Preference order:

1. `gpt-oss:20b`
2. `qwen3:8b`
3. `gemma4`
4. `llama3.2:3b`
5. otherwise the first installed Ollama model

To force a model:

```bash
SAVANNAH_LOCAL_MODEL=qwen3:8b npm run savannah:local
```

Health check:

```bash
curl http://127.0.0.1:4517/health
```

## Site endpoint

By default, the browser looks for Savannah Local at `http://127.0.0.1:4517`.

For a later public tunnel / remote Mac endpoint, build the site with:

```bash
NEXT_PUBLIC_SAVANNAH_LOCAL_URL=https://your-savannah-endpoint.example npm run build
```

There is intentionally **no Vapi fallback for typed Savannah**. If Savannah Local is offline, Type reports that she is offline.

## Next step

v0.2: local voice.

```
browser mic
  -> local speech-to-text
  -> Savannah Local / Ollama
  -> local text-to-speech
  -> browser audio
```

Vapi then stops being part of browser Savannah altogether.
