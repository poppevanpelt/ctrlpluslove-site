# ctrl+love v2 — Phase 2 Implementation Plan

Created: 2026-07-14  
Source: `INSTITUTION_BLUEPRINT.md`, `EXPERIENCE_AUDIT.md`, and current public route inventory.  
Scope: experience architecture roadmap. Do not begin broad implementation without an explicit implementation request.

## Planning Posture

Phase 1 made the repository technically safer. Phase 2 should not reopen engineering, performance, accessibility, SEO, or security unless they block the experience work.

The work now is institutional: make the visitor experience the Room, receive proof, discover the world, and leave wanting every important decision to have one.

All work should pass the v2 gate:

> Does this make the Room feel more necessary?

If no, reject or defer it.

## Sprint Overview

| Sprint | Theme | Target outcome | Estimated effort |
| --- | --- | --- | --- |
| Sprint 1 | The Room Becomes the Spine | Homepage, Room, and Living Decision Review share one dramatic decision arc. | 6-9 working days |
| Sprint 2 | The Artifact and Diagnosis | Decision Artifact system and pricing diagnosis make the method tangible and commercial. | 6-10 working days |
| Sprint 3 | The Institution Connects | Museum, departments, Constitution, Steel Ball, AI-y-fier, and Meeting Filter become one world. | 7-11 working days |
| Sprint 4 | Around the Table and Founder-Editor | Ambassadors become seats; Poppe becomes the editor layer; satellite pages are clarified. | 5-8 working days |

Total estimated effort: 24-38 working days.

## Dependencies

| Dependency | Needed for | Notes |
| --- | --- | --- |
| One canonical sample decision | Homepage, Living Decision Review, Room page, sample artifact | Use one decision across multiple surfaces so v2 feels coherent quickly. |
| Decision Artifact content model | Homepage, Stress Test, Pricing, Living Review, Artifacts | Define fields before designing multiple output moments. |
| Room perspective roles | Homepage mini-room, Room page, Living Review | Clarify whether a name is persona, lens, ambassador, or human seat. |
| Commercial offer mapping | Pricing Diagnosis, Stress Test, On-Call, Kill or Scale | Each offer must map to a consequence the visitor wants to avoid. |
| Founder-editor voice rules | Homepage note, Constitution, Inside, Pricing, Decision Review | Write these before scattering founder copy across pages. |
| Institution taxonomy | Inside, Museum, Departments, Constitution, Artifacts | Agree on center, systems, and page roles before adding cross-links. |
| Asset readiness | Museum, Steel Ball, Artifacts, departments | Avoid building artifact moments around missing or placeholder imagery. |

## Sprint 1 — The Room Becomes the Spine

### Objective

Make the first public experience a decision under pressure. The visitor should understand the Room by watching judgment change.

### Work

| Order | Task | Estimate | Dependencies | Notes |
| ---: | --- | --- | --- | --- |
| 1 | Choose or refine one canonical sample decision used across homepage, Room, and Living Decision Review. | 0.5 day | None | Current "launch campaign platform now" can work if stakes become more vivid. |
| 2 | Define the dramatic beat sheet: initial recommendation, pressure one, evidence, turning point, reframed question, final recommendation, artifact. | 0.5-1 day | Task 1 | Keep it short enough for homepage and rich enough for proof page. |
| 3 | Redesign homepage narrative order around the mini-room: decision enters, Room thinks, artifact appears, institution opens. | 1-1.5 days | Tasks 1-2 | Planning/design first; implementation only after approval. |
| 4 | Convert `/room/` from persona directory to "Watch the Room Think" architecture. | 1-1.5 days | Tasks 1-2 | Preserve persona data, but reveal people through disagreement. |
| 5 | Elevate `/living-decision-review/` into canonical proof architecture. | 1-2 days | Tasks 1-2 | Add stronger credibility, stakes, editor note, and artifact ending. |
| 6 | Define where homepage links to Stress Test, Pricing Diagnosis, Institution, and Living Review. | 0.5 day | Tasks 3-5 | CTAs should escalate rather than repeat. |
| 7 | Write implementation acceptance criteria for the sprint. | 0.5 day | Tasks 3-6 | Include emotional outcome, not only UI completion. |

### Deliverables

- Homepage v2 narrative spec.
- Room page v2 spec.
- Living Decision Review v2 spec.
- Canonical sample decision beat sheet.
- CTA and route flow map.

