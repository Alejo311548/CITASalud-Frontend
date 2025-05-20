"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./scheduling.module.css";
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

// Simulamos las citas del paciente (luego esto vendrá de una API)
const mockAppointments = [
  {
    id: 1,
    date: new Date(2025, 4, 20, 8, 0),
    specialist: "Dr. Gómez",
    specialty: "Cardiología",
    location: "Sede Centro",
    status: "Confirmada",
  },
  {
    id: 2,
    date: new Date(2025, 4, 22, 14, 0),
    specialist: "Dra. Ruiz",
    specialty: "Dermatología",
    location: "Sede Norte",
    status: "Pendiente",
  },
];

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState<typeof mockAppointments>([]);

  useEffect(() => {
    // Aquí podrías cargar las citas desde un API real con fetch/axios usando el paciente autenticado
    setAppointments(mockAppointments);
  }, []);

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
          <button className={styles.menuButton}>
            <CalendarX size={24} className={styles.icon} />
            Cancelar Cita
          </button>
          <button className={styles.menuButton}>
            <CalendarClock size={24} className={styles.icon} />
            Modificar Cita
          </button>
          <button className={styles.menuButton} style={{ backgroundColor: "#bae6fd" }}>
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
            <CalendarDays size={28} />
            Mis Citas Médicas
          </h2>
          <p className={styles.subtitle}>
            Aquí puedes ver todas las citas programadas para ti.
          </p>
        </section>

        <section className={styles.formSection}>
          {appointments.length === 0 ? (
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
                      {appt.date.toLocaleDateString()} {appt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>{appt.specialist}</td>
                    <td>{appt.specialty}</td>
                    <td>{appt.location}</td>
                    <td
                      style={{
                        color: appt.status === "Confirmada" ? "#22c55e" : "#f59e0b",
                        fontWeight: "700",
                      }}
                    >
                      {appt.status}
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
