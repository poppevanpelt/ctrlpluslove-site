# THE ART OF NOT INTERRUPTING™
Isolated ElevenLabs VAD vs predictive turn-taking benchmark. **Not connected to Savannah production.**

## Setup
Use Node 20+, an ElevenLabs API key, and a **consented, non-sensitive** 16 kHz mono 16-bit PCM WAV recording. Include genuine hesitation and silence, not just clean sentences.

```sh
npm install --no-save ws
export ELEVENLABS_API_KEY='your-key'
node experiments/turn-taking/compare.mjs /path/to/sample.wav
```

The script streams the **same** audio in real time twice, once with `vad` and once with `turn_prediction`. It writes local JSON results next to the recording? **No**: results are printed to the console only; redirect to a private file if needed. Never commit recordings, transcripts, or keys.

## Protocol
Record ten short exchanges and note the precise time (seconds into the WAV) when a human has *actually* completed each turn. Also mark pauses that are *not* completed turns. Compare each strategy’s `committed_transcript` timestamps with these ground-truth marks. Latencies are measured relative to realtime replay; network jitter can affect them. Run twice on the same recordings for confidence.

**Pass:** predictive strategy produces fewer premature commits without materially increasing the median delay from an actual turn end to commit. Commit is merely an STT segmentation event, *not* an actual Savannah interruption. A real voice-agent follow-up needs separate testing.

**Important:** the API reports `turn_probability` only for supported models. If missing, don't fabricate it. API may charge for each replay. Zero-retention mode is not generally available; use consented dummy dialogue.

Official API: https://elevenlabs.io/docs/api-reference/speech-to-text/v-1-speech-to-text-realtime
