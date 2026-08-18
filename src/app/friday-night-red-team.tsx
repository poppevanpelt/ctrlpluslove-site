"use client";

import Image from "next/image";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

import { isFridayNightRedTeamActive } from "@/lib/fridayNightRedTeam";

const phoneHref = "tel:+31625279867";
const phoneLabel = "+31 6 25279867";

function Coaster() {
  return (
    <span className="friday-red-team__coaster" aria-hidden="true">
      <span>RED TEAM</span>
      <strong>{phoneLabel}</strong>
      <small>FRIDAY NIGHTS ONLY</small>
    </span>
  );
}

export function FridayNightRedTeam() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setIsActive(isFridayNightRedTeamActive(new Date()));
    };

    updateState();
    const interval = window.setInterval(updateState, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const state = isActive ? "friday" : "normal";

  const handlePhoneClick = () => {
    track("friday_night_red_team_phone_click", { state });
  };

  return (
    <section
      className="content-section ruled friday-red-team-section"
      aria-labelledby="friday-red-team-title"
      data-state={state}
    >
      <div className="content-block friday-red-team" aria-live="polite">
        <div className="friday-red-team__normal" hidden={isActive}>
          <div className="friday-red-team__normal-copy">
            <h2 id={!isActive ? "friday-red-team-title" : undefined}>
              Friday Night Red Team
            </h2>
            <p>Pitch Monday? Keep this number.</p>
            <a href={phoneHref} onClick={handlePhoneClick}>
              {phoneLabel}
            </a>
          </div>
          <Coaster />
        </div>

        <div className="friday-red-team__active" hidden={!isActive}>
          <div className="friday-red-team__active-copy">
            <h2 id={isActive ? "friday-red-team-title" : undefined}>
              <span>It&rsquo;s Friday.</span>
              <span>The pitch is Monday.</span>
            </h2>
            <a
              className="friday-red-team__phone"
              href={phoneHref}
              onClick={handlePhoneClick}
            >
              {phoneLabel}
            </a>
            <p>Send the deck. We&rsquo;ll try to break it.</p>
            <small>AI sharpens the decision field. Humans make the call.</small>
          </div>
          <Coaster />
        </div>

        <span className="friday-red-team__steel-ball" aria-hidden="true">
          <Image
            src="/museum/steel-ball-packshot-cutout.png"
            alt=""
            width={430}
            height={414}
            sizes="36px"
          />
        </span>
      </div>
    </section>
  );
}
