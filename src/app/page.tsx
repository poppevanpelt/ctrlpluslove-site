import styles from "./home-2026.module.css";

const stages = [
  { no:"01", verb:"OBSERVE.", name:"ctrl+live", line:"Watch what is actually changing before deciding what it means.", detail:"Signals, movement, patterns and anomalies — kept alive instead of frozen into another report.", price:"Ongoing watch", href:"mailto:poppevanpelt@gmail.com?subject=Show%20me%20ctrl%2Blive", kind:"observe" },
  { no:"02", verb:"ANALYSE.", name:"Decision Stress-Test + Synthetic Audience Test", line:"Put what you think you know under pressure.", detail:"Contradiction, opposition, evidence and consequences — before reality does the expensive version.", price:"From €4,500 · tests scoped separately", href:"/stress-test/", kind:"analyse" },
  { no:"03", verb:"ACCELERATE.", name:"ctrl+2go", line:"Turn the useful signal into movement.", detail:"A few days of us. A working prototype, instrument or little machine that stays behind.", price:"A few days · the system stays", href:"/2go/", kind:"accelerate" },
] as const;

const instruments = [
  ["01","Opposition Seat","Put intelligent disagreement in the room before reality does it for you.","opposition"],
  ["02","Do-Nothing Control","Compare the proposed move with the uncomfortable possibility that doing nothing is better.","nothing"],
  ["03","Decision Collider","Force competing routes into the same frame until the real trade-off appears.","collider"],
  ["04","Signal Distortion","Find out what changes between the signal itself and what the organisation thinks it heard.","signal"],
  ["05","Meeting Filter","Test whether a meeting deserves to exist before anyone enters the room.","meeting"],
  ["06","Brand Transplant","Put one brand’s operating logic inside another and see what survives.","transplant"],
] as const;

export default function Home() {
  return (
    <main className={styles.page}>
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
            <div className={styles.flipVisual}>
              <img src="/ambassadors/portraits/010-flip-portrait-live-20260712.jpeg" alt="Flip, ctrl+love's lorikeet parrot" />
              <span>FLIP / LORIKEET / TROJAN HORSE / 4K+</span>
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
                  <source src="/home/fitzroy-steel-ball.mp4" type="video/mp4" />
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
        <div className={styles.instruments}>
          {instruments.map(([no,name,line,kind]) => (
            <article className={styles.instrument} key={no}>
              <div className={`${styles.instrumentVisual} ${styles[kind]}`} />
              <div className={styles.instrumentCopy}><span className={styles.num}>{no}</span><h3>{name}</h3><p>{line}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.aboutSection}`} id="about">
        <div className={styles.about}>
          <h2>30 years advertising.<br/>8 years Apple.<br/>ADCN Hall of Fame.<br/>Then this.</h2>
          <div>
            <p><b>Poppe van Pelt</b><br/>Founder, ctrl+love</p>
            <p>Built after decades of watching good ideas get improved to death in rooms full of smart people.</p>
            <p className={styles.circle}>The wider ctrl+love circle includes people Poppe has worked shoulder to shoulder with at Apple and across advertising and design.</p>
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
