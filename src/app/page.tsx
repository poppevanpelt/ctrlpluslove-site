import styles from "./home-2026.module.css";
import SavannahIntro from "./SavannahIntro";
import SavannahExplainer from "./SavannahExplainer";

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

const instrumentImages: Record<string, string> = {
  "01": "/instruments/06-decision-surface.webp",
  "04": "/shoppe/poppes-prompt-shoppe.webp",
  "07": "/instruments/02-decision-collider.webp",
  "08": "/ai-y-fier-hero-inflation-engine.webp",
};

export default function Home() {
  return (
    <main className={styles.page} id="main-content">
      <SavannahIntro />
      <nav className={styles.nav}>
        <a className={styles.logo} href="#">ctrl+love</a>
        <div className={styles.navlinks}>
          <a href="#work">Work</a><a href="#difference">Difference</a><a href="#cases">Cases</a><a href="#instruments">Instruments</a><a href="#about">About</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <img className={styles.heroImage} src="/home/sunnyvale-campus.webp" alt="" />
        <div className={styles.heroVeil} />
        <div className={styles.heroCopyLeft}>
          <div className={styles.eyebrow}>Applied AI for human judgment</div>
          <h1>We build instruments for human judgment.</h1>
        </div>
        <div className={styles.heroCopyRight}>
          <p>AI can generate more answers than we will ever need.</p>
          <strong>The interesting problem is knowing what deserves to be believed.</strong>
          <span>72° and sunny.</span>
        </div>
      </section>

      <SavannahExplainer />

      <section className={styles.section} id="work">
        <div className={styles.kicker}>What you can actually buy</div>
        <h2>Observe. Analyse. Accelerate.</h2>

        <div className={styles.flowIntro}>
          <div className={styles.ballStage} aria-hidden="true">
            <div className={styles.pedestal}>
              <img src="/museum/steel-ball-packshot.png" alt="" />
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
      </section>

      <section className={styles.section} id="difference">
        <div className={styles.kicker}>ctrl+love / generic LLM</div>
        <h2>Same intelligence. Different machine.</h2>
        <div className={styles.compare}>
          <article>
            <h3>ctrl+love gives the answer something to fight with.</h3>
            <ul><li>Multiple perspectives</li><li>Designed opposition</li><li>Evidence</li><li>Consequences and alternatives</li><li>Accumulated context</li><li>A reason to stop</li></ul>
          </article>
          <article>
            <h3>A generic LLM gives you another answer.</h3>
            <ul><li>One perspective at a time</li><li>Helpful by default</li><li>Session-dependent context</li><li>No designed opposition</li><li>More answers</li><li>Another route is always available</li></ul>
          </article>
          <article className={styles.persona}>
            <h3>No persona factory.</h3>
            <p>When we need people in the room, we do not generate thousands of supposedly unbiased demographic placeholders.</p>
            <p>We build a small number of synthetic people by hand — with histories, biases, memories and reasons to disagree.</p>
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
              <p>We analysed a screen recording from <b>Flip — our lorikeet parrot, Trojan horse and unlikely signal scout — and his 4K+ Instagram following.</b></p>
              <p>One signal emerged: matcha videos were increasingly composed off-centre, leaving more room for friends, conversation and life around the drink.</p>
              <p><b>Maya, Cultural Pattern Reader,</b> and <b>Lexi, Hospitality Strategist,</b> pushed that observation somewhere physical: what if a Comfora chair lived in hotel lobbies, so newly arrived guests could sit, have a matcha, charge their phone and recover from travelling?</p>
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
                  <source src="https://ctrl-love-media.floot.app/_cdn/static/29c34fe1-d0ba-4baf-b058-c39cde7852f2-fitzroy-steel-ball-clean.mp4" type="video/mp4" />
                </video>
                <span>FITZROY / STEEL BALL</span>
              </div>
            </article>
          </div>
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
            <a className={styles.instrument} href={href} key={no} aria-label={`${action}: ${name}`}>
              <div className={`${styles.instrumentVisual} ${styles[kind]}`} aria-hidden="true">
                {instrumentImages[no] && <img src={instrumentImages[no]} alt="" loading="lazy" />}
              </div>
              <div className={styles.instrumentCopy}>
                <span className={styles.num}>{no}</span>
                <h3>{name}</h3>
                <p>{line}</p>
                <strong>{action} ↗</strong>
              </div>
            </a>
          ))}
        </div>
        <a className={styles.cabinetLink} href="/instruments/">Explore the full instrument list</a>
      </section>

      <section className={`${styles.section} ${styles.aboutSection}`} id="about">
        <div className={styles.about}>
          <h2>30 years advertising.<br/>8 years Apple.<br/>ADCN Hall of Fame.<br/>Then this.</h2>
          <div className={styles.aboutProfile}>
            <img className={styles.aboutPortrait} src="https://ctrl-love-media.floot.app/_cdn/static/139f3c11-845e-4d7d-925c-3652e0a9a997-poppe-founder-20261007.jpeg" alt="Poppe van Pelt" />
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
        <a href="mailto:poppevanpelt@gmail.com?subject=I%20have%20something%20for%20ctrl%2Blove">Bring a real problem ↗</a>
      </section>

      <footer className={styles.footer}><span>ctrl+love · shortcut to reality</span><span>72° and sunny.</span></footer>
    </main>
  );
}
