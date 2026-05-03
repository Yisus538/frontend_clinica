import { useState, useMemo } from "react";
import { Link } from "react-router";
import { CalendarHeader } from "../features/agenda/components/CalendarHeader";
import { CalendarGrid } from "../features/agenda/components/CalendarGrid";
import { CalendarMonthGrid } from "../features/agenda/components/CalendarMonthGrid";
import { AppointmentEditModal } from "../features/agenda/components/AppointmentEditModal";
import { APPOINTMENTS } from "../features/agenda/data/agenda.mock";
import type { Appointment, ViewMode, WeekDay } from "../features/agenda/types/agenda.types";

/* ── Helpers ── */
function getWeekDays(baseDate: Date): WeekDay[] {
  const days: WeekDay[] = [];
  const startOfWeek = new Date(baseDate);
  // Convert Sunday (0) to 7 so Monday is 1
  const day = startOfWeek.getDay() === 0 ? 7 : startOfWeek.getDay();
  // Move to Monday
  startOfWeek.setDate(startOfWeek.getDate() - day + 1);

  const abbrs = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    
    days.push({
      abbr: abbrs[i],
      number: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      isWeekend: i >= 5, // Sat (5) and Sun (6)
    });
  }
  return days;
}

export const AgendaPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const currentWeekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Formato del encabezado, ej: "Abril 2026"
  const monthYear = currentDate.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric"
  }).replace(/^\w/, c => c.toUpperCase());

  // Determinar qué días mostrar basado en la vista
  const daysToRender = viewMode === "day"
    ? currentWeekDays.filter((_, i) => {
        // Find which day of the week corresponds to currentDate
        const currentDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
        return i === currentDayIndex;
      })
    : currentWeekDays;

  // Navegación
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAppointmentMove = (id: string, newDayIndex: number, newStartHour: number, newStartMinute: number) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          dayIndex: newDayIndex,
          startHour: newStartHour,
          startMinute: newStartMinute
        };
      }
      return apt;
    }));
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
  };

  const handleSaveAppointment = (updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setSelectedAppointment(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px-48px)]">
      {/* Calendar Header */}
      <CalendarHeader
        monthYear={monthYear}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {/* Calendar Grid */}
      {viewMode === "month" ? (
        <CalendarMonthGrid 
          currentDate={currentDate} 
          appointments={appointments} 
        />
      ) : (
        <CalendarGrid
          days={daysToRender.length > 0 ? daysToRender : [currentWeekDays[0]]}
          appointments={appointments}
          startHour={0}
          endHour={23}
          onAppointmentMove={handleAppointmentMove}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {/* Mobile FAB */}
      <Link 
        to="/dashboard/agenda/nueva-cita"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors z-50 cursor-pointer"
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          add
        </span>
      </Link>

      {/* Edit Appointment Modal */}
      <AppointmentEditModal
        isOpen={selectedAppointment !== null}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};
