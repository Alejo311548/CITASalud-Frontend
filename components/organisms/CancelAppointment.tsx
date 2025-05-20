"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./scheduling.module.css"; // reutiliza estilos iguales
import {
  CalendarPlus,
  CalendarX,
  CalendarClock,
  CalendarDays,
} from "lucide-react";
import { LogOut } from "lucide-react";


const user = {
  name: "Juan Pérez",
  role: "Paciente",
};

// Datos simulados de citas (normalmente vendrían de API)
const patientAppointments = [
  {
    id: 1,
    date: new Date(2025, 4, 20, 8, 0),
    specialist: "Dr. Gómez",
  },
  {
    id: 2,
    date: new Date(2025, 4, 25, 10, 0),
    specialist: "Dra. Ruiz",
  },
];

const cancellationReasons = [
  "Mejoría de síntomas",
  "Problemas de transporte",
  "Cambio de fecha",
  "Otro",
];

const CancelAppointment = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedAppointment = patientAppointments.find(
    (a) => a.id === selectedAppointmentId
  );

  const handleCancel = () => {
    if (!selectedAppointmentId || !selectedReason) return;

    let reasonText = selectedReason === "Otro" ? otherReasonText.trim() : selectedReason;
    if (selectedReason === "Otro" && reasonText.length === 0) {
      alert("Por favor ingrese el motivo de cancelación.");
      return;
    }

    alert(
      `Cita cancelada:\nFecha: ${selectedAppointment?.date.toLocaleString()}\nEspecialista: ${selectedAppointment?.specialist}\nMotivo: ${reasonText}`
    );

    // Aquí podrías llamar a una API para cancelar la cita realmente

    // Resetear formulario
    setSelectedAppointmentId(null);
    setSelectedReason("");
    setOtherReasonText("");
    setShowConfirmation(false);
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
          <button className={styles.menuButton}>
            <CalendarPlus size={24} className={styles.icon} />
            Agendar Cita
          </button>
          <button className={styles.menuButton} style={{ backgroundColor: "#ef4444", color: "white" }}>
            <CalendarX size={24} className={styles.icon} />
            Cancelar Cita
          </button>
          <button className={styles.menuButton}>
            <CalendarClock size={24} className={styles.icon} />
            Modificar Cita
          </button>
          <button className={styles.menuButton}>
            <CalendarDays size={24} className={styles.icon} />
            Visualizar Citas
          </button>
          


<button className={`${styles.menuButton} ${styles.logoutButton}`}>
  <LogOut size={24} className={styles.icon} />
  Cerrar sesión
</button>

        </div>
      </aside>

      <main className={styles.main}>
        <section className={styles.headerSection}>
          <div className={styles.welcome}>
            Bienvenido a CITASalud, <strong>{user.name}</strong> ({user.role})
          </div>

          <h2 className={styles.title}>
            <CalendarX size={28} />
            Cancelación de citas
          </h2>
          <p className={styles.subtitle}>
            Seleccione la cita que desea cancelar y el motivo de la cancelación.
          </p>
        </section>

        <section className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label>Citas disponibles:</label>
            <select
              value={selectedAppointmentId ?? ""}
              onChange={(e) => setSelectedAppointmentId(Number(e.target.value))}
            >
              <option value="">Seleccione una cita</option>
              {patientAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {`${appointment.date.toLocaleDateString()} - ${appointment.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${appointment.specialist}`}
                </option>
              ))}
            </select>
          </div>

          {selectedAppointmentId && (
            <>
              <div className={styles.inputGroup}>
                <label>Motivo de cancelación:</label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                >
                  <option value="">Seleccione un motivo</option>
                  {cancellationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {selectedReason === "Otro" && (
                <div className={styles.inputGroup}>
                  <label>Especifique motivo:</label>
                  <textarea
                    rows={3}
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                    placeholder="Escriba aquí el motivo de cancelación"
                    style={{ resize: "none", padding: "0.5rem", borderRadius: "10px", borderColor: "#cbd5e1", fontSize: "1rem", fontFamily: "inherit" }}
                  />
                </div>
              )}

              <div className={styles.modalActions} style={{ marginTop: "1.5rem" }}>
                <button
                  onClick={handleCancel}
                  disabled={!selectedReason || (selectedReason === "Otro" && otherReasonText.trim() === "")}
                >
                  Cancelar cita
                </button>
                <button
                  onClick={() => {
                    setSelectedAppointmentId(null);
                    setSelectedReason("");
                    setOtherReasonText("");
                  }}
                  style={{ backgroundColor: "#ef4444", color: "white" }}
                >
                  Limpiar
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default CancelAppointment;
