import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedBlob } from "../utils/cropImage";

interface Props {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  isUploading?: boolean;
}

export const AvatarCropModal = ({ imageSrc, onConfirm, onCancel, isUploading }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, rotation);
    onConfirm(blob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-h3 text-h3 text-on-surface">Ajustar foto de perfil</h2>
          <button
            onClick={onCancel}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full bg-black" style={{ height: 320 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 px-6 py-4 border-t border-outline-variant">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
              zoom_out
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
              aria-label="Zoom"
            />
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
              zoom_in
            </span>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant w-16 shrink-0">
              Rotación
            </span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
              aria-label="Rotación"
            />
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setRotation((r) => r - 90)}
                title="Rotar 90° izquierda"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">rotate_left</span>
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                title="Rotar 90° derecha"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">rotate_right</span>
              </button>
              <button
                onClick={() => setRotation(0)}
                title="Restablecer rotación"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant">
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="h-10 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUploading}
            className="h-10 px-5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {isUploading && (
              <span className="material-symbols-outlined text-[16px] animate-spin">
                progress_activity
              </span>
            )}
            {isUploading ? "Subiendo..." : "Aplicar foto"}
          </button>
        </div>
      </div>
    </div>
  );
};
