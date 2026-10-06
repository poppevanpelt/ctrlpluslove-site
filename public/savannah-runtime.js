const PUBLIC_KEY = "12382a58-9f0f-41fe-ba94-257368be07cb";
const ASSISTANT_ID = "4289b114-3dca-4052-9684-13c3435bd0a4";

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

      // Keep this deliberately boring. Vapi's documented browser integration is:
      // new Vapi(publicKey) -> vapi.start(assistantId).
      // Let the SDK/Daily own microphone acquisition and Safari audio plumbing.
      const vapi = new VapiCtor(PUBLIC_KEY);
      let live = false;
      let starting = false;

      vapi.on("call-start", () => {
        live = true;
        starting = false;
        setUi("End call", "I'm listening.", false);
      });

      vapi.on("call-end", () => {
        live = false;
        starting = false;
        setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
      });

      vapi.on("call-start-failed", (event) => {
        console.error("Savannah call-start-failed", event);
        live = false;
        starting = false;
        fail("The call could not open. Try me again.");
      });

      // Important: do not tear a live call down from the generic error event.
      // On mobile Safari the SDK can surface recoverable audio/Daily warnings here.
      // A rejected start(), call-start-failed, or call-end is authoritative.
      vapi.on("error", (error) => {
        console.error("Savannah Vapi error", error);
      });

      button.addEventListener("click", async () => {
        if (live) {
          try {
            vapi.stop();
          } catch (error) {
            console.error("Savannah stop error", error);
            live = false;
            starting = false;
            setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
          }
          return;
        }

        if (starting) return;

        starting = true;
        setUi("Connecting…", "Opening Savannah.", true);

        try {
          await vapi.start(ASSISTANT_ID);
        } catch (error) {
          console.error("Savannah start error", error);
          live = false;
          starting = false;

          const name =
            error && typeof error === "object" && "name" in error ? error.name : "";

          if (name === "NotAllowedError") {
            fail("Microphone access is blocked. Allow it for ctrlpluslove.com, then try again.");
          } else {
            fail("The call could not open. Try me again.");
          }
        }
      });

      setUi("Talk to Savannah", "Morning. What are we trying to decide?", false);
    } catch (error) {
      console.error("Savannah runtime failed", error);
      fail("Savannah's audio line did not load. Try again.");
    }
  }
}
