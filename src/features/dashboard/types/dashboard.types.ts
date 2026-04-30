export type AppointmentStatus = "completed" | "registered" | "upcoming";
export type TimePeriod = "AM" | "PM";

export interface SummaryCard {
  id: string;
  icon: string;
  label: string;
  value: string;
  badge: {
    text: string;
    variant: "default" | "success" | "error";
  };
  iconStyle: {
    background: string;
    color: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  treatment: string;
  status: AppointmentStatus;
  date: string;
}

export interface Appointment {
  id: string;
  time: string;
  period: TimePeriod;
  patient: string;
  treatment: string;
  icon: string;
  isActive?: boolean;
}
