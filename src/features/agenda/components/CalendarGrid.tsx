import type { CalendarGridProps } from "../types/agenda.types";
import { AppointmentBlock } from "./AppointmentBlock";
import { LUNCH_HOUR } from "../data/agenda.mock";

const SLOT_HEIGHT = 80; // px — height of each hour row

export const CalendarGrid = ({
  days,
  appointments,
  startHour = 8,
  endHour = 18,
}: CalendarGridProps) => {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const totalDays = days.length;

  const formatHour = (h: number) => {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
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
      <div className="flex-1 overflow-y-auto relative bg-surface-container-lowest">
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
                        <div key={`${hour}-${day.abbr}`} className="relative border-r border-outline-variant border-dashed last:border-r-0">
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
