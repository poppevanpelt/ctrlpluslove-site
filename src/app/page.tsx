import styles from "./home-2026.module.css";
import SavannahIntro from "./SavannahIntro";
import SavannahExplainer from "./SavannahExplainer";
import SavannahExit from "./SavannahExit";

const stages = [
  { no:"01", verb:"OBSERVE.", name:"ctrl+live", line:"Watch what is actually changing before deciding what it means.", detail:"Signals, movement, patterns and anomalies — kept alive instead of frozen into another report.", price:"Ongoing watch", href:"mailto:poppevanpelt@gmail.com?subject=Show%20me%20ctrl%2Blive", kind:"observe" },
  { no:"02", verb:"ANALYSE.", name:"Decision Stress-Test + Synthetic Audience Test", line:"Put what you think you know under pressure.", detail:"Contradiction, opposition, evidence and consequences — before reality does the expensive version.", price:"From €4,500 · tests scoped separately", href:"/stress-test/", kind:"analyse" },
  { no:"03", verb:"ACCELERATE.", name:"ctrl+2go", line:"Turn the useful signal into movement.", detail:"A few days of us. A working prototype, instrument or little machine that stays behind.", price:"A few days · the system stays", href:"/2go/", kind:"accelerate" },
] as const;

const instruments = [
  ["01","Decision Accelerator","Puts better judgment into motion.","collider","/decision-accelerator/","RUN INSTRUMENT"],
  ["02","Meeting Filter","Test whether a meeting deserves to exist before anyone enters the room.","meeting","/meeting-filter/","RUN FILTER"],
  ["03","Decision Memory","Keep the evidence, assumptions and reversals that created a decision.","opposition","/decision-memory/","OPEN MEMORY"],
  ["04","Prompt Shoppe","Find the real judgment hidden inside the instruction before tuning the prompt.","signal","/prompt-shoppe/","OPEN SHOPPE"],
  ["05","PURGE","Remove what can disappear without damaging the thing that matters.","nothing","/purge/","START PURGE"],
  ["06","Brand Survival","See how much can disappear before the brand stops being itself.","transplant","/brand-survival/","RUN INSTRUMENT"],
  ["07","Decision Collider","Collide assumptions before people collide.","collider","/decision-collider/","RUN COLLIDER"],
  ["08","AI-Y-fier","See what happens when clear language gets inflated into AI jargon.","signal","/ai-y-fier/","RUN AI-Y-FIER"],
  ["09","ctrl+SWAT","Detect. Judge. Build. Dispatch before the moment disappears.","meeting","/swat/","ENTER SWAT"],
  ["10","ctrl+FIZZ","Carbonated judgment for meetings that have gone flat.","opposition","/fizz/","OPEN BOTTLE"],
  ["11","ctrl+CHASE","Keep a question moving until it produces evidence or earns its death.","nothing","/chase/","START CHASE"],
  ["12","Radar","Watch signals, pressure and movement before the market names them.","signal","/radar/","OPEN RADAR"],
] as const;

const instrumentFamilies: Record<string, "observe" | "analyse" | "accelerate"> = {
  "01":"accelerate", "02":"analyse", "03":"observe", "04":"analyse",
  "05":"accelerate", "06":"analyse", "07":"analyse", "08":"analyse",
  "09":"accelerate", "10":"accelerate", "11":"observe", "12":"observe",
};

const instrumentImages: Record<string, string> = {
  "04": "/shoppe/poppes-prompt-shoppe.webp",
};

const missingInstrumentArt: Record<string, {label:string; motif:string}> = {
  "01": { label:"DECISION / ACCELERATOR", motif:"accelerator" },
  "02": { label:"MEETING / FILTER", motif:"meeting" },
  "03": { label:"DECISION / MEMORY", motif:"memory" },
  "05": { label:"PURGE / REMOVE", motif:"purge" },
  "06": { label:"BRAND / SURVIVAL", motif:"survival" },
  "07": { label:"DECISION / COLLIDER", motif:"collider" },
  "08": { label:"AI-Y / FIER", motif:"inflation" },
  "09": { label:"CTRL / SWAT", motif:"swat" },
  "10": { label:"CTRL / FIZZ", motif:"fizz" },
  "11": { label:"CTRL / CHASE", motif:"chase" },
  "12": { label:"LIVE / RADAR", motif:"radar" },
};

