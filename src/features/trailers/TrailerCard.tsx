import { useState } from "react";
import { Clock3, PackageCheck, Truck } from "lucide-react";
import { Trailer } from "./trailer.types";

type Props = { trailer: Trailer; canOperate: boolean; onUpdate: (id: number, patch: Partial<Trailer>) => void };
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function TrailerCard({ trailer, canOperate, onUpdate }: Props) {
  const [showLoadingForm, setShowLoadingForm] = useState(false);
  const [actualPallets, setActualPallets] = useState(String(trailer.actualPallets ?? trailer.plannedPallets));
  const [door, setDoor] = useState(trailer.door ?? "");
  const palletVariance = trailer.actualPallets !== undefined && trailer.actualPallets !== trailer.plannedPallets;

  const confirmLoaded = () => {
    const parsedPallets = Number(actualPallets);
    if (!Number.isFinite(parsedPallets) || parsedPallets < 0) return;
    onUpdate(trailer.id, { status: "LOADED", loadedAt: nowTime(), actualPallets: parsedPallets, door: door.trim() });
    setShowLoadingForm(false);
  };

  return <article className="trailerCard">
    <div className="cardTop"><div><span className="eyebrow">TRAILER {trailer.id}</span><h3>{trailer.bookedTime}</h3></div><span className={`status ${trailer.status.toLowerCase()}`}>{trailer.status.replace("_", " ")}</span></div>
    <div className="meta"><span>Carrier <b>{trailer.carrier}</b></span><span>Planned pallets <b>{trailer.plannedPallets}</b></span><span>Actual pallets <b>{trailer.actualPallets ?? "—"}</b></span><span>Door <b>{trailer.door ?? "—"}</b></span></div>
    {canOperate && <div className="actions">
      {trailer.status === "BOOKED" && <button onClick={() => onUpdate(trailer.id, { status: "DRIVER_IN", driverInAt: nowTime() })}><Clock3 size={17}/>Driver In</button>}
      {trailer.status === "DRIVER_IN" && !showLoadingForm && <button className="loadedBtn" onClick={() => setShowLoadingForm(true)}><PackageCheck size={17}/>Loaded</button>}
      {trailer.status === "LOADED" && <button className="departBtn" onClick={() => onUpdate(trailer.id, { status: "LEFT_SITE", leftSiteAt: nowTime() })}><Truck size={17}/>Left Site</button>}
    </div>}
    {canOperate && trailer.status === "DRIVER_IN" && showLoadingForm && <div className="loadingForm">
      <label>Actual pallets<input type="number" min="0" inputMode="numeric" value={actualPallets} onChange={event => setActualPallets(event.target.value)}/></label>
      <label>Door<input value={door} onChange={event => setDoor(event.target.value)} placeholder="Door number"/></label>
      {Number(actualPallets) !== trailer.plannedPallets && <p className="varianceWarning">Planned {trailer.plannedPallets}; actual {actualPallets || "0"}. You can still complete loading.</p>}
      <div><button className="secondaryBtn" onClick={() => setShowLoadingForm(false)}>Cancel</button><button className="loadedBtn" disabled={!actualPallets || !Number.isFinite(Number(actualPallets)) || Number(actualPallets) < 0} onClick={confirmLoaded}><PackageCheck size={17}/>Confirm loaded</button></div>
    </div>}
    {palletVariance && <p className="varianceWarning"><b>Pallet variance:</b> planned {trailer.plannedPallets}, actual {trailer.actualPallets}.</p>}
    <div className="timeline"><span>In: <b>{trailer.driverInAt ?? "—"}</b></span><span>Loaded: <b>{trailer.loadedAt ?? "—"}</b></span><span>Left: <b>{trailer.leftSiteAt ?? "—"}</b></span></div>
  </article>;
}
