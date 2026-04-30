import type { Appointment } from "../types/agenda.types";
import { useMemo } from "react";

interface CalendarMonthGridProps {
  currentDate: Date;
  appointments: Appointment[];
}

export const CalendarMonthGrid = ({ currentDate, appointments }: CalendarMonthGridProps) => {
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Ajustar para que Lunes = 0, Domingo = 6
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Días en este mes
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    // Días en el mes anterior
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    
    const calendarDays = [];
    
    // Relleno del mes anterior
    for (let i = startOffset - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, prevMonthDaysCount - i),
        isCurrentMonth: false,
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysCount; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Relleno del mes siguiente (para completar 6 filas de 7 días = 42 celdas)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return calendarDays;
  }, [currentDate]);

  const weekDaysHeader = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper para mapear las citas mockeadas a los días de la semana actual
  const currentWeekMonday = new Date(today);
  const todayDay = currentWeekMonday.getDay() === 0 ? 7 : currentWeekMonday.getDay();
  currentWeekMonday.setDate(currentWeekMonday.getDate() - todayDay + 1);

  return (
    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
      {/* ── Days Header ── */}
      <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-lowest">
        {weekDaysHeader.map((day, idx) => (
          <div key={day} className={`p-3 text-center border-r border-outline-variant last:border-r-0 ${idx >= 5 ? "bg-surface-dim/30" : ""}`}>
            <span className={`font-caption text-caption uppercase tracking-wider ${idx >= 5 ? "text-outline" : "text-on-surface-variant"}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* ── Month Grid ── */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {daysInMonth.map((dayObj, index) => {
          // Normalizamos la hora para comparar fechas limpiamente
          const d = new Date(dayObj.date);
          d.setHours(0, 0, 0, 0);
          
          const isToday = d.getTime() === today.getTime();
          const isWeekend = index % 7 >= 5;
          
          // Lógica Mock: Colocar citas solo si este día pertenece a la semana en curso real
          let dayAppointments: Appointment[] = [];
          const diffTime = d.getTime() - currentWeekMonday.getTime();
          const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
          
          if (diffDays >= 0 && diffDays <= 6) {
             dayAppointments = appointments.filter(a => a.dayIndex === diffDays);
             // Ordenar por hora
             dayAppointments.sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
          }

          return (
            <div 
              key={index} 
              className={`border-r border-b border-outline-variant last:border-r-0 p-1 flex flex-col ${!dayObj.isCurrentMonth ? "bg-surface-dim/10 opacity-60" : isWeekend ? "bg-surface-dim/20" : ""} ${isToday ? "bg-primary-fixed" : ""}`}
            >
              <div className="flex justify-end p-1">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full font-h3 text-h3 ${isToday ? "bg-primary text-on-primary" : "text-on-surface"} ${!dayObj.isCurrentMonth ? "text-outline" : ""}`}>
                  {dayObj.date.getDate()}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 px-1">
                {dayAppointments.map(apt => {
                  const formatTime = (h: number, m: number) => `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}`;
                  
                  // Variantes de color simplificadas para la vista mes
                  const variantClasses = {
                    primary: "bg-primary-container text-on-primary-container border-primary/20",
                    secondary: "bg-secondary-container text-on-secondary-container border-secondary/20",
                    error: "bg-error-container text-on-error-container border-error/20",
                    neutral: "bg-surface-variant text-on-surface border-outline-variant"
                  }[apt.variant] || "bg-surface-variant text-on-surface border-outline-variant";

                  return (
                    <div 
                      key={apt.id} 
                      className={`text-[10px] leading-tight px-1.5 py-1 rounded truncate border ${variantClasses} font-medium cursor-pointer hover:shadow-sm transition-shadow`}
                      title={`${formatTime(apt.startHour, apt.startMinute)} - ${apt.patient} (${apt.treatment})`}
                    >
                      {formatTime(apt.startHour, apt.startMinute)} - {apt.patient}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
