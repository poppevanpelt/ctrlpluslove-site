import type { Metadata } from "next";
import OperatorLab from "./operator-lab";

export const metadata: Metadata = {
  title: "Love Operators | ctrl+love",
  description: "Five ctrl+love operators for changing what a decision is forced to notice: add, remove, divide, multiply and separate approval from affection.",
};

export default function OperatorsPage() {
  return <OperatorLab />;
}
