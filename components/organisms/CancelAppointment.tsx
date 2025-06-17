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

const CancelAppointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getToken();

      if (!token) {
        setError("Usuario no autenticado. Por favor inicie sesión.");
        setLoading(false);
        return;
      }

      console.log("Token obtenido:", token);

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

  const handleCancel = async () => {
    if (!selectedAppointmentId || !cancelReason) {
      alert("Selecciona una cita y proporciona un motivo.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Usuario no autenticado. Por favor inicie sesión.");
      return;
    }

    try {
      const response = await fetch(`https://citasalud-backend-1.onrender.com/api/citas/${selectedAppointmentId}/cancelar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motivo: cancelReason }),
      });

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      alert("Cita cancelada exitosamente.");
      setAppointments((prev) => prev.filter((c) => c.id !== selectedAppointmentId));
      setSelectedAppointmentId(null);
      setCancelReason("");
    } catch (err: any) {
      console.error(err);
      alert("No se pudo cancelar la cita.");
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
            Bienvenido a CITASalud, <strong>paciente</strong>
          </div>

          <h2 className={styles.title}>
            <CalendarX size={28} />
            Cancelación de citas médicas
          </h2>
          <p className={styles.subtitle}>Selecciona la cita que deseas cancelar.</p>
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
                <tr style={{ backgroundColor: "#ef4444", color: "white" }}>
                  <th style={{ padding: "0.75rem", borderRadius: "8px 0 0 8px" }}>Fecha y Hora</th>
                  <th>Especialista</th>
                  <th>Especialidad</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    style={{
                      backgroundColor: "#fef2f2",
                      borderBottom: "1px solid #fecaca",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      {appt.date.toLocaleDateString()}{" "}
                      {appt.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td>{appt.specialist}</td>
                    <td>{appt.specialty}</td>
                    <td>{appt.location}</td>
                    <td style={{ fontWeight: "bold", color: "#ef4444" }}>{appt.status}</td>
                    <td>
                      <button
                        onClick={() => setSelectedAppointmentId(appt.id)}
                        style={{
                          backgroundColor: "#f87171",
                          border: "none",
                          color: "white",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedAppointmentId && (
            <div style={{ marginTop: "2rem" }}>
              <h3>Motivo de cancelación</h3>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Describe el motivo de la cancelación..."
                style={{ width: "100%", padding: "1rem", borderRadius: "8px", marginTop: "0.5rem" }}
              ></textarea>
              <button
                onClick={handleCancel}
                style={{
                  marginTop: "1rem",
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancelar Cita
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CancelAppointments;
