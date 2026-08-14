import { TrailerCard } from "./TrailerCard";
import { Trailer } from "./trailer.types";
import { toOperationalDate } from "./trailer.utils";
type Props = { trailers: Trailer[]; canOperate: boolean; actorName: string; onUpdate: (id: number, patch: Partial<Trailer>) => void };
export function TrailerBoard({ trailers, canOperate, actorName, onUpdate }: Props) {
  const todaysTrailers = trailers.filter(trailer => trailer.date === toOperationalDate());
  return <><section className="sectionHead"><div><h2>Today’s trailers</h2><p>Loaded = ready, waiting collection. Left Site = departed with load.</p></div></section>{todaysTrailers.length ? <div className="trailerGrid">{todaysTrailers.map(trailer => <TrailerCard key={trailer.id} trailer={trailer} canOperate={canOperate} actorName={actorName} onUpdate={onUpdate}/>)}</div> : <div className="emptyDay"><h3>No trailers planned today</h3><p>Admin can prepare the operational plan from Admin Planning.</p></div>}</>;
}
