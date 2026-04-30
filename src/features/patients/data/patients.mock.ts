import type { PatientRecord } from "../types/patients.types";

export const PATIENT_RECORDS: PatientRecord[] = [
  {
    id: "1",
    dni: "45892103F",
    name: "María González",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmKnnHVxFB6hqT3W-hVJEVep97oRAlsvISAoG5KLL1JD0jxupyW5aUgJ5diMKWAk1fdvhwLiD1xKFwq3nVs739Gx_wGQkxReMbY1zeeO5sV74KN3Me2HNfE9MYphww2gXyMwIIJ7qBSiBTUWbGqSzoHIGUVVOgvbfRp2pvqOKmA2Z1SUOmNmdl4yTpuU4U6qQAkAr_Ndp8F95NZe-0bbbgc6e7GYZntGcBYI33-QSD492ugD6ow1u2NIPRw5iOKgl6Zk_X1fD0NUw",
    initials: "MG",
    lastVisit: "12 Oct 2023",
    nextAppointmentDate: "24 Nov 2023",
    nextAppointmentTime: "10:00 AM",
    status: "En Tratamiento",
  },
  {
    id: "2",
    dni: "71239485X",
    name: "Carlos Ruiz",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtseP5wtcOqJfABYOoBh7V9uzNbNqtzv292UxuPAQK3uWEIPbSXLl0SZA4LYsCDWeW7wNeULK5bIAa8rANXCm6HS2MTva2sViIJOQQbYuAhbi2k383J1bAaXumyKxgOGPwnfKgFHjq6kQ8cgwweSCKzri99qPwYpXY4SmJddRbJ_tKsZ-ACanHZnMop4uZUD6R3WcbEr-FEIAzKUgwPgOL-8dSXsrVTNjsZpSvnjdBEicQSWmH8LoD_tJKeooXD_4WRNDTLS8FeAE",
    initials: "CR",
    lastVisit: "05 Sep 2023",
    status: "Activo",
  },
  {
    id: "3",
    dni: "50192837C",
    name: "Ana López",
    initials: "AL",
    lastVisit: "20 Ene 2022",
    status: "Inactivo",
  },
];
