import * as mod from "https://esm.sh/@vapi-ai/web@2.7.1?bundle";

const candidates = [
  mod.default,
  mod.Vapi,
  mod.default && mod.default.default,
  mod.default && mod.default.Vapi,
];

const VapiCtor = candidates.find((candidate) => typeof candidate === "function");

if (!VapiCtor) {
  window.dispatchEvent(
    new CustomEvent("savannah-vapi-error", {
      detail: "No Vapi constructor found in the pinned browser bundle.",
    }),
  );
} else {
  window.__SavannahVapiCtor = VapiCtor;
  window.dispatchEvent(new Event("savannah-vapi-ready"));
}
