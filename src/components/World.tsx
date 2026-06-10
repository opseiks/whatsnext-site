import type { Mode, Stop } from '../types';
import HeroStop from './stops/HeroStop';
import ProofStop from './stops/ProofStop';
import ThesisStop from './stops/ThesisStop';
import PortfolioStop from './stops/PortfolioStop';
import PracticeStop from './stops/PracticeStop';
import EngageStop from './stops/EngageStop';
import BuiltWithStop from './stops/BuiltWithStop';
import ConnectStop from './stops/ConnectStop';

interface WorldProps {
  mode: Mode;
  stop: Stop;
  heroPhase: 1 | 2;
  onHeroAdvance: () => void;
  onChipSync: (src: string) => void;
}

export default function World({ mode, stop, heroPhase, onHeroAdvance, onChipSync }: WorldProps) {
  return (
    <div className="world" data-stop={stop}>
      <HeroStop heroPhase={heroPhase} onAdvance={onHeroAdvance} />
      <ProofStop mode={mode} active={stop === 1} onChipSync={onChipSync} />
      <ThesisStop mode={mode} active={stop === 2} />
      <PortfolioStop />
      <PracticeStop />
      <EngageStop mode={mode} />
      <BuiltWithStop />
      <ConnectStop mode={mode} />
    </div>
  );
}
