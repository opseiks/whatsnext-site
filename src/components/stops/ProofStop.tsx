import type { Mode } from '../../types';
import Billboard from '../Billboard';

interface ProofStopProps {
  mode: Mode;
  active: boolean;
  onChipSync: (src: string) => void;
}

export default function ProofStop({ mode, active, onChipSync }: ProofStopProps) {
  return (
    <section className="stop">
      <div className="proof-bg" />
      <Billboard mode={mode} active={active} onChipSync={onChipSync} />
    </section>
  );
}
