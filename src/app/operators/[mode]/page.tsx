import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OperatorLab, { type OperatorMode } from "../operator-lab";

const validModes: OperatorMode[] = ["plus", "minus", "divide", "multiply", "not"];

const labels: Record<OperatorMode, string> = {
  plus: "ctrl+love",
  minus: "ctrl−love",
  divide: "ctrl÷love",
  multiply: "ctrl×love",
  not: "ctrl≠love",
};

export function generateStaticParams() {
  return validModes.map((mode) => ({ mode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mode: string }>;
}): Promise<Metadata> {
  const { mode } = await params;
  if (!validModes.includes(mode as OperatorMode)) return {};
  const typed = mode as OperatorMode;
  return {
    title: labels[typed] + " | Love Operators | ctrl+love",
    description: "A working ctrl+love operator for pressure-testing a real decision from a different mathematical angle.",
  };
}

export default async function OperatorModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!validModes.includes(mode as OperatorMode)) notFound();
  return <OperatorLab initialMode={mode as OperatorMode} />;
}
