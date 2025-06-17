"use client";

import React, { useEffect, useState } from "react";
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

interface ModifyAppointmentProps {
  appointmentId: string;
}

const ModifyAppointment = ({ appointmentId }: ModifyAppointmentProps) => {
  const router = useRouter();
  const [fechaHoraActual, setFechaHoraActual] = useState<Date | null>(null);
  const [nuevaFechaHora, setNuevaFechaHora] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetch(
          `https://citasalud-backend-1.onrender.com/api/citas/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener la cita.");

        const data = await response.json();
        setFechaHoraActual(new Date(data.fechaHora));
      } catch (error) {
        console.error(error);
        setMensaje("No se pudo cargar la cita.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `https://citasalud-backend-1.onrender.com/api/citas/modificar/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nuevaFechaHora }),
        }
      );

      if (!response.ok) throw new Error("No se pudo modificar la cita");

      setMensaje("Cita modificada exitosamente.");
      setTimeout(() => router.push("/ViewAppointments"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("Error al modificar la cita.");
    }
  };

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
          <div className={styles.welcome}>Bienvenido a CITASalud</div>

          <h2 className={styles.title}>
            <CalendarClock size={28} />
            Modificación de cita médica
          </h2>
          <p className={styles.subtitle}>
            Cambie la fecha y hora de su cita médica seleccionando el nuevo
            horario.
          </p>
        </section>

        <section className={styles.formSection} style={{ maxWidth: 600 }}>
          {loading ? (
            <p>Cargando cita...</p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.formText}>
                <strong>Fecha y hora actual:</strong>{" "}
                {fechaHoraActual?.toLocaleString()}
              </p>

              <label htmlFor="nuevaFechaHora" className={styles.label}>
                Nueva fecha y hora:
              </label>
              <input
                id="nuevaFechaHora"
                type="datetime-local"
                value={nuevaFechaHora}
                onChange={(e) => setNuevaFechaHora(e.target.value)}
                required
                className={styles.input}
              />

              <button type="submit" className={styles.confirmButton}>
                Confirmar cambio
              </button>
            </form>
          )}

          {mensaje && (
            <p
              className={
                mensaje.includes("exitosamente")
                  ? styles.successMessage
                  : styles.errorMessage
              }
              style={{ marginTop: "1rem" }}
            >
              {mensaje}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModifyAppointment;
