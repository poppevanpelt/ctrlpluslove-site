import { OriginSpecimen } from "../origin-specimen";
import { DecisionColliderInstrument } from "./decision-collider-instrument";

export default function DecisionCollider() {
  return (
    <>
      <DecisionColliderInstrument />
      <OriginSpecimen
        specimen="001"
        title="The Harvard Bicycle Incident, 1987"
        story="Institute folklore holds that Prof. Dr. H. von Schmaalhauzen was cycling past Harvard when he heard five professors agree on lunch while each appeared to mean a different restaurant. He stopped, drew six chambers on the back of a parking ticket, and wrote: first collide the definitions. The ticket has never been found."
        sources={[
          {
            citation:
              "Schulz-Hardt et al. (2006), Group decision making in hidden profile situations: Dissent as a facilitator for decision quality, Journal of Personality and Social Psychology 91(6), 1080-1093.",
            href: "https://pubmed.ncbi.nlm.nih.gov/17144766/",
            note:
              "In hidden-profile group decisions, prediscussion dissent improved solution rates, largely through more intensive and less biased discussion. Useful support for structured collision, not validation of this instrument.",
          },
        ]}
      />
    </>
  );
}
