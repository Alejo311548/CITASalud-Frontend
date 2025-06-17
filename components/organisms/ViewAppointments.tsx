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
import { getToken, removeToken } from "@/utils/auth";

const ViewAppointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getToken();

      if (!token) {
        setError("Usuario no autenticado. Por favor inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://citasalud-backend-1.onrender.com/api/citas/mis-citas", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar las citas");
        }

        const data = await response.json();

        const formattedAppointments = data.map((cita: any) => ({
          id: cita.citaId || cita.id || Math.random(),
          date: new Date(cita.fechaHora),
          specialist: cita.profesional?.nombre || "Desconocido",
          specialty: cita.profesional?.especialidad?.nombre || "Desconocida",
          location: cita.sede?.nombre || "No definida",
          status: cita.estado,
        }));

        setAppointments(formattedAppointments);
      } catch (err: any) {
        console.error(err);
        setError("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoCircle}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className={styles.logoImage}
          />
        </div>

        <h2 className={styles.menuTitle}>Menú de Citas</h2>
        <div className={styles.menuOptions}>
          <button
            className={styles.menuButton}
            onClick={() => router.push("/scheduling")}
          >
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
          <button
            className={styles.menuButton}
            onClick={() => alert("Funcionalidad no disponible aún")}
          >
            <CalendarClock size={24} className={styles.icon} />
            Modificar Cita
          </button>
          <button
            className={styles.menuButton}
            onClick={() => router.push("/ViewAppointments")}
          >
            <CalendarDays size={24} className={styles.icon} />
            Visualizar Citas
          </button>
          <button
            className={`${styles.menuButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            <LogOut size={24} className={styles.icon} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <section className={styles.headerSection}>
          <div className={styles.welcome}>
            Bienvenido a CITASalud, <strong>Paciente</strong>
          </div>

          <h2 className={styles.title}>
            <CalendarDays size={28} />
            Mis Citas Médicas
          </h2>
          <p className={styles.subtitle}>
            Aquí puedes ver todas las citas programadas para ti.
          </p>
        </section>

        <section className={styles.formSection}>
          {loading ? (
            <p>Cargando citas...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : appointments.length === 0 ? (
            <p>No tienes citas agendadas.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#3b82f6", color: "white" }}>
                  <th style={{ padding: "0.75rem", borderRadius: "8px 0 0 8px" }}>
                    Fecha y Hora
                  </th>
                  <th>Especialista</th>
                  <th>Especialidad</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th style={{ borderRadius: "0 8px 0 0" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #cbd5e1",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      {appt.date.toLocaleDateString()}{" "}
                      {appt.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{appt.specialist}</td>
                    <td>{appt.specialty}</td>
                    <td>{appt.location}</td>
                    <td
                      style={{
                        color:
                          appt.status === "AGENDADA" ? "#22c55e" : "#f59e0b",
                        fontWeight: "700",
                      }}
                    >
                      {appt.status}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {appt.status === "AGENDADA" && (
                        <button
                          style={{
                            backgroundColor: "#facc15",
                            color: "black",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            router.push(`/ModifyAppointment/${appt.id}`)
                          }
                        >
                          Modificar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default ViewAppointments;
