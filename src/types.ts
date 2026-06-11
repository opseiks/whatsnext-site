export type Mode = 'neutral' | 'capital' | 'operator';
export type Stop = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface BillboardStat {
  val: string;
  num: number;
  pre: string;
  suf: string;
  dec: number;
  lbl: string;
  desc: string;
  chip: string;
}

export interface ThesisEntry {
  key: string;
  stmt: string;
  sub: string;
}

export interface PortfolioDomain {
  tag: string;
  name: string;
  desc: string;
  bg: string;
  video: string;
}

export interface PracticeItem {
  num: string;
  name: string;
  em: string;
}

export interface PracticeCard {
  name: string;
  status: string;
  proof: string;
  detail: string;
}

export interface EngageStep {
  num: string;
  name: string;
  desc: string;
}

export interface BuiltItem {
  name: string;
  note: string;
  hero?: boolean;
}

export interface PanelCopy {
  h: string;
  choices?: boolean;
  b?: string[];
  s?: string;
}

export interface ChippyRef {
  triggerTravel: () => void;
  revealPanel: () => void;
  enterHero: () => void;
  flipTo: (src: string) => void;
  setFace: (src: string) => void;
  hidePanel: () => void;
}
