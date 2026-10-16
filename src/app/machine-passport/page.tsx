import type { Metadata } from "next";
import MachinePassport from "./MachinePassport";

export const metadata: Metadata = {title:"THE MACHINE PASSPORT™ — ctrl+love",description:"Make ownership, running costs, maintenance and shutdown clear before handing over a working instrument."};

export default function MachinePassportPage(){return <MachinePassport />;}
