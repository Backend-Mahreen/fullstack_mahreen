import { useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

type Point = { x: number; y: number };

type Props = Readonly<{
  source: string;
  fileName: string;
  onCancel: () => void;
  onApply: (imageDataUrl: string) => void;
}>;

const CROP_SIZE = 360;
const OUTPUT_SIZE = 640;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const ProfileImageCropper = ({ source, fileName, onCancel, onApply }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  const baseScale = useMemo(
    () => Math.max(CROP_SIZE / imageSize.width, CROP_SIZE / imageSize.height),
    [imageSize],
  );

  const constrainOffset = (candidate: Point, nextZoom = zoom) => {
    const scaledWidth = imageSize.width * baseScale * nextZoom;
    const scaledHeight = imageSize.height * baseScale * nextZoom;
    const maxX = Math.max(0, (scaledWidth - CROP_SIZE) / 2);
    const maxY = Math.max(0, (scaledHeight - CROP_SIZE) / 2);

    return {
      x: clamp(candidate.x, -maxX, maxX),
      y: clamp(candidate.y, -maxY, maxY),
    };
  };

  useEffect(() => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      imageRef.current = image;
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setReady(true);
    };
    image.src = source;
  }, [source]);

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(CROP_SIZE * dpr);
    canvas.height = Math.round(CROP_SIZE * dpr);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, CROP_SIZE, CROP_SIZE);

    const scale = baseScale * zoom;
    const width = imageSize.width * scale;
    const height = imageSize.height * scale;
    const x = (CROP_SIZE - width) / 2 + offset.x;
    const y = (CROP_SIZE - height) / 2 + offset.y;

    context.drawImage(image, x, y, width, height);
  }, [baseScale, imageSize, offset, ready, zoom]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;

    const getFocusableElements = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => getFocusableElements()[0]?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onCancel]);

  const handleZoom = (nextZoom: number) => {
    const constrainedZoom = clamp(nextZoom, 1, 3);
    setZoom(constrainedZoom);
    setOffset((current) => constrainOffset(current, constrainedZoom));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: offset,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setOffset(
      constrainOffset({
        x: drag.origin.x + event.clientX - drag.start.x,
        y: drag.origin.y + event.clientY - drag.start.y,
      }),
    );
  };

  const finishDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleApply = () => {
    const image = imageRef.current;
    if (!image) return;

    const output = document.createElement("canvas");
    output.width = OUTPUT_SIZE;
    output.height = OUTPUT_SIZE;
    const context = output.getContext("2d");
    if (!context) return;

    const ratio = OUTPUT_SIZE / CROP_SIZE;
    const scale = baseScale * zoom * ratio;
    const width = imageSize.width * scale;
    const height = imageSize.height * scale;
    const x = (OUTPUT_SIZE - width) / 2 + offset.x * ratio;
    const y = (OUTPUT_SIZE - height) / 2 + offset.y * ratio;

    context.drawImage(image, x, y, width, height);
    onApply(output.toDataURL("image/webp", 0.9));
  };

  return (
    <div className="profile-cropper" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section ref={dialogRef} className="profile-cropper__dialog" role="dialog" aria-modal="true" aria-labelledby="profile-cropper-title">
        <header className="profile-cropper__header">
          <div>
            <span>Foto profil</span>
            <h2 id="profile-cropper-title">Atur area foto</h2>
            <p>{fileName}</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Tutup crop foto"><X aria-hidden="true" /></button>
        </header>

        <div className="profile-cropper__stage" aria-label="Area crop foto">
          <canvas
            ref={canvasRef}
            className="profile-cropper__canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          />
          <div className="profile-cropper__mask" aria-hidden="true" />
          <div className="profile-cropper__guide" aria-hidden="true" />
        </div>

        <div className="profile-cropper__controls">
          <label>
            <span>Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) => handleZoom(Number(event.target.value))}
            />
          </label>
          <button type="button" className="profile-cropper__reset" onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}><RotateCcw aria-hidden="true" />Reset</button>
        </div>

        <footer className="profile-cropper__actions">
          <button type="button" className="profile-cropper__cancel" onClick={onCancel}>Batal</button>
          <button type="button" className="profile-cropper__apply" onClick={handleApply} disabled={!ready}><Check aria-hidden="true" />Gunakan Foto</button>
        </footer>
      </section>
    </div>
  );
};

export default ProfileImageCropper;
