import { useState } from "react";
import { CalendarHeader } from "../features/agenda/components/CalendarHeader";
import { CalendarGrid } from "../features/agenda/components/CalendarGrid";
import { WEEK_DAYS, APPOINTMENTS } from "../features/agenda/data/agenda.mock";
import type { ViewMode } from "../features/agenda/types/agenda.types";

export const AgendaPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  return (
    <div className="flex flex-col h-[calc(100vh-64px-48px)]">
      {/* Calendar Header: month/year, navigation, view toggle, new appointment */}
      <CalendarHeader
        monthYear="Junio 2024"
        viewMode={viewMode}
        onViewChange={setViewMode}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        days={WEEK_DAYS}
        appointments={APPOINTMENTS}
        startHour={8}
        endHour={18}
      />

      {/* Mobile FAB */}
      <button className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors z-50 cursor-pointer">
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          add
        </span>
      </button>
    </div>
  );
};
