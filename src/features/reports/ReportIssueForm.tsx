import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, Send, Trash2, X } from "lucide-react";
import { NewFloorReport, REPORT_CATEGORIES, ReportCategory, ReportPhoto } from "./types";

type Props = { onCancel: () => void; onSubmit: (report: NewFloorReport) => void };
export function ReportIssueForm({ onCancel, onSubmit }: Props) {
  const [category, setCategory] = useState<ReportCategory>("PALLET_WRAPPING");
  const [area, setArea] = useState("Bay"); const [reference, setReference] = useState("");
  const [description, setDescription] = useState(""); const [photos, setPhotos] = useState<ReportPhoto[]>([]);
  const photosRef = useRef(photos); const submittedRef = useRef(false);
  useEffect(() => { photosRef.current = photos }, [photos]);
  useEffect(() => () => { if (!submittedRef.current) photosRef.current.forEach(p => URL.revokeObjectURL(p.objectUrl)) }, []);
  const addPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(event.target.files ?? []).map(file => ({ id: crypto.randomUUID(), name: file.name, objectUrl: URL.createObjectURL(file) }));
    setPhotos(current => [...current, ...added]); event.target.value = "";
  };
  const removePhoto = (id: string) => setPhotos(current => { const removed = current.find(p => p.id === id); if (removed) URL.revokeObjectURL(removed.objectUrl); return current.filter(p => p.id !== id) });
  const submit = (event: FormEvent) => { event.preventDefault(); submittedRef.current = true; onSubmit({ category, area: area.trim(), reference: reference.trim() || undefined, description: description.trim(), photos }) };
  return <section className="reportFormPanel" aria-labelledby="report-form-title">
    <div className="formTitle"><div><span className="eyebrow">NEW FLOOR REPORT</span><h2 id="report-form-title">Report an issue</h2></div><button type="button" className="closeBtn" onClick={onCancel} aria-label="Close report form"><X size={22}/></button></div>
    <form className="reportForm" onSubmit={submit}>
      <label>Category<select value={category} onChange={e => setCategory(e.target.value as ReportCategory)}>{REPORT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Area<input required value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Bay 2"/></label>
      <label>Order / Delivery / Route reference <span className="optional">Optional</span><input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. Route 104"/></label>
      <label className="wideField">Description<textarea required maxLength={500} rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe what is wrong"/><span className="fieldHint">{description.length}/500</span></label>
      <div className="photoField"><span className="fieldLabel">Photos <span className="optional">{photos.length ? `${photos.length} selected` : "Optional"}</span></span><label className="photoPicker"><Camera size={24}/><span><b>Add photos</b><small>Take a photo or choose multiple images</small></span><input type="file" accept="image/*" multiple onChange={addPhotos}/></label>
        {photos.length > 0 && <div className="photoPreviewGrid">{photos.map(photo => <figure key={photo.id} className="photoPreview"><img src={photo.objectUrl} alt={photo.name}/><button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.name}`}><Trash2 size={17}/></button></figure>)}</div>}
      </div>
      <div className="formActions"><button type="button" className="secondaryBtn" onClick={onCancel}>Cancel</button><button type="submit" className="primary compact" disabled={!area.trim() || !description.trim()}><Send size={18}/>Submit report</button></div>
    </form>
  </section>;
}
