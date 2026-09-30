const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";

if (!window.__savannahRuntimeLoaded) {
  window.__savannahRuntimeLoaded = true;

  const button = document.getElementById("savannah-call-button");
  const presence = document.getElementById("savannah-presence");

  const setUi = (label, line, disabled = false) => {
    if (button) {
      button.textContent = label;
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.68" : "1";
      button.style.cursor = disabled ? "default" : "pointer";
    }
    if (presence) presence.textContent = line;
  };

  const stopStream = (stream) => {
    try {
      stream?.getTracks?.().forEach((track) => track.stop());
    } catch {}
  };

  const fail = (message) => {
    setUi("Try Savannah again", message || "The audio line dropped. Try me again.", false);
  };

  if (!button) {
    console.error("Savannah call button not found.");
  } else {
    try {
      const mod = await import("https://esm.sh/@vapi-ai/web@2.7.1?bundle");
      const candidates = [
        mod.default,
        mod.Vapi,
        mod.default && mod.default.default,
        mod.default && mod.default.Vapi,
      ];
      const VapiCtor = candidates.find((candidate) => typeof candidate === "function");
      if (!VapiCtor) throw new Error("No Vapi constructor found.");

      let vapi = null;
      let micStream = null;
      let micTrack = null;
      let live = false;
      let starting = false;

      const cleanup = () => {
        stopStream(micStream);
        micStream = null;
        micTrack = null;
        vapi = null;
        live = false;
        starting = false;
      };

      const start = async () => {
        if (starting || live) return;

        starting = true;
        setUi("Opening microphone…", "Safari should show the orange microphone indicator.", true);

        try {
          if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("MIC_UNSUPPORTED");
          }

          // Acquire the exact iPhone microphone track from the user's tap and
          // keep that same track alive all the way into Daily/Vapi.
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
            video: false,
          });

          micTrack = micStream.getAudioTracks()[0];
          if (!micTrack || micTrack.readyState !== "live") {
            throw new Error("NO_LIVE_MIC_TRACK");
          }
          micTrack.enabled = true;

          setUi("Connecting…", "Microphone is live. Opening Savannah.", true);

          vapi = new VapiCtor(
            PUBLIC_KEY,
            undefined,
            { alwaysIncludeMicInPermissionPrompt: true },
            { audioSource: micTrack, startAudioOff: false },
          );

          vapi.on("local-volume-level", () => {
            // Useful for diagnostics, but never use this observer as a proxy for call health.
          });

          vapi.on("call-start", () => {
            live = true;
            starting = false;
            setUi("End call", "I'm listening.", false);
          });

          vapi.on("call-end", () => {
            cleanup();
            setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
          });

          vapi.on("call-start-failed", (event) => {
            console.error("Savannah call-start-failed", event);
            cleanup();
            fail("The call could not open. Try me again.");
          });

          vapi.on("error", (error) => {
            console.error("Savannah Vapi error", error);

            const type = error && typeof error === "object" ? error.type : "";
            const stage = error && typeof error === "object" ? error.stage : "";
            const nonFatal =
              type === "audio-observer-setup-error" ||
              type === "audio-processing-setup-error" ||
              stage === "audio-observer-setup" ||
              stage === "audio-processing-setup";

            // Vapi explicitly treats these setup errors as non-critical. Mobile Safari
            // can emit them even when the Daily call itself is alive, so do not tear
            // Savannah down merely because an audio-level/processing observer failed.
            if (nonFatal) return;

            cleanup();
            fail("The audio line dropped. Try me again.");
          });

          await vapi.start(ASSISTANT_ID, {
            customerJoinTimeoutSeconds: 60,
          });

          // If Vapi returns without ever announcing call-start, keep the UI
          // honest rather than pretending the line is live.
          if (!live && starting) {
            starting = false;
            fail("The call did not finish connecting. Try me again.");
          }
        } catch (error) {
          console.error("Savannah microphone/start error", error);
          const name = error && typeof error === "object" && "name" in error ? error.name : "";
          const message = error instanceof Error ? error.message : "";
          cleanup();

          if (name === "NotAllowedError") {
            fail("Microphone access is blocked. Allow it for ctrlpluslove.com, then try again.");
          } else if (message === "MIC_UNSUPPORTED") {
            fail("This browser is not exposing a microphone.");
          } else if (message === "NO_LIVE_MIC_TRACK") {
            fail("Safari opened no live microphone track. Try again outside Private Browsing.");
          } else {
            fail("The microphone could not open. Try me again.");
          }
        }
      };

      button.addEventListener("click", async () => {
        if (live && vapi) {
          try {
            vapi.stop();
          } catch (error) {
            console.error("Savannah stop error", error);
            cleanup();
            setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
          }
          return;
        }
        await start();
      });

      setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
    } catch (error) {
      console.error("Savannah runtime failed", error);
      fail("Savannah's audio line did not load. Try again.");
    }
  }
}
