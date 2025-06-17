// components/organisms/ModifyAppointment.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";

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

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Modificar Cita Médica
      </h2>

      {loading ? (
        <p>Cargando cita...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Fecha y hora actual:</strong>{" "}
            {fechaHoraActual?.toLocaleString()}
          </p>

          <label htmlFor="nuevaFechaHora" style={{ display: "block", marginTop: "1rem" }}>
            Nueva fecha y hora:
          </label>
          <input
            id="nuevaFechaHora"
            type="datetime-local"
            value={nuevaFechaHora}
            onChange={(e) => setNuevaFechaHora(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Confirmar Cambio
          </button>
        </form>
      )}

      {mensaje && (
        <p style={{ marginTop: "1rem", color: mensaje.includes("exitosamente") ? "green" : "red" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default ModifyAppointment;
