# Savannah live face test

The isolated `/savannah/lip-sync` page tests a Simli face with Savannah's
existing conversation and voice endpoints. It does not change the normal
Savannah page or widget. The provider connection is not verified yet.

Setup on the existing Railway service:

- `SIMLI_API_KEY`: set privately in Railway; never place it in a public variable.
- `SIMLI_FACE_ID`: the custom Savannah face created and approved in Simli.
- `SAVANNAH_LIVE_TEST_KEY`: a random access value of at least 32 characters.
  Enter it in the test page. It is kept only in component memory.

The session route issues a temporary token only after a same-origin request
with correct test access. Sessions are capped at two minutes, with a 30-second
idle limit. An in-process cooldown prevents rapid repeats; this is a private
trial gate, not a distributed production rate limiter.

The exact MP3 from `/api/savannah-voice` is decoded, mixed to mono and resampled
to 16 kHz PCM16. This waveform drives the face renderer. Only the renderer's
returned audio/video stream plays, avoiding independent playback clocks.
Speech generation is still per reply; this does not yet stream TTS tokens.

Test sequence:

1. Connect using Savannah's own custom face.
2. Play the fixed sound test and inspect lip closures, F/V, vowels and pauses.
3. Type a fresh question and confirm the newly generated answer is synced.
4. Interrupt during speech, check that both speech and queued face motion stop.
5. End the session and confirm reconnect and idle timeout behave correctly.
6. Verify Safari/iPhone audio activation before moving the adapter into the
   existing microphone conversation flow.

Do not activate a stock avatar as Savannah. Check identity and facial motion
before connecting this adapter to the public conversation.

The pinned `simli-client@3.0.2` entry point has a Linux case mismatch
(`./Client` versus `client.js`). The test imports the published
`simli-client/dist/client` implementation directly, with its matching types.

Sources: https://docs.simli.com/api-reference/javascript and
https://docs.simli.com/api-reference/compose-session-token.
