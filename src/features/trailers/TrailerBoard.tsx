import { TrailerCard } from "./TrailerCard";
import { Trailer } from "./trailer.types";
type Props = { trailers: Trailer[]; canOperate: boolean; onUpdate: (id: number, patch: Partial<Trailer>) => void };
export function TrailerBoard({ trailers, canOperate, onUpdate }: Props) {
  return <><section className="sectionHead"><div><h2>Today’s trailers</h2><p>Loaded = ready, waiting collection. Left Site = departed with load.</p></div></section><div className="trailerGrid">{trailers.map(trailer => <TrailerCard key={trailer.id} trailer={trailer} canOperate={canOperate} onUpdate={onUpdate}/>)}</div></>;
}
