import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { CalendarHeader } from "../features/agenda/components/CalendarHeader";
import { CalendarGrid } from "../features/agenda/components/CalendarGrid";
import { CalendarMonthGrid } from "../features/agenda/components/CalendarMonthGrid";
import { AppointmentEditModal } from "../features/agenda/components/AppointmentEditModal";
import {
  appointmentsApi,
  toAppointment,
  type ApiAppointment,
} from "../features/agenda/api/appointments.api";
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
  const [apiAppointments, setApiAppointments] = useState<ApiAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const currentWeekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const weekStart = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  useEffect(() => {
    appointmentsApi
      .findAll()
      .then(setApiAppointments)
      .catch(() => setApiAppointments([]));
  }, []);

  const appointments = useMemo(
    () => apiAppointments.map((a) => toAppointment(a, weekStart)),
    [apiAppointments, weekStart]
  );

  // Formato del encabezado, ej: "Abril 2026"
  const monthYear = currentDate
    .toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  // Determinar qué días mostrar basado en la vista
  const daysToRender =
    viewMode === "day"
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

  const handleAppointmentMove = (
    id: string,
    newDayIndex: number,
    newStartHour: number,
    newStartMinute: number
  ) => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + newDayIndex);
    newDate.setHours(newStartHour, newStartMinute, 0, 0);
    appointmentsApi
      .update(id, { scheduledAt: newDate.toISOString() })
      .then((updated) => {
        setApiAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
        toast.success("Cita reprogramada");
      })
      .catch(() => toast.error("No se pudo reprogramar la cita."));
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
  };

  const handleSaveAppointment = (updated: Appointment) => {
    const original = apiAppointments.find((a) => a.id === updated.id);
    if (!original) return;
    appointmentsApi
      .update(updated.id, {
        notes: updated.treatment !== "Consulta" ? updated.treatment : undefined,
        durationMinutes: updated.durationMinutes,
      })
      .then((saved) => {
        setApiAppointments((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
        setSelectedAppointment(null);
        toast.success("Cita actualizada", {
          description: `Los cambios para la cita de ${updated.patient} se guardaron correctamente.`,
        });
      })
      .catch(() => toast.error("No se pudo guardar la cita."));
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
        <CalendarMonthGrid currentDate={currentDate} appointments={appointments} />
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
        key={selectedAppointment?.id ?? "closed"}
        isOpen={selectedAppointment !== null}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};
