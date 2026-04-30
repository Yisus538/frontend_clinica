import { useEffect, useRef, useState } from "react";
import type { CalendarGridProps } from "../types/agenda.types";
import { AppointmentBlock } from "./AppointmentBlock";
import { LUNCH_HOUR } from "../data/agenda.mock";

const SLOT_HEIGHT = 80; // px — height of each hour row

export const CalendarGrid = ({
  days,
  appointments,
  startHour = 0,
  endHour = 23,
  onAppointmentMove,
}: CalendarGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);

    // Initial scroll: Go to current hour minus 1
    if (containerRef.current) {
      const currentH = new Date().getHours();
      // Calculate target top pixel, bounded to >= 0
      const targetY = Math.max(0, currentH - 1 - startHour) * SLOT_HEIGHT;
      containerRef.current.scrollTop = targetY;
    }

    return () => clearInterval(interval);
  }, [startHour]);

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const totalDays = days.length;

  const formatHour = (h: number) => {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, hour: number, colIdx: number) => {
    e.preventDefault();
    const appointmentId = e.dataTransfer.getData("text/plain");
    if (!appointmentId || !onAppointmentMove) return;

    // Calculate startMinute based on drop position inside the cell
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    
    // Calculate nearest 15-minute interval
    const pixelsPerMinute = SLOT_HEIGHT / 60;
    const minutes = Math.floor(offsetY / pixelsPerMinute);
    // Snap to nearest 15 minutes
    const startMinute = Math.round(minutes / 15) * 15;
    
    // Cap at 45 minutes
    const snappedMinute = Math.max(0, Math.min(45, startMinute));

    onAppointmentMove(appointmentId, colIdx, hour, snappedMinute);
  };

  return (
    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
      {/* ── Days Header ── */}
      <div
        className="grid border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10"
        style={{ gridTemplateColumns: `4rem repeat(${totalDays}, 1fr)` }}
      >
        {/* Timezone cell */}
        <div className="p-3 text-center border-r border-outline-variant">
          <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider">
            GMT-3
          </span>
        </div>

        {days.map((day) => {
          const todayClasses = day.isToday ? "bg-surface-container-low" : "";
          const weekendClasses = day.isWeekend ? "bg-surface-dim/30" : "";

          return (
            <div
              key={day.abbr}
              className={`p-3 text-center border-r border-outline-variant last:border-r-0 ${todayClasses} ${weekendClasses}`}
            >
              <span
                className={`font-caption text-caption block mb-1 ${
                  day.isToday
                    ? "text-primary font-semibold"
                    : day.isWeekend
                      ? "text-outline"
                      : "text-on-surface-variant"
                }`}
              >
                {day.abbr}
              </span>
              {day.isToday ? (
                <span className="font-h3 text-h3 text-on-primary bg-primary w-8 h-8 rounded-full flex items-center justify-center mx-auto">
                  {day.number}
                </span>
              ) : (
                <span
                  className={`font-h3 text-h3 block ${day.isWeekend ? "text-outline" : "text-on-surface"}`}
                >
                  {day.number}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scrollable Time Grid ── */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto relative bg-surface-container-lowest scroll-smooth"
      >
        {/* Column background lines */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `4rem repeat(${totalDays}, 1fr)` }}
        >
          <div className="border-r border-outline-variant bg-surface-container-lowest z-10" />
          {days.map((day) => (
            <div
              key={`bg-${day.abbr}`}
              className={`border-r border-outline-variant border-dashed last:border-r-0 ${
                day.isToday
                  ? "bg-surface-container-low/30"
                  : day.isWeekend
                    ? "bg-surface-dim/20"
                    : ""
              }`}
            />
          ))}
        </div>

        {/* Rows: one per hour */}
        <div className="relative z-20">
          {/* Current Time Indicator Line */}
          <div 
            className="absolute left-16 right-0 z-40 pointer-events-none flex items-center transition-all duration-1000 ease-linear"
            style={{ 
              top: `${(currentTime.getHours() - startHour) * SLOT_HEIGHT + (currentTime.getMinutes() / 60) * SLOT_HEIGHT}px` 
            }}
          >
            <div className="w-2.5 h-2.5 bg-error rounded-full absolute -left-1.5" />
            <div className="h-[2px] bg-error w-full shadow-[0_0_2px_rgba(186,26,26,0.3)] opacity-70" />
          </div>

          {hours.map((hour) => {
            const isLunch = hour === LUNCH_HOUR;

            /* Gather appointments that start in this hour's row */
            const hourAppointments = appointments.filter(
              (a) => a.startHour === hour
            );

            return (
              <div
                key={hour}
                className={`border-b border-outline-variant flex ${isLunch ? "bg-surface-dim/10" : ""}`}
                style={{ height: SLOT_HEIGHT }}
              >
                {/* Time label */}
                <div className="w-16 p-2 text-right border-r border-outline-variant bg-surface-container-lowest sticky left-0 shrink-0">
                  <span className="font-caption text-caption text-on-surface-variant relative -top-3">
                    {formatHour(hour)}
                  </span>
                </div>

                {/* Day columns */}
                <div
                  className="flex-1 grid relative"
                  style={{ gridTemplateColumns: `repeat(${totalDays}, 1fr)` }}
                >
                  {isLunch ? (
                    /* Lunch break overlay */
                    <div
                      className="flex items-center justify-center"
                      style={{ gridColumn: `1 / -1` }}
                    >
                      <span className="font-caption text-caption text-outline uppercase tracking-widest bg-surface-container-lowest px-4 py-1 rounded-full border border-outline-variant">
                        Almuerzo
                      </span>
                    </div>
                  ) : (
                    /* Day cells + appointment blocks */
                    days.map((day, colIdx) => {
                      const cellAppointments = hourAppointments.filter(
                        (a) => a.dayIndex === colIdx
                      );
                      return (
                        <div 
                          key={`${hour}-${day.abbr}`} 
                          className="relative border-r border-outline-variant border-dashed last:border-r-0"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, hour, colIdx)}
                        >
                          {cellAppointments.map((apt) => (
                            <AppointmentBlock
                              key={apt.id}
                              appointment={apt}
                              slotHeight={SLOT_HEIGHT}
                              startHour={hour}
                            />
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
