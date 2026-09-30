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

  const fail = (message = "The line dropped. Try me again.") => {
    console.error("Savannah:", message);
    setUi("Try Savannah again", message, false);
  };

  try {
    const mod = await import("https://esm.sh/@vapi-ai/web@2.7.1?bundle");

    const candidates = [
      mod.default,
      mod.Vapi,
      mod.default && mod.default.default,
      mod.default && mod.default.Vapi,
    ];

    const VapiCtor = candidates.find((candidate) => typeof candidate === "function");

    if (!VapiCtor) {
      throw new TypeError("No Vapi constructor found in pinned browser bundle.");
    }

    // Safari/iPhone hardening:
    // - always include the microphone in Daily's permission prompt
    // - explicitly start with audio on
    const vapi = new VapiCtor(
      PUBLIC_KEY,
      undefined,
      { alwaysIncludeMicInPermissionPrompt: true },
      { audioSource: true, startAudioOff: false },
    );

    let live = false;
    let starting = false;
    let localAudioSeen = false;

    vapi.on("call-start-progress", (event) => {
      console.log("Savannah call progress", event);
    });

    vapi.on("local-volume-level", (volume) => {
      if (volume > 0.001) localAudioSeen = true;
    });

    vapi.on("call-start", () => {
      live = true;
      starting = false;
      setUi("End call", "I'm listening.", false);
    });

    vapi.on("call-start-failed", (event) => {
      console.error("Savannah call start failed", event);
      live = false;
      starting = false;
      fail("The audio line didn't open. Try me again.");
    });

    vapi.on("call-end", () => {
      live = false;
      starting = false;
      if (!localAudioSeen) {
        setUi("Try Savannah again", "I still didn't hear your microphone. Try me again.", false);
      } else {
        setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
      }
      localAudioSeen = false;
    });

    vapi.on("camera-error", (error) => {
      console.error("Savannah Daily camera/mic error", error);
    });

    vapi.on("error", (error) => {
      console.error("Savannah Vapi error", error);
      live = false;
      starting = false;
      fail();
    });

    if (!button) {
      throw new Error("Savannah call button not found.");
    }

    button.addEventListener("click", async () => {
      if (starting) return;

      if (live) {
        try {
          vapi.stop();
        } catch (error) {
          console.error("Savannah stop error", error);
        }
        return;
      }

      starting = true;
      localAudioSeen = false;
      setUi("Opening the line…", "Allow the microphone if Safari asks.", true);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("MIC_UNSUPPORTED");
        }

        // Give mobile Safari the full permitted join window. This is an
        // assistant override; Vapi's default web-call join timeout is 15s.
        await vapi.start(ASSISTANT_ID, {
          customerJoinTimeoutSeconds: 60,
        });
      } catch (error) {
        console.error("Savannah start error", error);
        starting = false;

        const message = error instanceof Error ? error.message : "";
        if (message === "MIC_UNSUPPORTED") {
          fail("This browser isn't giving me a microphone.");
        } else if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          error.name === "NotAllowedError"
        ) {
          fail("I need the microphone. Allow it for ctrlpluslove.com, then try again.");
        } else {
          fail();
        }
      }
    });

    setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
  } catch (error) {
    console.error("Savannah runtime failed", error);
    fail("Savannah's audio line didn't load. Try again.");
  }
}
