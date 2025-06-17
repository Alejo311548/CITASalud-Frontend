"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./scheduling.module.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarClock, LogOut } from "lucide-react";

import { getToken, removeToken } from "@/utils/auth";
import { get, put } from "@/utils/api";

export default function ModifyAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const citaId = searchParams.get("citaId");

  const [loading, setLoading] = useState(true);
  const [cita, setCita] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);

  // Redirige si no hay citaId
  useEffect(() => {
    if (!citaId) {
      alert("ID de cita no especificado.");
      router.push("/ViewAppointments");
    }
  }, [citaId, router]);

  // 1) Cargar la cita actual
  useEffect(() => {
    if (!citaId) return;
    (async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No autenticado");
        const data = await get(`/api/citas/${citaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCita(data);
        const dt = new Date(data.fechaHora);
        setSelectedDay(dt);
        setSelectedTime(dt.toTimeString().slice(0, 5));
      } catch (e) {
        console.error(e);
        alert("No se cargó la cita.");
        router.push("/ViewAppointments");
      } finally {
        setLoading(false);
      }
    })();
  }, [citaId, router]);

  // 2) Generar próximos 14 días sin fines de semana
  const availableDays = React.useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
    }
    return days;
  }, []);

  // 3) Cargar horarios al seleccionar día
  useEffect(() => {
    if (!cita || !selectedDay) return;
    (async () => {
      try {
        const token = getToken();
        if (!token) throw new Error();
        const fecha = selectedDay.toISOString().slice(0, 10);
        const ocupados: string[] = await get(
          `/api/citas/disponibilidad/${cita.profesionalId}?fecha=${fecha}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Excluir el horario actual:
        const ocupadosFiltrados = ocupados.filter(
          (h) => h !== cita.fechaHora.slice(11, 16)
        );
        const hrs: string[] = [];
        for (let h = 8; h <= 17; h++) {
          const s = h.toString().padStart(2, "0") + ":00";
          if (!ocupadosFiltrados.includes(s)) hrs.push(s);
        }
        setHorarios(hrs);
        if (!hrs.includes(selectedTime)) setSelectedTime("");
      } catch {
        setHorarios([]);
      }
    })();
  }, [cita, selectedDay, selectedTime]);

  // 4) Enviar PUT al confirmar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime || !citaId) {
      alert("Seleccione fecha y hora válidas.");
      return;
    }
    try {
      const token = getToken();
      if (!token) throw new Error();
      const fechaHora = `${selectedDay
        .toISOString()
        .slice(0, 10)}T${selectedTime}:00`;
      await put(
        `/api/citas/${citaId}`,
        { fechaHora },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cita modificada con éxito.");
      router.push("/ViewAppointments");
    } catch (err) {
      console.error(err);
      alert("Error al modificar la cita.");
    }
  };

  if (loading) return <p className={styles.main}>Cargando…</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Sidebar igual que el componente Scheduling */}
        <button
          className={`${styles.menuButton} ${styles.logoutButton}`}
          onClick={() => {
            removeToken();
            router.push("/");
          }}
        >
          <LogOut size={24} className={styles.icon} />
          Cerrar sesión
        </button>
      </aside>

      <main className={styles.main}>
        <h2 className={styles.title}>
          <CalendarClock size={28} /> Modificar Fecha y Hora
        </h2>
        <p className={styles.subtitle}>
          Profesional: {cita.profesionalNombre} — Sede: {cita.sedeNombre}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nueva Fecha:
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ available: availableDays }}
              modifiersClassNames={{
                available: styles.availableDay,
                selected: styles.selectedDay,
              }}
            />
          </label>

          <label className={styles.label}>
            Nuevo Horario:
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className={styles.input}
              required
            >
              <option value="">Seleccione</option>
              {horarios.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className={styles.submitButton}>
            Guardar Cambios
          </button>
        </form>
      </main>
    </div>
  );
}
