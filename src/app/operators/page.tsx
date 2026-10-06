import type { Metadata } from "next";
import OperatorLab from "./operator-lab";

export const metadata: Metadata = {
  title: "Love Operators | ctrl+love",
  description: "The ctrl+love operator family: five core operations plus advanced mathematics for measuring whether anyone cares at all.",
};

export default function OperatorsPage() {
  return <OperatorLab />;
}