function InstrumentArtwork({ no }: { no: string }) {
  const art = missingInstrumentArt[no];
  if (!art) return null;
  return (
    <div className={`${styles.artwork} ${styles[`art_${art.motif}`]}`}>
      <span className={styles.artworkIndex}>ctrl+love / {no}</span>
      <svg className={styles.artworkDiagram} viewBox="0 0 480 260" aria-hidden="true">
        {no === "01" && <><circle cx="120" cy="130" r="61" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="120" cy="130" r="23" fill="#171717"/><path d="M191 130H357" stroke="currentColor" strokeWidth="10" strokeLinecap="square"/><path d="M316 86L365 130 316 174" stroke="currentColor" strokeWidth="10" fill="none"/><circle cx="411" cy="130" r="27" fill="#171717"/></>}
        {no === "02" && <><path d="M55 55H425M55 128H425M55 201H425M112 24V236M240 24V236M368 24V236" stroke="currentColor" strokeWidth="1.5" opacity=".3"/><circle cx="240" cy="128" r="67" fill="#151515"/><path d="M205 127l24 24 46-51" stroke="#f4ead8" strokeWidth="10" strokeLinecap="square" fill="none"/><path d="M63 43h96" stroke="currentColor" strokeWidth="5"/></>}
        {no === "03" && <><path d="M65 208H415" stroke="currentColor" strokeWidth="2"/><path d="M86 180L160 128 230 163 300 69 395 91" stroke="currentColor" strokeWidth="6" fill="none"/>{[[86,180],[160,128],[230,163],[300,69],[395,91]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i===3?23:13} fill={i===3?"#f3efe5":"#171717"}/><circle cx={x} cy={y} r="5" fill={i===3?"#171717":"#f3efe5"}/></g>)}</>}
        {no === "05" && <><rect x="110" y="43" width="260" height="180" stroke="currentColor" strokeWidth="3" fill="none"/><path d="M140 78H340M140 116H340M140 154H340M140 192H340" stroke="currentColor" strokeWidth="7" opacity=".26"/><path d="M84 232L396 22" stroke="#171717" strokeWidth="24"/><path d="M86 232L395 22" stroke="#fbf4e8" strokeWidth="2"/></>}
        {no === "06" && <><circle cx="240" cy="131" r="94" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="240" cy="131" r="64" stroke="currentColor" strokeWidth="4" fill="none"/><circle cx="240" cy="131" r="35" fill="#171717"/><path d="M240 17V245M126 131H354" stroke="currentColor" strokeWidth="1.8"/><path d="M120 56L360 204" stroke="currentColor" strokeWidth="8" opacity=".3"/></>}
        {no === "07" && <><circle cx="135" cy="130" r="67" stroke="currentColor" strokeWidth="4" fill="none"/><circle cx="345" cy="130" r="67" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M180 130H300M208 105L245 130 208 155M272 105L235 130 272 155" stroke="currentColor" strokeWidth="9" fill="none"/><circle cx="240" cy="130" r="24" fill="#171717"/><path d="M135 42V65M345 195V218" stroke="currentColor" strokeWidth="4"/></>}
        {no === "08" && <><rect x="52" y="93" width="104" height="74" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M77 118H129M77 141H111" stroke="currentColor" strokeWidth="6"/><path d="M169 130H257M227 100L258 130 227 160" stroke="currentColor" strokeWidth="8" fill="none"/><circle cx="350" cy="130" r="86" stroke="currentColor" strokeWidth="3" fill="none"/><circle cx="350" cy="130" r="55" stroke="currentColor" strokeWidth="3" fill="none"/><path d="M317 129L341 153 387 106" stroke="currentColor" strokeWidth="8" fill="none"/></>}
        {no === "09" && <><path d="M54 200H426" stroke="currentColor" strokeWidth="2"/><rect x="74" y="72" width="75" height="112" fill="#171717"/><rect x="160" y="48" width="75" height="136" fill="#171717" opacity=".72"/><rect x="246" y="95" width="75" height="89" fill="#171717" opacity=".46"/><path d="M335 169L393 65" stroke="currentColor" strokeWidth="12" strokeLinecap="square"/><path d="M367 65H396V94" stroke="currentColor" strokeWidth="9" fill="none"/></>}
        {no === "10" && <><path d="M170 214L214 51H273L314 214Z" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M187 155Q242 139 297 155L314 214H170Z" fill="#171717" opacity=".8"/>{[[155,56,10],[287,44,17],[334,98,9],[234,17,8],[356,35,5],[114,118,6]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="none" stroke="currentColor" strokeWidth="3"/>)}</>}
        {no === "11" && <><path d="M60 190C130 190 122 68 202 68S283 205 350 205 404 110 418 64" stroke="currentColor" strokeWidth="9" fill="none" strokeLinecap="round"/><circle cx="60" cy="190" r="18" fill="#171717"/><circle cx="418" cy="64" r="21" fill="#171717"/><path d="M375 37L419 64 390 106" stroke="#f9f3e5" strokeWidth="5" fill="none"/></>}
        {no === "12" && <><circle cx="240" cy="130" r="112" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="240" cy="130" r="77" stroke="currentColor" strokeWidth="2" opacity=".7" fill="none"/><circle cx="240" cy="130" r="42" stroke="currentColor" strokeWidth="2" opacity=".5" fill="none"/><path d="M240 18V242M128 130H352" stroke="currentColor" strokeWidth="2"/><path d="M240 130L323 53A112 112 0 0 1 351 115Z" fill="#171717" opacity=".85"/><circle cx="318" cy="97" r="9" fill="#f9f3e5"/></>}
      </svg>
      <span className={styles.artworkLabel}>{art.label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.page} id="main-content">
      <SavannahIntro />
      <nav className={styles.nav}>
        <a className={styles.logo} href="#">ctrl+love</a>
        <div className={styles.navlinks}>
          <a href="#work">What we do</a><a href="#instruments">Try</a><a href="#cases">Proof</a><a href="/pricing/">Pricing</a><a href="#about">People</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <img className={styles.heroImage} src="/home/sunnyvale-campus.webp" alt="" />
        <div className={styles.heroVeil} />
        <div className={styles.heroCopyLeft}>
          <div className={styles.eyebrow}>Applied AI for human judgment</div>
          <h1 data-savannah-handoff-headline="true">We build instruments for human judgment.</h1>
        </div>
        <div className={styles.heroCopyRight} data-savannah-handoff-panel="true">
          <p>AI can generate more answers than we will ever need.</p>
          <strong>The interesting problem is knowing what deserves to be believed.</strong>
        </div>
      </section>

      <SavannahExplainer />

      <section className={styles.section} id="work">
        <div className={styles.kicker}>What you can actually buy</div>
        <h2>Observe. Analyse. Accelerate.</h2>

        <div className={styles.flowIntro}>
          <div className={styles.ballStage} aria-hidden="true">
            <div className={styles.pedestal}>
              <img src="/museum/steel-ball-packshot-cutout.png" alt="" />
            </div>
          </div>
          <div className={styles.flowCopy}>
            <span className={styles.flowLabel}>THE LOGIC</span>
            <p>Start with reality. Work out what it means. Then move.</p>
            <strong>The same object. Three different jobs.</strong>
          </div>
        </div>

        <div className={styles.stages}>
          {stages.map((stage) => (
            <a className={`${styles.stage} ${styles[stage.kind]}`} href={stage.href} key={stage.no}>
              <span className={styles.num}>{stage.no} / {stage.verb.replace(".","")}</span>
              <span className={styles.stageSequence} aria-hidden="true">
                <i className={stage.no === "01" ? styles.active : ""} />
                <i className={stage.no === "02" ? styles.active : ""} />
                <i className={stage.no === "03" ? styles.active : ""} />
              </span>
              <b className={styles.stageVerb}>{stage.verb}</b>
              <strong className={styles.stageProduct}>{stage.name}</strong>
              <p>{stage.line}</p>
              <small>{stage.detail}</small>
              <span className={styles.stagePrice}>{stage.price}</span>
            </a>
          ))}
        </div>
        <div className={styles.offerStrip} aria-label="Ways to work with ctrl+love">
          <a href="/pricing/decision-stress-test/"><span>01 / TEST A DECISION</span><strong>Decision Stress-Test™</strong><b>From €4,500 ↗</b></a>
          <a href="/pricing/on-call-room/"><span>02 / KEEP A ROOM CLOSE</span><strong>On-Call Room™</strong><b>From €7,500 / month ↗</b></a>
          <a href="/pricing/"><span>03 / FIND YOUR FIT</span><strong>Rooms & pricing</strong><b>See the offers ↗</b></a>
        </div>
      </section>

      <section className={styles.section} id="instruments">
        <div className={styles.kicker}>A few instruments inside the machine</div>
        <h2>Pressure, not prompts.</h2>
        <a className={styles.cabinetPreview} href="/cabinet/" aria-label="Enter the instrument cabinet">
          <img src="/cabinet/assets/instrument-family.webp" alt="A sunlit workshop filled with ctrl+love decision instruments" loading="lazy" width="1536" height="1024" />
          <div className={styles.cabinetCaption}>
            <div>
              <span className={styles.kicker}>The instrument cabinet</span>
              <h3>Ideas enter. Evidence leaves.</h3>
              <p>Explore the instruments, their mechanisms and the work they leave behind.</p>
            </div>
            <strong>Enter the cabinet</strong>
          </div>
        </a>
        <div className={styles.instruments}>
          {instruments.map(([no,name,line,kind,href,action]) => (
            <a className={styles.instrument} href={href} key={no} data-family={instrumentFamilies[no]} aria-label={`${action}: ${name}`}>
              <div className={`${styles.instrumentVisual} ${styles[kind]}`} aria-hidden="true">
                {instrumentImages[no] ? <img src={instrumentImages[no]} alt="" loading="lazy" /> : <InstrumentArtwork no={no} />}
              </div>
              <div className={styles.instrumentCopy}>
                <span className={styles.num}>{no} / {instrumentFamilies[no]}</span>
                <h3>{name}</h3>
                <p>{line}</p>
                <strong>{action} ↗</strong>
              </div>
            </a>
          ))}
        </div>
        <a className={styles.cabinetLink} href="/instruments/">Explore the full instrument list</a>
      </section>

      <section className={styles.section} id="difference">
        <div className={styles.kicker}>ctrl+love / generic LLM</div>
        <h2>Same intelligence. Different machine.</h2>
        <div className={styles.compare}>
          <article>
            <h3>We make the answer defend itself.</h3>
            <ul><li>Designed opposition</li><li>Evidence, not confidence</li><li>Consequences and alternatives</li></ul>
          </article>
          <article>
            <h3>Another answer is not a decision.</h3>
            <ul><li>Helpful by default</li><li>More possibilities</li><li>Little reason to stop</li></ul>
          </article>
          <article className={styles.persona}>
            <h3>No persona factory.</h3>
            <p>A few carefully built synthetic people, with histories, biases and reasons to disagree. Not a thousand demographic placeholders.</p>
            <span>FEWER PEOPLE. BETTER ARGUMENTS.</span>
          </article>
        </div>
      </section>

      <section className={styles.section} id="cases">
        <div className={styles.kicker}>Field work</div>
        <h2>The instruments have left the lab.</h2>
        <div className={styles.cases}>
          <article className={styles.caseHero}>
            <div className={styles.caseCopy}>
              <span className={styles.num}>01 / COMFORA</span>
              <h3>Nobody wanted a comfy chair. People just wanted their lives back.</h3>
              <p><b>That changed the brief.</b> The question was no longer “how do we sell comfort?” but “what does getting your life back look like in the wild?”</p>
              <p>A small cultural signal from Flip’s 4K+ Instagram world became an unexpected physical idea: a Comfora chair in hotel lobbies, where guests can sit, recharge and return to life.</p>
              <strong className={styles.impact}>4K+ Instagram signal → interpretation → synthetic perspective → unexpected physical route.</strong>
            </div>
            <div className={styles.comforaVisual}>
              <img className={styles.comforaBike} src="/home/comfora-bike.jpeg" alt="Woman riding a bicycle across a red steel bridge" />
              <div className={styles.flipInsert}>
                <img src="/ambassadors/portraits/010-flip-portrait-live-20260712.jpeg" alt="Flip, ctrl+love's lorikeet parrot" />
                <span>FLIP / SIGNAL SCOUT / 4K+</span>
              </div>
            </div>
          </article>

          <div className={styles.casePair}>
            <article className={styles.caseSmall}>
              <span className={styles.num}>02 / LUTHER MUSEUM / IN DEVELOPMENT</span>
              <h3>“Hier sta ik.<br/>Ik kan niet anders.”</h3>
              <p>A sentence became a living installation. Then the installation became a voice.</p>
              <p>Luther can respond to visitors in the museum, enter live discussions on social media, comment on the world around him — and even suggest where to have lunch nearby.</p>
              <p><b>The museum no longer only tells Luther’s story. Luther starts participating in it.</b></p>
              <strong className={styles.impact}>Sentence → live installation → social voice → museum character → travelling exhibition.</strong>
              <div className={styles.lutherVisual}>
                <img src="/home/luther-installation.webp" alt="Luther Museum installation concept" />
                <span>LIVE / MUSEUM / SOCIAL</span>
              </div>
            </article>

            <article className={styles.caseSmall}>
              <span className={styles.num}>03 / FITZROY / COLLABORATION</span>
              <h3>The steel ball left the lab.</h3>
              <p><b>Fitzroy’s Mischa used the steel-ball language to invite ctrl+love into a collaboration.</b></p>
              <p>The relationship was already there. <b>Then the object crossed over too.</b></p>
              <strong className={styles.impact}>Adoption, not applause.</strong>
              <div className={styles.fitzVisual}>
                <video className={styles.fitzVideo} autoPlay loop muted playsInline preload="auto">
                  <source src="https://ctrl-love-media.floot.app/_cdn/static/0e7f85c1-30dc-49f7-9237-06749c75f27d-fitzroy-steel-ball-clean-20261007.mp4" type="video/mp4" />
                </video>
                <span>FITZROY / STEEL BALL</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.aboutSection}`} id="about">
        <div className={styles.about}>
          <h2>30 years advertising.<br/>8 years Apple.<br/>ADCN Hall of Fame.<br/>Then this.</h2>
          <div className={styles.aboutProfile}>
            <img className={styles.aboutPortrait} src="/ambassadors/portraits/001-poppe-van-pelt-portrait-live-20260712.jpeg" alt="Poppe van Pelt" />
            <div className={styles.aboutBio}>
              <p><b>Poppe van Pelt</b><br/>Founder, ctrl+love</p>
              <p>Built after decades of watching good ideas get improved to death in rooms full of smart people.</p>
              <p className={styles.circle}>The wider ctrl+love circle includes people Poppe has worked shoulder to shoulder with at Apple and across advertising and design.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.kicker}>Enough explaining</div>
        <h2>Bring us something that matters.</h2>
        <img className={styles.finalBall} src="/museum/steel-ball-packshot-cutout.png" alt="" aria-hidden="true" />
        <a href="mailto:poppevanpelt@gmail.com?subject=I%20have%20something%20for%20ctrl%2Blove">Bring a real problem ↗</a>
      </section>

      <footer className={styles.footer}><span>ctrl+love · shortcut to reality</span><SavannahExit /></footer>
    </main>
  );
}