### Acceptance Criteria

- A first-time visitor can describe the Room after one minute without reading a process explanation.
- The homepage contains a visible decision, disagreement, confidence shift, and changed recommendation.
- The Room page no longer relies on reading profile cards to understand the system.
- Living Decision Review becomes the obvious proof page.

## Sprint 2 — The Artifact and Diagnosis

### Objective

Make the output tangible and the commercial path diagnostic. Visitors should see what they receive and understand which Room fits their consequence.

### Work

| Order | Task | Estimate | Dependencies | Notes |
| ---: | --- | --- | --- | --- |
| 1 | Define the Decision Artifact content model. | 0.5-1 day | Sprint 1 sample decision | Suggested fields: original decision, revised decision, stakes, pressure applied, contradiction, confidence shift, protect, kill, make braver, next move. |
| 2 | Design a sample artifact for the canonical decision. | 1-1.5 days | Task 1 | It should feel printable, collectible, and severe. |
| 3 | Add artifact placement specs for homepage, Living Review, Stress Test, and Artifacts archive. | 0.5-1 day | Task 2 | Same system, different levels of detail. |
| 4 | Redesign `/pricing/` as Diagnosis around "What consequence are you trying to avoid?" | 1-2 days | Offer mapping | Outputs: Stress-Test, On-Call Room, Kill or Scale, or Meeting Filter / polite no. |
| 5 | Reframe offer pages around consequence, room behavior, artifact, and next step. | 1.5-2.5 days | Tasks 1-4 | Preserve visible pricing and clarity. |
| 6 | Decide the role of `/pricing-documents/`: fold into Diagnosis or formalize as Commercial Files archive. | 0.5 day | Task 4 | Avoid duplicate commercial shelves. |
| 7 | Define inquiry/admission language for each offer. | 0.5-1 day | Tasks 4-5 | "Bring this decision" remains strong, but each offer needs specific context. |

### Deliverables

- Decision Artifact model.
- Sample Decision Artifact.
- Pricing Diagnosis spec.
- Offer page reframing notes.
- Commercial route decision for `/pricing-documents/`.

### Acceptance Criteria

- The visitor can see exactly what kind of output the Room produces.
- Pricing feels like a diagnosis, not a menu.
- Each offer maps to a consequence, not a feature bundle.
- The Decision Artifact becomes the primary proof object.

## Sprint 3 — The Institution Connects

### Objective

Connect the world. Museum, Steel Ball, departments, Constitution, Meeting Filter, AI-y-fier, and artifacts should feel like parts of one institution, not brilliant separate rooms.

### Work

| Order | Task | Estimate | Dependencies | Notes |
| ---: | --- | --- | --- | --- |
| 1 | Redesign `/inside-ctrl-love/` as the institutional map. | 1-1.5 days | Institution taxonomy | Center it on reality contact, not navigation. |
| 2 | Define the department system: each department gets a rule, behavior, artifact, and Room connection. | 1-1.5 days | Institution taxonomy | Reality Preservation, Necessary Elimination, Irreversible Decisions, Essential Things, Consequential Belief, Unanswered Questions. |
| 3 | Add department page framing specs and next-step logic. | 1-2 days | Task 2 | Posters should lead to a live behavior or relevant Room move. |
| 4 | Reframe `/museum/` as Museum of decision consequences. | 1 day | Artifact model | Each object needs a lesson and room behavior. |
| 5 | Reframe `/artifacts/` as archive of provenance and Decision Artifacts. | 1-1.5 days | Artifact model and asset readiness | Avoid placeholder feeling. |
| 6 | Strengthen `/steel-ball/` as Artifact 001 and define waitlist ritual. | 0.5-1 day | Museum framing | "Apply with the decision it must protect." |
| 7 | Bridge `/ai-y-fier/` to Reality Preservation. | 0.5-1 day | Department system | Inflated text should resolve into a serious Room action. |
| 8 | Bridge `/meeting-filter/` to admission and polite-no artifacts. | 0.5-1 day | Pricing Diagnosis | Red, amber, and green outputs should all produce value. |
| 9 | Expand `/constitution/` into visible articles and annotations. | 1 day | Founder-editor voice rules | Show before download. |

### Deliverables

