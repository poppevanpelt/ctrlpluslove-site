// Simli's audio input is mono PCM16 at 16 kHz; its returned stream supplies
// both the audible voice and the matching face, avoiding independent clocks.
export function samplesToPcm16(samples: Float32Array): Uint8Array {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i++) {
    const sample = Number.isFinite(samples[i]) ? Math.max(-1, Math.min(1, samples[i])) : 0;
    view.setInt16(i * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
  }
  return bytes;
}

export async function voiceToPcm16(audio: ArrayBuffer): Promise<Uint8Array> {
  const decoder = new OfflineAudioContext(1, 1, 16000);
  const decoded = await decoder.decodeAudioData(audio);
  if (decoded.duration > 30) throw new Error("Use a shorter line for this test.");
  const render = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
  const source = render.createBufferSource();
  source.buffer = decoded;
  source.connect(render.destination);
  source.start();
  const output = await render.startRendering();
  return samplesToPcm16(output.getChannelData(0));
}
