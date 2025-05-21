"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./scheduling.module.css";
import {
  CalendarPlus,
  CalendarX,
  CalendarClock,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { get, post } from "../../utils/api"; 
import { getToken, removeToken } from "@/utils/auth";

interface Sede {
  id: string;
  nombre: string;
}

interface Especialidad {
  id: string;
  nombre: string;
}

interface Profesional {
  id: string;
  nombre: string;
}



const Scheduling = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);

  const [selectedSede, setSelectedSede] = useState("");
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [selectedProfesional, setSelectedProfesional] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Carga sedes y especialidades desde API
  useEffect(() => {
    async function fetchData() {
      try {
        const sedesData = await get("/api/sedes");
        setSedes(
          sedesData.map((item: any) => ({
            id: item.id ?? item.sedeId,
            nombre: item.nombre ?? item.nombreSede ?? "Sin nombre",
          }))
        );

        const espData = await get("/api/especialidades");
        setEspecialidades(
          espData.map((item: any) => ({
            id: item.id ?? item.especialidadId,
            nombre: item.nombre ?? item.nombreEspecialidad ?? "Sin nombre",
          }))
        );
      } catch (error) {
        console.error("Error cargando sedes o especialidades", error);
      }
    }
    fetchData();
  }, []);

  // Cuando cambia sede o especialidad, carga profesionales filtrados
  useEffect(() => {
    async function fetchProfesionales() {
      if (selectedSede && selectedEspecialidad) {
        try {
          const profData = await get(
            `/api/profesionales/filtrar?sedeId=${selectedSede}&especialidadId=${selectedEspecialidad}`
          );
          setProfesionales(
            profData.map((item: any) => ({
              id: item.id ?? item.profesionalId,
              nombre: item.nombre ?? item.nombreProfesional ?? "Sin nombre",
            }))
          );
        } catch (error) {
          console.error("Error cargando profesionales", error);
          setProfesionales([]);
        }
      } else {
        setProfesionales([]);
        setSelectedProfesional("");
      }
    }
    fetchProfesionales();
  }, [selectedSede, selectedEspecialidad]);

  // Cuando cambia profesional o fecha, carga horarios disponibles (horas)
  useEffect(() => {
    async function fetchHorarios() {
      if (selectedProfesional && selectedDay) {
        try {
          const fechaISO = selectedDay.toISOString().slice(0, 10);
          const ocupados: string[] = await get(
            `/api/citas/disponibilidad/${selectedProfesional}?fecha=${fechaISO}`
          );

          const horarios: string[] = [];
          for (let h = 8; h <= 17; h++) {
            const horaStr = h.toString().padStart(2, "0") + ":00";
            if (!ocupados.includes(horaStr)) horarios.push(horaStr);
          }
          setHorariosDisponibles(horarios);
          setSelectedTime("");
        } catch (error) {
          console.error("Error cargando horarios", error);
          setHorariosDisponibles([]);
        }
      } else {
        setHorariosDisponibles([]);
        setSelectedTime("");
      }
    }
    fetchHorarios();
  }, [selectedProfesional, selectedDay]);

  // Días disponibles: ejemplo con próximos 14 días, excluyendo fines de semana
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
    const token = getToken(); // Mover lectura de token aquí
    
