"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  createRoom,
  createSeedRooms,
  emptyFrame,
  evaluateFraming,
  exportRoomMarkdown,
  hasLensDiversityWarning,
  lensOptions,
  outputFormats,
  participantPool,
  runChallengeResponses,
  updateDisagreementClassification,
} from "../../lib/room-runner/engine";
import type {
  DecisionQuestion,
  DisagreementClassification,
  OutputFormat,
  Participant,
  Room,
  RoomType,
} from "../../lib/room-runner/types";
import { ThemeToggle } from "../theme-toggle";

const roomTypes: RoomType[] = [
  "Decision Room",
  "Creative Room",
  "Cultural Room",
  "Challenge Room",
  "Review Room",
  "Fast Room",
];

const classifications: DisagreementClassification[] = [
  "Productive",
  "Superficial",
  "Needs evidence",
  "Must resolve",
  "Preserve as tension",
];

const storageKey = "ctrl-love-room-runner-rooms";

export function RoomRunnerClient() {
  const [rooms, setRooms] = useState<Room[]>(() => {
    if (typeof window === "undefined") return createSeedRooms();

    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return createSeedRooms();

    try {
      const parsed = JSON.parse(saved) as Room[];
      return Array.isArray(parsed) && parsed.length ? parsed : createSeedRooms();
    } catch {
      return createSeedRooms();
    }
  });
  const [activeRoomId, setActiveRoomId] = useState<string>("");
  const [frame, setFrame] = useState<DecisionQuestion>(emptyFrame);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>(
    () =>
      participantPool.filter((participant) =>
        ["mats-utberg", "umberto-bartolini", "jorge-virgos"].includes(participant.id),
      ),
  );
  const [customName, setCustomName] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("Ambassador dispatch");
  const [copyNotice, setCopyNotice] = useState("");

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? rooms[0],
    [activeRoomId, rooms],
  );
  const framingIssues = evaluateFraming(frame);
  const diversityWarning = hasLensDiversityWarning(selectedParticipants);

  function updateFrame<K extends keyof DecisionQuestion>(
    key: K,
    value: DecisionQuestion[K],
  ) {
    setFrame((current) => ({ ...current, [key]: value }));
  }

  function toggleParticipant(participant: Participant) {
    setSelectedParticipants((current) =>
      current.some((item) => item.id === participant.id)
        ? current.filter((item) => item.id !== participant.id)
        : [...current, { ...participant }],
    );
  }

  function updateParticipant(id: string, updates: Partial<Participant>) {
    setSelectedParticipants((current) =>
      current.map((participant) => {
        if (participant.id !== id) return participant;
        return { ...participant, ...updates };
      }),
    );
  }

  function setExclusiveRole(id: string, role: "isSceptic" | "isFacilitator") {
    setSelectedParticipants((current) =>
      current.map((participant) => ({
        ...participant,
        [role]: participant.id === id ? !participant[role] : false,
      })),
    );
  }

  function addCustomParticipant() {
    const name = customName.trim();
    if (!name) return;

    const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setSelectedParticipants((current) => [
      ...current,
      {
        id,
        name,
        kind: "Synthetic persona",
        locationOrRole: "Custom prototype role",
        primaryLens: "Custom Lens",
        assignedLens: "Custom Lens",
        description: "A custom prototype participant added by Poppe.",
        reasonToInclude: "Added to test a missing perspective.",
        likelyTension: "The likely tension still needs to be named.",
      },
    ]);
    setCustomName("");
  }

  function runRoom(status: Room["status"] = "Complete") {
    const room = createRoom(frame, selectedParticipants, outputFormat, status);
    setRooms((current) => [room, ...current]);
    setActiveRoomId(room.id);
    setCopyNotice("Room run created locally. Real human responses are still awaited.");
  }

  function saveRooms() {
    window.localStorage.setItem(storageKey, JSON.stringify(rooms));
    setCopyNotice("Room records saved in this browser.");
  }

  function duplicateRoom(room: Room) {
    const duplicate: Room = {
      ...room,
      id: `room-${Date.now()}`,
      title: `${room.title} copy`,
      lastUpdated: "2026-07-15",
      status: "Ready to run",
    };
    setRooms((current) => [duplicate, ...current]);
    setActiveRoomId(duplicate.id);
  }

  async function copyText(text: string, notice: string) {
    await window.navigator.clipboard.writeText(text);
    setCopyNotice(notice);
  }

  function updateRoom(updatedRoom: Room) {
    setRooms((current) =>
      current.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)),
    );
  }

  function updateActiveRoomField(section: "synthesis" | "decision" | "output", key: string, value: string) {
    if (!activeRoom) return;
    updateRoom({
      ...activeRoom,
      [section]: {
        ...activeRoom[section],
        [key]: value,
      },
      lastUpdated: "2026-07-15",
    });
  }

  function rerunChallenges() {
    if (!activeRoom) return;
    updateRoom({
      ...activeRoom,
      positions: runChallengeResponses(activeRoom.positions, activeRoom.challenges),
      status: activeRoom.frame.roomType === "Fast Room" ? "In synthesis" : "Running",
      lastUpdated: "2026-07-15",
    });
  }

  return (
    <main className="site-shell room-runner-page">
      <ThemeToggle />
      <section className="room-runner-hero">
        <div className="room-runner-topline">
          <Link className="back-home-link" href="/">
            ← Home
          </Link>
          <span>Internal prototype</span>
        </div>
        <div className="room-runner-hero-copy">
          <p className="section-kicker">Room Runner</p>
          <h1>No meaningful ctrl+love recommendation without a visible discussion lineage.</h1>
          <p>
            Turn one decision question into separate positions, visible friction,
            a challenge round, synthesis, a decision record, and an editable draft output.
          </p>
        </div>
      </section>

      <section className="room-runner-dashboard" aria-labelledby="runner-dashboard-title">
        <div className="room-runner-section-head">
          <div>
            <p className="section-kicker">Dashboard</p>
            <h2 id="runner-dashboard-title">Rooms in motion</h2>
          </div>
          <button className="runner-button is-dark" type="button" onClick={() => runRoom("Ready to run")}>
            Create from current frame
          </button>
        </div>

        <div className="room-status-strip" aria-label="Room statuses">
          {["Ready to run", "Running", "In synthesis", "Complete", "Needs rerun"].map((status) => (
            <span key={status}>{status}</span>
          ))}
        </div>

        <div className="room-card-grid">
          {rooms.map((room) => (
            <button
              className={`room-record-card ${room.id === activeRoom?.id ? "is-active" : ""}`}
              key={room.id}
              type="button"
              onClick={() => setActiveRoomId(room.id)}
            >
              <span>{room.status}</span>
              <strong>{room.frame.question}</strong>
              <small>{room.frame.project} · {room.frame.roomType}</small>
              <em>
                {room.participants.length} participants · {room.confidence}% confidence · {room.unresolvedTensionsCount} tensions
              </em>
              <small>Updated {room.lastUpdated}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="room-runner-workspace">
        <div className="runner-step" id="frame-question">
          <StepHeader number="01" title="Frame the question" kicker="Decision first" />
          <div className="runner-form-grid">
            <label>
              Project
              <input value={frame.project} onChange={(event) => updateFrame("project", event.target.value)} />
            </label>
            <label className="runner-question-field">
              Decision Question
              <textarea value={frame.question} onChange={(event) => updateFrame("question", event.target.value)} />
            </label>
            <label>
              Why now?
              <textarea value={frame.whyNow} onChange={(event) => updateFrame("whyNow", event.target.value)} />
            </label>
            <label>
              Desired output
              <textarea value={frame.desiredOutput} onChange={(event) => updateFrame("desiredOutput", event.target.value)} />
            </label>
            <label>
              Working assumption
              <textarea value={frame.workingAssumption} onChange={(event) => updateFrame("workingAssumption", event.target.value)} />
            </label>
            <label>
              Room type
              <select value={frame.roomType} onChange={(event) => updateFrame("roomType", event.target.value as RoomType)}>
                {roomTypes.map((roomType) => <option key={roomType}>{roomType}</option>)}
              </select>
            </label>
            <label>
              Optional context
              <textarea value={frame.context} onChange={(event) => updateFrame("context", event.target.value)} />
            </label>
            <label>
              Optional evidence
              <textarea value={frame.evidence} onChange={(event) => updateFrame("evidence", event.target.value)} />
            </label>
            <label>
              Final decision owner
              <input value={frame.owner} onChange={(event) => updateFrame("owner", event.target.value)} />
            </label>
            <label>
              Draft output format
              <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}>
                {outputFormats.map((format) => <option key={format}>{format}</option>)}
              </select>
            </label>
          </div>
          <div className="quality-panel">
            <strong>Framing quality</strong>
            <span>{100 - framingIssues.length * 18}%</span>
            {framingIssues.length ? (
              <ul>
                {framingIssues.map((issue) => (
                  <li key={issue.type}><b>{issue.label}</b> {issue.guidance}</li>
                ))}
              </ul>
            ) : (
              <p>The question is specific enough to enter the Room.</p>
            )}
          </div>
        </div>

        <div className="runner-step">
          <StepHeader number="02" title="Select participants" kicker="Lenses before answers" />
          {diversityWarning ? (
            <p className="runner-warning">Diversity warning: the selected room is leaning on similar lenses. Add cultural, commercial, contrarian, or execution pressure.</p>
          ) : null}
          <div className="participant-pool">
            {participantPool.map((participant) => {
              const selected = selectedParticipants.some((item) => item.id === participant.id);
              const editable = selectedParticipants.find((item) => item.id === participant.id);
              return (
                <article className={`participant-card ${selected ? "is-selected" : ""}`} key={participant.id}>
                  <div>
                    <span>{participant.kind}</span>
                    <h3>{participant.name}</h3>
                    <p>{participant.locationOrRole} · {participant.primaryLens}</p>
                  </div>
                  <p>{participant.description}</p>
                  <dl>
                    <div><dt>Include because</dt><dd>{participant.reasonToInclude}</dd></div>
                    <div><dt>Tension</dt><dd>{participant.likelyTension}</dd></div>
                  </dl>
                  <button className="runner-button" type="button" onClick={() => toggleParticipant(participant)}>
                    {selected ? "Remove" : "Add"}
                  </button>
                  {editable ? (
                    <div className="participant-controls">
                      <label>
                        Assigned lens
                        <select value={editable.assignedLens} onChange={(event) => updateParticipant(editable.id, { assignedLens: event.target.value })}>
                          {lensOptions.map((lens) => <option key={lens}>{lens}</option>)}
                        </select>
                      </label>
                      <button type="button" className={editable.isSceptic ? "runner-pill is-on" : "runner-pill"} onClick={() => setExclusiveRole(editable.id, "isSceptic")}>Sceptic</button>
                      <button type="button" className={editable.isFacilitator ? "runner-pill is-on" : "runner-pill"} onClick={() => setExclusiveRole(editable.id, "isFacilitator")}>Facilitator</button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
          <div className="custom-participant">
            <input aria-label="Custom participant name" placeholder="Add custom participant" value={customName} onChange={(event) => setCustomName(event.target.value)} />
            <button className="runner-button is-dark" type="button" onClick={addCustomParticipant}>Add participant</button>
          </div>
          <button className="runner-button is-dark" type="button" onClick={() => runRoom("Complete")}>Run Room locally</button>
        </div>

        {activeRoom ? (
          <RoomRecord
            room={activeRoom}
            onUpdateRoom={updateRoom}
            onClassify={(id, classification) => updateRoom(updateDisagreementClassification(activeRoom, id, classification))}
            onCopy={copyText}
            onSave={saveRooms}
            onDuplicate={() => duplicateRoom(activeRoom)}
            onRerunChallenges={rerunChallenges}
            onEditField={updateActiveRoomField}
          />
        ) : (
          <div className="runner-empty">No room selected yet.</div>
        )}

        {copyNotice ? <p className="runner-toast" role="status">{copyNotice}</p> : null}
      </section>
    </main>
  );
}

function StepHeader({ number, title, kicker }: { number: string; title: string; kicker: string }) {
  return (
    <div className="runner-step-head">
      <span>{number}</span>
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function RoomRecord({
  room,
  onUpdateRoom,
  onClassify,
  onCopy,
  onSave,
  onDuplicate,
  onRerunChallenges,
  onEditField,
}: {
  room: Room;
  onUpdateRoom: (room: Room) => void;
  onClassify: (id: string, classification: DisagreementClassification) => void;
  onCopy: (text: string, notice: string) => Promise<void>;
  onSave: () => void;
  onDuplicate: () => void;
  onRerunChallenges: () => void;
  onEditField: (section: "synthesis" | "decision" | "output", key: string, value: string) => void;
}) {
  return (
    <>
      <div className="runner-step">
        <StepHeader number="03" title="Independent positions" kicker="Consensus waits" />
        <p className="runner-note">Independent positions are shown before synthesis to prevent premature consensus.</p>
        <div className="position-grid">
          {room.positions.map((position) => (
            <article className="position-panel" key={position.id}>
              <span>{position.lens}</span>
              <h3>{position.participantName}</h3>
              <EditableBlock label="Initial view" value={position.initialView} onChange={(value) => updatePosition(room, position.id, "initialView", value, onUpdateRoom)} />
              <EditableBlock label="Key concern" value={position.keyConcern} onChange={(value) => updatePosition(room, position.id, "keyConcern", value, onUpdateRoom)} />
              <EditableBlock label="What others may be missing" value={position.missingPoint} onChange={(value) => updatePosition(room, position.id, "missingPoint", value, onUpdateRoom)} />
              <EditableBlock label="One recommendation" value={position.recommendation} onChange={(value) => updatePosition(room, position.id, "recommendation", value, onUpdateRoom)} />
              <p className="confidence-line">Confidence {position.confidence}%</p>
              {position.challengeResponses.length ? (
                <div className="challenge-layer">
                  <strong>Challenge layer</strong>
                  {position.challengeResponses.map((response) => (
                    <textarea
                      key={response.id}
                      value={response.response}
                      onChange={(event) => updateChallengeResponse(room, response.id, event.target.value, onUpdateRoom)}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div className="runner-step">
        <StepHeader number="04" title="Friction map" kicker="Where conflict is real" />
        <h3 className="runner-question">Where do these perspectives genuinely conflict?</h3>
        <div className="friction-layout">
          <FrictionColumn title="Agreement" items={room.frictionMap.agreements} />
          <div className="disagreement-column">
            {room.frictionMap.contradictions.map((item) => (
              <article className="disagreement-row" key={item.id}>
                <span>{item.severity}% tension</span>
                <h3>{item.title}</h3>
                <div><p>{item.sideA}</p><p>{item.sideB}</p></div>
                <select value={item.classification} onChange={(event) => onClassify(item.id, event.target.value as DisagreementClassification)}>
                  {classifications.map((classification) => <option key={classification}>{classification}</option>)}
                </select>
              </article>
            ))}
          </div>
          <FrictionColumn title="Watch-outs" items={[...room.frictionMap.unchallengedAssumptions, ...room.frictionMap.possibleFalseConsensus]} />
        </div>
        <FrictionColumn title="Different definitions of the problem" items={room.frictionMap.definitions} />
        <FrictionColumn title="Minority positions" items={room.frictionMap.minorityPositions} />
      </div>

      <div className="runner-step">
        <StepHeader number="05" title="Challenge round" kicker="Second layer" />
        <div className="challenge-actions">
          <button className="runner-button is-dark" type="button" onClick={onRerunChallenges}>Run selected challenges</button>
          <button className="runner-button" type="button" onClick={() => onUpdateRoom({ ...room, challenges: room.challenges.map((challenge) => ({ ...challenge, selected: true })) })}>Run all</button>
          <button className="runner-button" type="button" onClick={() => onUpdateRoom({ ...room, challenges: room.challenges.map((challenge) => ({ ...challenge, selected: false })) })}>Skip for Fast Room</button>
          <button className="runner-button" type="button" onClick={() => onUpdateRoom({ ...room, challenges: [...room.challenges, { id: `challenge-custom-${Date.now()}`, disagreementId: "manual", prompt: "Manual challenge: what evidence would change this recommendation?", selected: true }] })}>Add challenge</button>
        </div>
        <div className="challenge-list">
          {room.challenges.map((challenge) => (
            <label className="challenge-item" key={challenge.id}>
              <input
                type="checkbox"
                checked={challenge.selected}
                onChange={(event) => onUpdateRoom({ ...room, challenges: room.challenges.map((item) => item.id === challenge.id ? { ...item, selected: event.target.checked } : item) })}
              />
              <textarea
                value={challenge.prompt}
                onChange={(event) => onUpdateRoom({ ...room, challenges: room.challenges.map((item) => item.id === challenge.id ? { ...item, prompt: event.target.value } : item) })}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="runner-step">
        <StepHeader number="06" title="Synthesis" kicker="Agreement without pretending" />
        <div className="synthesis-score">
          <strong>{room.synthesis.confidenceScore}% confidence</strong>
          <p>The score is explained by participant diversity, framing quality, unresolved conflict, evidence coverage, and challenge strength.</p>
          <ul>{room.synthesis.confidenceFactors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
        </div>
        <div className="runner-form-grid">
          <EditableArea label="Shared ground" value={room.synthesis.sharedGround} onChange={(value) => onEditField("synthesis", "sharedGround", value)} />
          <EditableArea label="Decisive disagreements" value={room.synthesis.decisiveDisagreements} onChange={(value) => onEditField("synthesis", "decisiveDisagreements", value)} />
          <EditableArea label="Recommended direction" value={room.synthesis.recommendedDirection} onChange={(value) => onEditField("synthesis", "recommendedDirection", value)} />
          <EditableArea label="What changed during the Room" value={room.synthesis.whatChanged} onChange={(value) => onEditField("synthesis", "whatChanged", value)} />
          <EditableArea label="Unresolved tensions" value={room.synthesis.unresolvedTensions} onChange={(value) => onEditField("synthesis", "unresolvedTensions", value)} />
        </div>
      </div>

      <div className="runner-step">
        <StepHeader number="07" title="Decision and Output" kicker="Editable record" />
        <div className="runner-form-grid">
          {Object.entries(room.decision).map(([key, value]) => (
            <EditableArea key={key} label={labelize(key)} value={value} onChange={(next) => onEditField("decision", key, next)} />
          ))}
          <EditableArea label="Output title" value={room.output.title} onChange={(value) => onEditField("output", "title", value)} />
          <EditableArea label={`Draft Output: ${room.output.format}`} value={room.output.body} onChange={(value) => onEditField("output", "body", value)} />
        </div>
        <button className="runner-button is-dark" type="button" onClick={() => onCopy(room.output.body, "Draft output copied.")}>Copy draft Output</button>
      </div>

      <div className="runner-step lineage-step">
        <StepHeader number="08" title="Discussion lineage" kicker="Decision history" />
        <div className="lineage-chain" aria-label="Discussion lineage">
          {["Project", "Decision Question", "Participants", "Independent positions", "Friction", "Challenges", "Synthesis", "Decision", "Output", "Unresolved tensions"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="lineage-record">
          <h3>{room.lineage.project}</h3>
          <p>{room.lineage.decisionQuestion}</p>
          <strong>Participants</strong>
          <ul>{room.lineage.participants.map((item) => <li key={item}>{item}</li>)}</ul>
          <strong>Unresolved tensions</strong>
          <ul>{room.lineage.unresolvedTensions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="lineage-actions">
          <button className="runner-button is-dark" type="button" onClick={onSave}>Save Room locally</button>
          <button className="runner-button" type="button" onClick={onDuplicate}>Duplicate Room</button>
          <button className="runner-button" type="button" onClick={() => onCopy(exportRoomMarkdown(room), "Markdown export copied.")}>Export as Markdown</button>
          <button className="runner-button" type="button" onClick={() => onCopy(`${room.frame.question}\n\n${room.synthesis.recommendedDirection}`, "Summary copied.")}>Copy summary</button>
          <button className="runner-button" type="button" onClick={onDuplicate}>Start follow-up Room</button>
          <button className="runner-button" type="button" onClick={() => onUpdateRoom({ ...room, status: "Needs rerun" })}>Reopen question</button>
        </div>
      </div>
    </>
  );
}

function EditableBlock({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="editable-block">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function EditableArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function FrictionColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="friction-column">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function updatePosition(
  room: Room,
  positionId: string,
  key: "initialView" | "keyConcern" | "missingPoint" | "recommendation",
  value: string,
  onUpdateRoom: (room: Room) => void,
) {
  onUpdateRoom({
    ...room,
    positions: room.positions.map((position) =>
      position.id === positionId ? { ...position, [key]: value } : position,
    ),
  });
}

function updateChallengeResponse(
  room: Room,
  responseId: string,
  value: string,
  onUpdateRoom: (room: Room) => void,
) {
  onUpdateRoom({
    ...room,
    positions: room.positions.map((position) => ({
      ...position,
      challengeResponses: position.challengeResponses.map((response) =>
        response.id === responseId ? { ...response, response: value } : response,
      ),
    })),
  });
}

function labelize(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
