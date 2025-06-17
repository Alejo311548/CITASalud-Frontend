"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./scheduling.module.css";
import { getToken } from "@/utils/auth";

const ModifyAppointment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [originalAppointment, setOriginalAppointment] = useState<any>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = getToken();

      if (!token || !appointmentId) {
        setError("No se encontró la cita o el usuario no está autenticado.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://citasalud-backend-1.onrender.com/api/citas/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("No se pudo obtener la cita.");
        }

        const data = await res.json();
        setOriginalAppointment(data);
        setNewDate(data.fechaHora.split("T")[0]);
        setNewTime(data.fechaHora.split("T")[1].slice(0, 5));
      } catch (err) {
        setError("Error cargando la cita.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token || !appointmentId) return;

    const updatedDateTime = `${newDate}T${newTime}:00`;

    try {
      const res = await fetch(
        `https://citasalud-backend-1.onrender.com/api/citas/modificar/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fechaHora: updatedDateTime,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al modificar la cita.");
      }

      alert("Cita modificada correctamente.");
      router.push("/ViewAppointments");
    } catch (err) {
      console.error(err);
      setError("No se pudo modificar la cita.");
    }
  };

  if (loading) return <p className={styles.main}>Cargando...</p>;

  if (error)
    return (
      <p className={styles.main} style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <div className={styles.main}>
      <h2 className={styles.title}>Modificar Cita Médica</h2>
      <p className={styles.subtitle}>
        Cambia la fecha y hora de tu cita agendada.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Nueva Fecha:
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Nueva Hora:
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <button type="submit" className={styles.submitButton}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ModifyAppointment;