console.log("Token antes de enviar:", token);
if (!token) {
  alert("Usuario no autenticado. Por favor inicie sesión.");
  return;
}


    if (
      !selectedProfesional ||
      !selectedTime ||
      !selectedDay ||
      !selectedSede ||
      !selectedEspecialidad
    ) {
      alert("Complete todos los campos.");
      return;
    }

    if (!token) {
      alert("Usuario no autenticado. Por favor inicie sesión.");
      return;
    }

    const fechaHoraISO = `${selectedDay.toISOString().slice(0, 10)}T${selectedTime}:00`;

    const cita = {
      profesionalId: selectedProfesional,
      sedeId: selectedSede,
      especialidadId: selectedEspecialidad,
      fechaHora: fechaHoraISO,
    };

    try {
      await post("/api/citas", cita, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Cita agendada correctamente");
      setShowModal(false);
      setSelectedDay(undefined);
      setSelectedSede("");
      setSelectedEspecialidad("");
      setSelectedProfesional("");
      setSelectedTime("");
    } catch (error) {
      alert("Error al agendar cita");
      console.error(error);
    }
  };

  const handleLogout = () => {
      removeToken();           // Elimina el token JWT
      router.push("/");        // Redirige a la página principal
    };
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
              <div className={styles.logoCircle}>
                <Image src="/logo.png" alt="Logo" width={70} height={70} className={styles.logoImage} />
              </div>
      
              <h2 className={styles.menuTitle}>Menú de Citas</h2>
              <div className={styles.menuOptions}>
                <button className={styles.menuButton} onClick={() => router.push("/scheduling")}>
                  <CalendarPlus size={24} className={styles.icon} />
                  Agendar Cita
                </button>
                <button
                  className={styles.menuButton}
                  style={{ backgroundColor: "#fcd34d" }}
                  onClick={() => router.push("/CancelAppointment")}
                >
                  <CalendarX size={24} className={styles.icon} />
                  Cancelar Cita
                </button>
                <button className={styles.menuButton} onClick={() => alert("Funcionalidad no disponible aún")}>
                  <CalendarClock size={24} className={styles.icon} />
                  Modificar Cita
                </button>
                <button className={styles.menuButton} onClick={() => router.push("/ViewAppointments")}>
                  <CalendarDays size={24} className={styles.icon} />
                  Visualizar Citas
                </button>
                <button className={`${styles.menuButton} ${styles.logoutButton}`} onClick={handleLogout}>
                  <LogOut size={24} className={styles.icon} />
                  Cerrar sesión
                </button>
              </div>
            </aside>

      <main className={styles.main}>
        <section className={styles.headerSection}>
          <div className={styles.welcome}>
            Bienvenido a CITASalud 
          </div>

          <h2 className={styles.title}>
            <CalendarPlus size={28} />
            Agendamiento de citas
          </h2>
          <p className={styles.subtitle}>
            Seleccione la sede, especialidad y fecha para continuar con su cita médica.
          </p>
        </section>

        <section className={styles.formSection}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Sede:</label>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
              >
                <option value="">Seleccione</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Especialidad:</label>
              <select
                value={selectedEspecialidad}
                onChange={(e) => setSelectedEspecialidad(e.target.value)}
              >
                <option value="">Seleccione</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.calendarSection}>
            <h3>Calendario Disponible</h3>
            <div className={styles.calendarWrapper}>
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

            <div className={styles.legend}>
              <div>
                <span className={`${styles.legendColor} ${styles.availableDay}`} />
                Día disponible
              </div>
              <div>
                <span className={`${styles.legendColor} ${styles.unavailableDay}`} />
                Día no disponible
              </div>
            </div>
          </div>
        </section>
      </main>

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
              <h3>Agendar cita para {selectedDay?.toLocaleDateString()}</h3>
              
            </div>

            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label>Sede:</label>
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Especialidad:</label>
                <select
                  value={selectedEspecialidad}
                  onChange={(e) => setSelectedEspecialidad(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Profesional:</label>
                <select
                  value={selectedProfesional}
                  onChange={(e) => setSelectedProfesional(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {profesionales.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
  <label>Horario:</label>
  <select
    value={selectedTime}
    onChange={(e) => setSelectedTime(e.target.value)}
  >
    <option value="">Seleccione</option>
    {Array.from({ length: 18 }, (_, i) => {
      const hour = Math.floor(i / 2) + 8;
      const minute = i % 2 === 0 ? "00" : "30";
      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
      return (
        <option key={time} value={time}>
          {time}
        </option>
      );
    })}
  </select>
</div>
            </div>

            <div className={styles.modalFooter}>
  <button className={styles.confirmButton} onClick={handleConfirm}>
    Confirmar cita
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
    </div>
  );
};

export default Scheduling;
