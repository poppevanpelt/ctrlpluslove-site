import fs from 'node:fs';
import WebSocket from 'ws';

const file = process.argv[2];
const key = process.env.ELEVENLABS_API_KEY;
if (!file || !key) {
  console.error('Usage: ELEVENLABS_API_KEY=... node experiments/turn-taking/compare.mjs sample-16k-mono.wav');
  process.exit(1);
}
const wav = fs.readFileSync(file);
if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') throw Error('Expected a PCM WAV');
let offset = 12, fmt, pcm;
while (offset + 8 <= wav.length) {
  const name = wav.toString('ascii', offset, offset + 4);
  const size = wav.readUInt32LE(offset + 4);
  const start = offset + 8;
  if (start + size > wav.length) throw Error('Malformed WAV chunk');
  if (name === 'fmt ') fmt = { codec: wav.readUInt16LE(start), channels: wav.readUInt16LE(start + 2), rate: wav.readUInt32LE(start + 4), bits: wav.readUInt16LE(start + 14) };
  if (name === 'data') pcm = wav.subarray(start, start + size);
  offset = start + size + (size % 2);
}
if (!fmt || !pcm || fmt.codec !== 1 || fmt.channels !== 1 || fmt.rate !== 16000 || fmt.bits !== 16) {
  throw Error('Convert input to 16 kHz, mono, 16-bit uncompressed PCM WAV first');
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function run(strategy) {
  const url = new URL('wss://api.elevenlabs.io/v1/speech-to-text/realtime');
  url.searchParams.set('model_id', 'scribe_v2_realtime');
  url.searchParams.set('audio_format', 'pcm_16000');
  url.searchParams.set('commit_strategy', strategy);
  url.searchParams.set('vad_silence_threshold_secs', '1.0');
  const ws = new WebSocket(url, { headers: { 'xi-api-key': key } });
  const events = [];
  const started = Date.now();
  let error;
  const ready = new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });
  ws.on('message', raw => {
    try {
      const msg = JSON.parse(String(raw));
      if (['partial_transcript','committed_transcript','session_started','error','rate_limited'].includes(msg.message_type)) {
        events.push({ at_audio_seconds: Math.round((Date.now() - started) / 10) / 100, type: msg.message_type, text: msg.text ?? null, probability: msg.turn_probability ?? null });
      }
      if (msg.message_type === 'error' || msg.message_type === 'rate_limited') error = msg.error || msg.message_type;
    } catch (e) { console.error('Unparseable response', e.message); }
  });
  await ready;
  const frames = 8000; // 250 ms at 16 kHz, 16-bit
  for (let i = 0; i < pcm.length; i += frames) {
    if (error || ws.readyState !== WebSocket.OPEN) break;
    ws.send(JSON.stringify({ message_type: 'input_audio_chunk', audio_base_64: pcm.subarray(i, i + frames).toString('base64') }));
    await wait(250);
  }
  // Stream silence while model finalizes its last segment.
  for (let i = 0; i < 12 && !error && ws.readyState === WebSocket.OPEN; i++) {
    ws.send(JSON.stringify({ message_type: 'input_audio_chunk', audio_base_64: Buffer.alloc(frames).toString('base64') }));
    await wait(250);
  }
  ws.close();
  await new Promise(resolve => { if (ws.readyState === WebSocket.CLOSED) resolve(); else { ws.once('close', resolve); setTimeout(resolve, 3000); } });
  if (error) throw Error(strategy + ': ' + error);
  return { strategy, events };
}
const results = [];
for (const strategy of ['vad','turn_prediction']) {
  console.error('Testing', strategy);
  results.push(await run(strategy));
}
console.log(JSON.stringify({ sample: file, audio_duration_seconds: pcm.length / 32000, results }, null, 2));
