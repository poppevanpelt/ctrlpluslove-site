export type MemoryKind = "outcome" | "opposition" | "repair";
export type MemoryInput = { kind: MemoryKind; note: string; observedAt: string; consent: boolean };
export function parseMemoryInput(value: unknown): MemoryInput | null {
 if(!value || typeof value!=="object") return null;
 const x=value as Record<string,unknown>;
 if(x.consent!==true || !["outcome","opposition","repair"].includes(String(x.kind))) return null;
 if(typeof x.note!=="string" || !x.note.trim() || x.note.length>4000) return null;
 if(typeof x.observedAt!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(x.observedAt) || !Number.isFinite(Date.parse(x.observedAt)))return null;
 if(Date.parse(x.observedAt)>Date.now()+86400000)return null;
 return {kind:x.kind as MemoryKind,note:x.note.trim(),observedAt:x.observedAt,consent:true};
}
