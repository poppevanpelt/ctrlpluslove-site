"use client";

import { useState } from "react";

export default function MorningChrisPage() {
  const [barked, setBarked] = useState(false);

  const wakeTed = () => {
    setBarked(true);
  };

  return (
    <main
      onClick={wakeTed}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") wakeTed();
      }}
      aria-label="Wake Ted"
      style={{
        minHeight: "100vh",
        background: "#efe9dd",
        color: "#121210",
        overflow: "hidden",
        cursor: "pointer",
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        .morningChrisDog {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 36%;
          filter: saturate(.82) contrast(1.04);
          transform: scale(1.01);
          transition: transform .18s ease;
        }
        .morningChrisDog.barked {
          transform: scale(1.018);
        }
        .morningChrisVeil {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(239,233,221,.2) 0%, rgba(239,233,221,.02) 42%, rgba(18,18,16,.56) 100%);
        }
        .morningChrisCopy {
          position: absolute;
          left: clamp(22px,5vw,74px);
          right: clamp(22px,5vw,74px);
          bottom: clamp(34px,6vh,74px);
          color: #fff;
          z-index: 2;
        }
        .morningChrisEyebrow {
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
          margin-bottom: 12px;
          opacity: .72;
          font-weight: 800;
        }
        .morningChrisTitle {
          margin: 0;
          max-width: 980px;
          text-transform: uppercase;
          font-size: clamp(54px,9.2vw,148px);
          line-height: .84;
          letter-spacing: -.068em;
          font-weight: 900;
        }
        .morningChrisHint {
          position: absolute;
          right: clamp(22px,4vw,58px);
          top: clamp(22px,4vw,46px);
          z-index: 2;
          color: #fff;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .72;
          font-weight: 800;
        }
        @media (max-width: 650px) {
          .morningChrisDog { object-position: center 42%; }
          .morningChrisTitle { font-size: clamp(52px,15vw,78px); }
          .morningChrisHint { top: 20px; right: 20px; }
        }
      `}</style>

      <video
        className={`morningChrisDog ${barked ? "barked" : ""}`}
        src="https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935611456807772242/Bring_this_exact_ctrl_love_office_still_to_life_with_extremely_restrained__photoreal_motion_and_natu.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYjUyZGY4Y2RjOTE2ODc5NyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTIwODkwOX0.UHD9wm9dlf3bpFjEOcTTDCJ0cdOf0FneM6dsAPuDe-Y"
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => setBarked(true)}
      />
      <div className="morningChrisVeil" />
      <div className="morningChrisHint">{barked ? "Morning." : "Tap Ted."}</div>

      <div className="morningChrisCopy">
        <div className="morningChrisEyebrow">ctrl+love / 07:00-ish</div>
        <h1 className="morningChrisTitle">
          {barked ? (
            <>Ted’s been<br />thinking.</>
          ) : (
            <>Good morning,<br />Chris.</>
          )}
        </h1>
      </div>
    </main>
  );
}
