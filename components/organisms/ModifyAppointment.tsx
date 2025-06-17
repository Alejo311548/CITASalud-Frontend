"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./scheduling.module.css"; 
import { CalendarClock, CalendarDays, LogOut } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { get, put } from "../../utils/api";
import { getToken, removeToken } from "@/utils/auth";

interface ModifyAppointmentProps {
  citaId: string; // Id de la cita a modificar, debe venir desde página padre o query param
}

const ModifyAppointment: React.FC<ModifyAppointmentProps> = ({ citaId }) => {
  const router = useRouter();

  const [cita, setCita] = useState<any>(null); // Cita original para mostrar datos fijos
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Cargar la cita original
  useEffect(() => {
    async function fetchCita() {
      try {
        const token = getToken();
        if (!token) {
          alert("No autenticado");
          router.push("/");
          return;
        }
        const citaData = await get(`/api/citas/${citaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCita(citaData);
        const fecha = new Date(citaData.fechaHora);
        setSelectedDay(fecha);
        setSelectedTime(fecha.toTimeString().slice(0, 5)); // "HH:mm"
      } catch (error) {
        console.error("Error cargando cita", error);
        alert("Error cargando cita");
      }
    }
    fetchCita();
  }, [citaId, router]);

  // Cargar horarios disponibles para profesional y fecha seleccionada (excepto el horario actual)
  useEffect(() => {
    async function fetchHorarios() {
      if (cita && selectedDay) {
        try {
          const token = getToken();
          if (!token) return;
          const fechaISO = selectedDay.toISOString().slice(0, 10);
          const ocupados: string[] = await get(
            `/api/citas/disponibilidad/${cita.profesionalId}?fecha=${fechaISO}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Excluir el horario actual para permitir re-selección
          const ocupadosFiltrados = ocupados.filter(
            (h) => h !== cita.fechaHora.slice(11, 16)
          );

          const horarios: string[] = [];
          for (let h = 8; h <= 17; h++) {
            const horaStr = h.toString().padStart(2, "0") + ":00";
            if (!ocupadosFiltrados.includes(horaStr)) horarios.push(horaStr);
          }
          setHorariosDisponibles(horarios);
          if (!horarios.includes(selectedTime)) setSelectedTime("");
        } catch (error) {
          console.error("Error cargando horarios", error);
          setHorariosDisponibles([]);
          setSelectedTime("");
        }
      }
    }
    fetchHorarios();
  }, [cita, selectedDay, selectedTime]);

  // Días disponibles: próximos 14 días, sin fines de semana
  const getAvailableDays = () => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayOfWeek = day.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) days.push(day);
    }
    return days;
  };
  const availableDays = getAvailableDays();

  const handleDateSelect = (day: Date | undefined) => {
    if (
      day &&
      availableDays.some(
        (d) =>
          d.getFullYear() === day.getFullYear() &&
          d.getMonth() === day.getMonth() &&
          d.getDate() === day.getDate()
      )
    ) {
      setSelectedDay(day);
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    const token = getToken();
    if (!token) {
      alert("Usuario no autenticado. Por favor inicie sesión.");
      return;
    }

    if (!selectedDay || !selectedTime) {
      alert("Seleccione fecha y hora válidas.");
      return;
    }

    const fechaHoraISO = `${selectedDay.toISOString().slice(0, 10)}T${selectedTime}:00`;

    try {
      await put(
        `/api/citas/${citaId}`,
        { fechaHora: fechaHoraISO },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Cita modificada correctamente");
      setShowModal(false);
      router.push("/ViewAppointments");
    } catch (error) {
      alert("Error al modificar cita");
      console.error(error);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  if (!cita) return <div>Cargando cita...</div>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoCircle}>
          <Image src="/logo.png" alt="Logo" width={70} height={70} />
        </div>

        <h2 className={styles.menuTitle}>Menú de Citas</h2>
        <div className={styles.menuOptions}>
          <button
            className={styles.menuButton}
            onClick={() => router.push("/scheduling")}
          >
            <CalendarClock size={24} className={styles.icon} />
            Agendar Cita
          </button>
          <button
            className={styles.menuButton}
            onClick={() => router.push("/CancelAppointment")}
          >
            Cancelar Cita
          </button>
          <button
            className={styles.menuButton}
            style={{ backgroundColor: "#fcd34d" }}
            onClick={() => router.push("/ModifyAppointment")}
          >
            Modificar Cita
          </button>
          <button
            className={styles.menuButton}
            onClick={() => router.push("/ViewAppointments")}
          >
            Visualizar Citas
          </button>
          <button
            className={`${styles.menuButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <section className={styles.headerSection}>
          <div className={styles.welcome}>Modifique la fecha y hora de su cita</div>

          <h2 className={styles.title}>
            <CalendarClock size={28} />
            Modificación de cita
          </h2>
          <p className={styles.subtitle}>
            Profesional: {cita.profesionalNombre} <br />
            Sede: {cita.sedeNombre} <br />
            Especialidad: {cita.especialidadNombre}
          </p>
        </section>

        <section className={styles.formSection}>
          <div className={styles.calendarSection}>
            <h3>Seleccione nueva fecha</h3>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDateSelect}
              modifiers={{ available: availableDays }}
              modifiersClassNames={{
                available: styles.availableDay,
                selected: styles.selectedDay,
              }}
            />
          </div>

          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalLogoCircle}>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className={styles.modalLogoImage}
                  />
                </div>
                <div className={styles.modalHeader}>
                  <h3>
                    Modificar cita para {selectedDay?.toLocaleDateString()}
                  </h3>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.inputGroup}>
                    <label>Horario disponible:</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Seleccione</option>
                      {horariosDisponibles.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.confirmButton}
                    onClick={handleConfirm}
                    disabled={!selectedTime}
                  >
                    Confirmar cambio
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModifyAppointment;
