import type { ToothState, Surface } from "../../types/odontogram.types";

interface ToothProps {
  toothData: ToothState;
  updateSurface: (id: number, surface: Surface) => void;
  openNote: (id: number) => void;
  position: "top" | "bottom";
}

export const Tooth = ({ toothData, updateSurface, openNote, position }: ToothProps) => {
  const { id } = toothData;
  const hasNote = toothData.note?.trim().length > 0;

  const numberLabel = (
    <div
      className={`text-[12px] font-sans leading-none py-1 cursor-pointer transition-colors ${
        hasNote
          ? "text-primary font-extrabold underline"
          : "text-on-surface-variant hover:font-bold hover:text-primary"
      }`}
      onClick={() => openNote(id)}
      title={hasNote ? "Ver/Editar anotación" : "Añadir anotación"}
    >
      {id}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-[32px]">
      {position === "top" && numberLabel}
      <svg viewBox="-2 -2 104 104" className="w-[32px] h-[32px]">
        <polygon
          points="0,0 100,0 75,25 25,25"
          fill={toothData.top}
          stroke="#0d1c2e"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => updateSurface(id, "top")}
          className="cursor-pointer hover:opacity-75"
        />
        <polygon
          points="0,100 100,100 75,75 25,75"
          fill={toothData.bottom}
          stroke="#0d1c2e"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => updateSurface(id, "bottom")}
          className="cursor-pointer hover:opacity-75"
        />
        <polygon
          points="0,0 25,25 25,75 0,100"
          fill={toothData.left}
          stroke="#0d1c2e"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => updateSurface(id, "left")}
          className="cursor-pointer hover:opacity-75"
        />
        <polygon
          points="100,0 75,25 75,75 100,100"
          fill={toothData.right}
          stroke="#0d1c2e"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => updateSurface(id, "right")}
          className="cursor-pointer hover:opacity-75"
        />
        <polygon
          points="25,25 75,25 75,75 25,75"
          fill={toothData.center}
          stroke="#0d1c2e"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => updateSurface(id, "center")}
          className="cursor-pointer hover:opacity-75"
        />
      </svg>
      {position === "bottom" && numberLabel}
    </div>
  );
};
