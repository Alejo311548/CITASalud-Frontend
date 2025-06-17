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
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);
    setMensaje("");

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

      setMensaje("✔️ Cita modificada exitosamente.");
      setTimeout(() => router.push("/ViewAppointments"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("⚠️ Error al modificar la cita.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        {/* Aquí va el menú lateral si lo tienes definido */}
      </aside>

      <main className="mainContent">
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <h2 className="titleSection">Modificar Cita Médica</h2>

          <section className="formSection" style={{ maxWidth: 600 }}>
            {loading ? (
              <p>Cargando cita...</p>
            ) : (
              <form onSubmit={handleSubmit} className="formContainer" noValidate>
                <p className="currentDate">
                  <strong>Fecha y hora actual:</strong>{" "}
                  {fechaHoraActual?.toLocaleString()}
                </p>

                <label htmlFor="nuevaFechaHora" className="label">
                  Nueva fecha y hora:
                </label>
                <input
                  id="nuevaFechaHora"
                  type="datetime-local"
                  value={nuevaFechaHora}
                  onChange={(e) => setNuevaFechaHora(e.target.value)}
                  required
                  className="inputDateTime"
                  disabled={submitting}
                />

                <button
                  type="submit"
                  className="confirmButton"
                  disabled={submitting}
                >
                  {submitting ? "Modificando..." : "Confirmar Cambio"}
                </button>
              </form>
            )}

            {mensaje && (
              <p
                className={
                  mensaje.includes("exitosamente")
                    ? "successMessage"
                    : "errorMessage"
                }
                style={{ marginTop: "1rem" }}
              >
                {mensaje}
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ModifyAppointment;
