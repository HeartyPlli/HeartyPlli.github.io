import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/assets";
import closeIcon from "../../file/images/close.png";
import nextIcon from "../../file/images/next.png";
import previousIcon from "../../file/images/prev.png";

export default function PhotoGallery({ photos }) {
  const dialog = useRef(null);
  const opener = useRef(null);
  const [selected, setSelected] = useState(null);
  const [failed, setFailed] = useState(false);
  const isOpen = selected !== null;
  const caption = (photo) => photo.startsWith("friends/") ? "Moments with friends" : "A little moment with Heart";

  useEffect(() => {
    if (!isOpen) return;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function move(direction) {
    setFailed(false);
    setSelected((index) => (index + direction + photos.length) % photos.length);
  }
  function close() {
    dialog.current.close();
    setSelected(null);
    opener.current?.focus();
  }

  return <>
    <div className="photo-grid">{photos.map((photo, index) => <button className="photo-thumbnail" key={photo} type="button" aria-label={`Open photo ${index + 1}: ${caption(photo)}`} onClick={(event) => { opener.current = event.currentTarget; setFailed(false); setSelected(index); }}><img src={asset(photo)} alt={caption(photo)} loading="lazy" /></button>)}</div>
    <dialog className="photo-lightbox" ref={dialog} aria-labelledby="photo-caption" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialog.current) close(); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      {isOpen && <>
        <div className="lightbox-caption" aria-live="polite"><span>{selected + 1} / {photos.length}</span><p id="photo-caption">{caption(photos[selected])}</p></div>
        <button className="lightbox-control lightbox-close" type="button" aria-label="Close photo viewer" onClick={close} autoFocus><img src={closeIcon} alt="" /></button>
        <div className="lightbox-stage">
          <button className="lightbox-control" type="button" aria-label="Previous photo" onClick={() => move(-1)}><img src={previousIcon} alt="" /></button>
          <div className="lightbox-image">{failed ? <p role="status">This photo could not load. Try the next one.</p> : <img key={photos[selected]} src={asset(photos[selected])} alt={caption(photos[selected])} onError={() => setFailed(true)} />}</div>
          <button className="lightbox-control" type="button" aria-label="Next photo" onClick={() => move(1)}><img src={nextIcon} alt="" /></button>
        </div>
        <div className="lightbox-dots" aria-label="Choose a photo">{photos.map((photo, index) => <button key={photo} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={selected === index} onClick={() => { setFailed(false); setSelected(index); }}><span /></button>)}</div>
      </>}
    </dialog>
  </>;
}
