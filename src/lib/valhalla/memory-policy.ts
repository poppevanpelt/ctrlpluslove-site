export type MemoryKind = "outcome" | "opposition" | "repair";
export type MemoryInput = {
 kind: MemoryKind;
 note: string;
 observedAt: string;
 consent: boolean;
 sourceReference?: string;
};
export function parseMemoryInput(value: unknown): MemoryInput | null {
 if (!value || typeof value !== "object" || Array.isArray(value)) return null;
 const x=value as Record<string,unknown>;
 if (x.consent!==true || !["outcome","opposition","repair"].includes(String(x.kind))) return null;
 if (typeof x.note!=="string" || !x.note.trim() || x.note.length>4000) return null;
 if (typeof x.observedAt!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(x.observedAt)) return null;
 const timestamp=Date.parse(x.observedAt+"T00:00:00Z");
 if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0,10)!==x.observedAt) return null;
 if (timestamp>Date.now()+86400000) return null;
 if (x.sourceReference!==undefined &&
    (typeof x.sourceReference!=="string" || x.sourceReference.length>1000)) return null;
 // Outcomes are human statements, not verified results. Never infer independent evidence.
 const sourceReference=typeof x.sourceReference==="string" ? x.sourceReference.trim() : undefined;
 return {kind:x.kind as MemoryKind,note:x.note.trim(),observedAt:x.observedAt,consent:true,
  ...(sourceReference?{sourceReference}:{})};
}
