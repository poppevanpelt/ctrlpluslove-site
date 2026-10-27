"use client";

import { useEffect, useRef, useState } from "react";
import { MeetingQueue } from "./meeting-queue";

// Each segment is a complete media file; arbitrary MediaRecorder timeslices
// cannot reliably be decoded on their own, particularly on Safari.
const SEGMENT_MS = 20000;
const MAX_PENDING = 6;
const MEETING_DRAFT_KEY = 'savannah-meeting-transcript-v1';
type Props = { unavailable: boolean; speaking: boolean; onTranscript: (text: string) => void; onFlag: (text: string) => void; onComplete: (text: string) => void; onActive: (active: boolean) => void };

export default function MeetingListener(props: Props) {
  const callbacks = useRef(props);
  useEffect(() => { callbacks.current = props; });
  const [active, setActive] = useState(false);
  const [opening, setOpening] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [status, setStatus] = useState("She listens until you end the meeting.");
  const [retry, setRetry] = useState(false);
  const meetingWords = useRef<string[]>([]);
  const [wordsReady, setWordsReady] = useState(false);
  const [handoffStatus, setHandoffStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("Transcript not yet saved.");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MEETING_DRAFT_KEY);
      if (!saved) return;
      const data = JSON.parse(saved) as { words?: unknown };
      if (!Array.isArray(data.words)) return;
      const words = data.words.filter((word): word is string => typeof word === "string");
      meetingWords.current = words;
      setWordsReady(words.length > 0);
      if (words.length) setSaveStatus("Recovered transcript from this device.");
    } catch { setSaveStatus("Saved transcript could not be read. Do not clear browser data."); }
  }, []);
  function saveTranscript(words: string[]) {
    try {
      window.localStorage.setItem(MEETING_DRAFT_KEY, JSON.stringify({ words, savedAt: new Date().toISOString() }));
      setSaveStatus("Transcript saved on this device.");
    } catch { setSaveStatus("SAVE FAILED. Download the transcript before leaving."); }
  }
  function downloadTranscript() {
    const blob = new Blob([meetingWords.current.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "savannah-meeting-transcript.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const control = useRef<{ stop: () => void; retry: () => void; dispose: () => void } | null>(null);
  const generation = useRef(0);
  const mounted = useRef(true);
  const debriefStarted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; control.current?.dispose(); }; }, []);

  async function finishMeeting() {
    if (debriefStarted.current) return;
    debriefStarted.current = true;
    const transcript = meetingWords.current.join("\n").trim();
    if (!transcript) {
      setStatus("Meeting ended. No speech was transcribed.");
      control.current = null;
      setFinishing(false);
      callbacks.current.onActive(false);
      return;
    }
    setStatus("Transcript complete. Preparing your debrief…");
    try {
      const response = await fetch("/api/savannah-meeting-debrief", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
        signal: AbortSignal.timeout(50000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.text !== "string" || !result.text.trim()) {
        throw new Error(result?.error || "Debrief unavailable.");
      }
      callbacks.current.onComplete(result.text.trim());
      setStatus("Meeting debrief ready.");
    } catch {
      setStatus("Transcript saved on this device, but the debrief could not be generated. The transcript is still available to export.");
    } finally {
      control.current = null;
      setFinishing(false);
      callbacks.current.onActive(false);
    }
  }

  function performAutopsy() {
    if (active || finishing || !wordsReady) return;
    const origin = "https://ctrl-love-meeting-autopsy.lovable.app";
    const tab = window.open(origin + "/", "_blank");
    if (!tab) { setHandoffStatus("Allow pop-ups and try again. Nothing sent."); return; }
    const transcript = meetingWords.current.join("\n").slice(-90000);
    let sent = false;
    const receive = (event: MessageEvent) => {
      if (sent || event.origin !== origin || event.source !== tab || event.data?.type !== "CTRL_LOVE_AUTOPSY_READY" || event.data?.version !== 1) return;
      sent = true;
      window.removeEventListener("message", receive);
      window.clearTimeout(timeout);
      tab.postMessage({ type: "CTRL_LOVE_AUTOPSY_TRANSCRIPT", version: 1, transcript, source: "Savannah meeting" }, origin);
      setHandoffStatus("Transcript handed to Autopsy. Review it in the new tab.");
    };
    window.addEventListener("message", receive);
    const timeout = window.setTimeout(() => { window.removeEventListener("message", receive); if (!sent) setHandoffStatus("No connection confirmation. Try again."); }, 60000);
    setHandoffStatus("Waiting for the Autopsy to receive your transcript…");
  }

  async function start() {
    if (opening || active || control.current || props.unavailable) return;

    // A new meeting must never inherit words from the previous one. Archive
    // the old transcript first; if archiving fails, preserve it and refuse to
    // start rather than silently mixing or discarding meeting records.
    if (meetingWords.current.length) {
      const archivedAt = new Date().toISOString();
      const archiveKey = `savannah-meeting-transcript-archive-${Date.now()}`;
      try {
        window.localStorage.setItem(archiveKey, JSON.stringify({
          words: meetingWords.current,
          archivedAt,
          source: "Savannah meeting transcript",
        }));
        window.localStorage.setItem(MEETING_DRAFT_KEY, JSON.stringify({
          words: [],
          savedAt: archivedAt,
        }));
      } catch {
        setStatus("Could not safely archive the previous transcript. It has been preserved; export or clear storage space before starting another meeting.");
        return;
      }
      meetingWords.current = [];
      setWordsReady(false);
      setSaveStatus("Previous transcript archived on this device. New meeting starts clean.");
      setHandoffStatus("");
    }

    debriefStarted.current = false;
    setOpening(true);
    callbacks.current.onActive(true);
    setRetry(false);
    // The previous transcript has been archived above; this meeting starts empty.
    setHandoffStatus("");
    setStatus("Opening meeting microphone…");
    const token = ++generation.current;
    let stream: MediaStream | null = null;
    let context: AudioContext | null = null;
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("Meeting microphone is unavailable in this browser.");
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (!mounted.current || token !== generation.current) { stream.getTracks().forEach(t => t.stop()); return; }
      context = new AudioContext();
      await context.resume();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(type => MediaRecorder.isTypeSupported(type));
      const tracks = stream.getAudioTracks();
      const recordingStream = stream;
      const audioContext = context;
      let ended = false;
      let disposed = false;
      let capture: MediaRecorder | null = null;
      let interval = 0;
      let boundaryTimer = 0;
      let speechFrames = 0;
      let silenceAt = 0;
      let segmentStarted = 0;
      let resumeRecording: (() => void) | null = null;
      let accumulated = "";
      let analyzedLength = 0;
      let lastAnalysis = 0;
      let lastFlag = 0;
      const flags: string[] = [];
      const requests = new AbortController();
      const valid = () => !disposed && mounted.current && generation.current === token;
      const sayStatus = (text: string) => { if (valid()) setStatus(text); };
      let wake: WakeLockSentinel | null = null;
      async function keepAwake() {
        if (!ended && document.visibilityState === "visible" && navigator.wakeLock) {
          try { wake = await navigator.wakeLock.request("screen"); if (ended) void wake.release(); } catch { /* Screen-awake hint remains visible. */ }
        }
      }
      void keepAwake();
      const onVisibility = () => {
        if (document.hidden) sayStatus("Listening may pause while the screen is locked. Return to this page.");
        else { sayStatus(ended ? "Meeting ended." : "Meeting listening is active."); void keepAwake(); }
      };
      document.addEventListener("visibilitychange", onVisibility);
      async function judge() {
        if (ended || accumulated.length - analyzedLength < 150 || Date.now() - lastAnalysis < 30000 || Date.now() - lastFlag < 90000) return;
        const snapshot = accumulated;
        lastAnalysis = Date.now();
        try {
          const response = await fetch("/api/savannah-meeting", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: snapshot.slice(-18000), previousFlags: flags.slice(-6) }),
            signal: AbortSignal.any([requests.signal, AbortSignal.timeout(40000)]),
          });
          if (!response.ok) throw new Error("Judgment unavailable");
          const result = await response.json();
          if (!valid() || ended) return;
          analyzedLength = snapshot.length;
          if (typeof result.flag === "string" && result.flag.trim() && !flags.includes(result.flag)) {
            flags.push(result.flag); lastFlag = Date.now();
            callbacks.current.onFlag(result.flag);
          }
        } catch { if (valid() && !ended) sayStatus("Still listening. Judgment connection will retry on the next segment."); }
      }
      const queue = new MeetingQueue<Blob>(async blob => {
        if (!valid()) return;
        const form = new FormData();
        form.append("audio", blob, blob.type.includes("webm") ? "meeting.webm" : "meeting.m4a");
        let response: Response | undefined;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            response = await fetch("/api/savannah-transcribe", { method: "POST", body: form, signal: AbortSignal.any([requests.signal, AbortSignal.timeout(45000)]) });
            if (response.status < 500) break;
          } catch (error) { if (requests.signal.aborted || attempt === 1) throw error; }
        }
        if (!response) throw new Error("Recording upload failed");
        // Empty/silent recordings are expected during listening, not failures.
        if (response.status === 422) return;
        const result = await response.json();
        if (!response.ok || typeof result.text !== "string") throw new Error(result.error || "Recording upload failed");
        if (!valid()) return;
        const text = result.text.trim();
        if (!text) return;
        meetingWords.current.push(text);
        saveTranscript(meetingWords.current);
        setWordsReady(true);
        callbacks.current.onTranscript(text);
        accumulated += "\n" + text;
        // Keep a bounded working window; the visible transcript keeps all turns.
        if (accumulated.length > 24000) { accumulated = accumulated.slice(-18000); analyzedLength = 0; }
        await judge();
      }, (pending, blocked) => {
        if (!valid()) return;
        setRetry(blocked);
        if (blocked) sayStatus("Connection interrupted. Audio is held on this page. Tap RETRY to continue.");
        else if (ended && !pending) { void finishMeeting(); }
        else if (!ended) sayStatus(pending > 1 ? "Listening · catching up on the transcript…" : "Meeting listening is active.");
        if (!ended && !blocked && pending < MAX_PENDING && resumeRecording) { const resume = resumeRecording; resumeRecording = null; resume(); }
      });
      function beginSegment() {
        if (ended || !valid()) return;
        if (queue.paused || queue.pending >= MAX_PENDING) {
          resumeRecording = beginSegment;
          sayStatus("Microphone paused while the connection catches up. No queued audio discarded.");
          return;
        }
        const chunks: Blob[] = [];
        speechFrames = 0; silenceAt = 0; segmentStarted = performance.now();
        const segment = new MediaRecorder(recordingStream, mime ? { mimeType: mime, audioBitsPerSecond: 64000 } : { audioBitsPerSecond: 64000 });
        capture = segment;
        segment.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
        segment.onerror = () => { sayStatus("Microphone stopped unexpectedly. End the meeting and start again."); stop(); };
        segment.onstop = () => {
          window.clearTimeout(boundaryTimer);
          const hadSpeech = speechFrames >= 5;
          const blob = new Blob(chunks, { type: segment.mimeType || "audio/mp4" });
          // Start listening again before waiting for transcription or judgment.
          if (!ended && valid()) beginSegment();
          if (hadSpeech && blob.size && valid()) queue.add(blob);
          if (ended && !queue.pending && valid()) { void finishMeeting(); }
        };
        segment.start();
        boundaryTimer = window.setTimeout(() => { if (segment.state === "recording") segment.stop(); }, SEGMENT_MS);
      }
      function stop() {
        if (ended) return;
        ended = true;
        window.clearInterval(interval); window.clearTimeout(boundaryTimer);
        document.removeEventListener("visibilitychange", onVisibility);
        void wake?.release();
        if (capture?.state === "recording") capture.stop();
        recordingStream.getTracks().forEach(t => t.stop());
        source.disconnect(); void audioContext.close();
        if (valid()) { setActive(false); setFinishing(true); callbacks.current.onActive(false); sayStatus("Finishing the last transcript segment…"); }
      }
      function dispose() { disposed = true; stop(); queue.cancel(); requests.abort(); }
      control.current = { stop, dispose, retry: () => { setRetry(false); queue.retry(); } };
      recordingStream.getTracks().forEach(track => { track.onended = () => { if (!ended) { stop(); sayStatus("Microphone disconnected. Start the meeting again."); } }; });
      beginSegment();
      interval = window.setInterval(() => {
        if (ended || !valid()) return;
        // Keep her own output out of the transcript. Listening resumes as soon
        // as actual playback finishes; preparing an answer does not mute input.
        tracks.forEach(track => { track.enabled = !callbacks.current.speaking; });
        if (!capture || capture.state !== "recording" || callbacks.current.speaking) return;
        analyser.getFloatTimeDomainData(samples);
        let power = 0;
        for (const sample of samples) power += sample * sample;
        const now = performance.now();
        if (Math.sqrt(power / samples.length) > 0.018) { speechFrames++; silenceAt = 0; }
        else if (speechFrames >= 5) {
          if (!silenceAt) silenceAt = now;
          if (now - silenceAt > 1800 && now - segmentStarted > 2500) capture.stop();
        }
      }, 80);
      setActive(true);
      sayStatus("Meeting listening is active.");
    } catch (error) {
      stream?.getTracks().forEach(t => t.stop()); void context?.close();
      if (mounted.current) { callbacks.current.onActive(false); setStatus(error instanceof Error ? error.message : "Could not open the meeting microphone."); }
    } finally { if (mounted.current) setOpening(false); }
  }

  return <section className="meeting-listener" aria-label="Meeting listening">
    <div><button type="button" onClick={() => active ? control.current?.stop() : void start()} disabled={opening || (!active && (props.unavailable || finishing))}>{opening ? "OPENING…" : active ? "END MEETING" : "START MEETING"}</button>
      {retry && <button type="button" onClick={() => control.current?.retry()}>RETRY CONNECTION</button>}
      {wordsReady && <button type="button" onClick={downloadTranscript}>DOWNLOAD TRANSCRIPT</button>}
      {!active && !finishing && wordsReady && <button type="button" onClick={performAutopsy}>PERFORM AUTOPSY ↗</button>}
      {!active && !finishing && wordsReady && <button type="button" onClick={() => {
        if (!window.confirm("Delete the recovered meeting transcript from this device? Download it first.")) return;
        meetingWords.current = []; setWordsReady(false);
        window.localStorage.removeItem(MEETING_DRAFT_KEY);
        setSaveStatus("Previous transcript cleared.");
      }}>CLEAR TRANSCRIPT</button>}</div>
    {handoffStatus && <p role="status">{handoffStatus}</p>}
    <p role="status">{status}</p>
    <p role="status">{saveStatus}</p>
    <small>{active ? "KEEP THIS PAGE OPEN AND SCREEN AWAKE · SHE FLAGS ONLY WHEN USEFUL" : "Let everyone know Savannah is listening. Audio is sent for transcription; the transcript stays on this page."}</small>
    <style jsx>{`
      .meeting-listener { flex-shrink:0; padding:9px 14px; background:#eeeae1; border-top:1px solid #c9c2b9; color:#292521; }
      .meeting-listener div { display:flex; gap:8px; }
      button { border:1px solid #5f584e; background:transparent; padding:9px 12px; font:700 10px Arial,sans-serif; letter-spacing:.09em; cursor:pointer; }
      button:disabled { opacity:.45; cursor:default; }
      p { font:12px/1.4 Arial,sans-serif; margin:6px 0 3px; }
      small { display:block; font:9px/1.4 Arial,sans-serif; letter-spacing:.035em; color:#6d6559; }
    `}</style>
  </section>;
}