- Institutional map page spec.
- Department system spec.
- Museum and artifact archive reframing.
- Steel Ball waitlist ritual spec.
- AI-y-fier and Meeting Filter bridge specs.
- Constitution article preview spec.

### Acceptance Criteria

- Every institutional page can answer: what does this protect in the Room?
- The Museum and Steel Ball make business seriousness stronger, not softer.
- The departments become operating behaviors, not decorative posters.
- The Constitution has visible rules before asking for a download.

## Sprint 4 — Around the Table and Founder-Editor

### Objective

Turn people into institutional trust. Ambassadors become active seats around the table. Poppe becomes the founder-editor layer at the exact moments where authorship creates confidence.

### Work

| Order | Task | Estimate | Dependencies | Notes |
| ---: | --- | --- | --- | --- |
| 1 | Define the Around the Table model. | 0.5-1 day | Room perspective roles | Fields: seat, pressure applied, blind spot caught, when they enter, decision changed. |
| 2 | Redesign `/ambassadors/` as active table, not directory. | 1.5-2 days | Task 1 | Group by pressure or decision moment rather than generic profile browsing. |
| 3 | Redesign `/ambassadors/[slug]/` as individual seat file. | 1-2 days | Task 1 | Preserve credibility, add room behavior. |
| 4 | Define founder-editor voice placements. | 0.5-1 day | Founder voice rules | Homepage, Inside, Constitution, Pricing, Living Review, selected artifacts. |
| 5 | Write first batch of founder-editor notes. | 1-1.5 days | Task 4 | Keep them short, observational, and non-promotional. |
| 6 | Audit satellite pages `/rob/` and `/marjan/` for public institutional role. | 0.5 day | Institution map | Keep, reframe, or remove from public journey. |
| 7 | Final v2 route journey QA against emotional outcome. | 0.5-1 day | Sprints 1-4 | Walk Minute 0, Minute 1, Minute 3, Minute 10, one week later. |

### Deliverables

- Around the Table model.
- Ambassador page specs.
- Founder-editor placement and copy system.
- Satellite page disposition.
- Final v2 journey QA notes.

### Acceptance Criteria

- Ambassadors clearly explain how decisions change because they enter.
- Poppe appears as editor, not promoter.
- Satellite pages either belong to the institution or leave the public route system.
- The full experience coheres around the Room.

## Recommended Implementation Order

1. Finalize the canonical sample decision and beat sheet.
2. Build or spec the Decision Artifact model before redesigning too many pages.
3. Redesign homepage, Room, and Living Decision Review together.
4. Turn Pricing into Diagnosis only after the artifact model is clear.
5. Connect institution pages after the core Room journey works.
6. Convert ambassadors into Around the Table after the Room behavior is visible.
7. Add founder-editor notes last enough to respond to the system, not paper over gaps.

## Low-Risk Changes That Could Be Implemented Early

These are small enough to consider before a full redesign sprint:

- Add a short founder-editor line to `/inside-ctrl-love/`.
- Add a visible excerpt to `/constitution/`.
- Add "Every object is a decision lesson" framing to `/museum/`.
- Add "Watch the Room think" language earlier on `/room/`.
- Add a stronger link from `/living-decision-review/` to `/stress-test/`.
- Add "What consequence are you trying to avoid?" as the leading question on `/pricing/`.

Even these should be checked against the v2 gate before implementation.

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| The institution becomes too fictional | Buyers may admire the world but not trust the service | Anchor every theatrical moment to a real decision behavior, artifact, or consequence. |
| Poppe becomes too central | The brand may feel personality-led rather than institution-led | Use founder-editor notes sparingly and only where authorship creates trust. |
| The homepage becomes too complex | First-time visitors may miss the offer | Keep the first room short, legible, and tied to one decision. |
| Ambassadors remain decorative | The network fails to differentiate the Room | Show pressure applied and decisions changed, not just biographies. |
| Artifacts become pretty reports | The output loses institutional force | Make artifacts concise, severe, and tied to changed judgment. |
| Commercial paths become too mysterious | High-intent buyers may not act | Pricing Diagnosis must stay clear, with visible fees and next steps. |

## Final Success Criterion

Phase 2 succeeds only if a visitor can say, without being taught the line:

> I wish every important decision had one of those rooms.

The site should earn that thought through experience: a decision under pressure, a judgment that changes, an artifact that proves something happened, an institution that makes reality contact feel protected, and a clear invitation to bring the next decision in.

