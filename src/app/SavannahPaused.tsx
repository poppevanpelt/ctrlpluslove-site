import { HOLY_FOOLS_PAUSE_MESSAGE } from "./savannah-client-availability";
export function SavannahPaused({ fullPage = false }: { fullPage?: boolean }) {
  return <section aria-label="Savannah temporarily unavailable" style={fullPage ? {minHeight:"100vh",background:"#eeeae2",display:"grid",placeItems:"center",padding:30} : {position:"fixed",right:16,bottom:16,zIndex:2147483001,maxWidth:340,padding:22,background:"#eeeae2",color:"#171717",border:"1px solid #b9b4ab",boxShadow:"0 12px 30px #0002"}}>
    <div style={{maxWidth:440,color:"#171717"}}><p style={{fontSize:11,letterSpacing:".12em"}}>HOLY FOOLS × CTRL+LOVE</p><h2 style={{fontSize:25,margin:"14px 0"}}>Savannah is taking a breather.</h2><p style={{lineHeight:1.5}}>{HOLY_FOOLS_PAUSE_MESSAGE}</p><a href="mailto:poppevanpelt@gmail.com" style={{color:"inherit"}}>Contact Poppe ↗</a></div>
  </section>;
}
