import type { Mode } from '../types';
import ScrollHeroStop from './stops/ScrollHeroStop';
import ProofStop from './stops/ProofStop';
import ThesisStop from './stops/ThesisStop';
import PortfolioStop from './stops/PortfolioStop';
import PracticeStop from './stops/PracticeStop';
import EngageStop from './stops/EngageStop';
import BuiltWithStop from './stops/BuiltWithStop';
import ConnectStop from './stops/ConnectStop';

interface ScrollWorldProps {
  mode: Mode;
  onSetMode: (m: 'capital' | 'operator') => void;
  onChipSync: (src: string) => void;
}

export default function ScrollWorld({ mode, onSetMode, onChipSync }: ScrollWorldProps) {
  return (
    <div className="world">
      <ScrollHeroStop onSetMode={onSetMode} />
      <ProofStop mode={mode} active={true} onChipSync={onChipSync} />
      <ThesisStop mode={mode} active={true} />
      <PortfolioStop />
      <PracticeStop mode={mode} active={true} />
      <EngageStop mode={mode} />
      <BuiltWithStop mode={mode} active={true} />
      <ConnectStop mode={mode} />
    </div>
  );
}
