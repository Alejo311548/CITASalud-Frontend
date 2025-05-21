"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./scheduling.module.css";
import {
  CalendarPlus,
  CalendarX,
  CalendarClock,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { getToken, removeToken } from "@/utils/auth";



const Home = () => {
  const router = useRouter();

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
          <button className={styles.menuButton} onClick={() => router.push("/scheduling")}>
            <CalendarPlus size={24} className={styles.icon} />
            Agendar Cita
          </button>
          <button className={styles.menuButton} onClick={() => router.push("/CancelAppointment")}>
            <CalendarX size={24} className={styles.icon} />
            Cancelar Cita
          </button>
          <button className={styles.menuButton} onClick={() => router.push("/ModifyAppointment")}>
            <CalendarClock size={24} className={styles.icon} />
            Modificar Cita
          </button>
          <button className={styles.menuButton} onClick={() => router.push("/ViewAppointments")}>
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
            Bienvenido a <span className={styles.brand}>CITASalud</span>{" "}
           
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.title}>Inicio</h2>

            <div className={styles.logoHome}>
              <Image
                src="/logo.png"
                alt="Logo CITASalud"
                width={100}
                height={100}
                priority
              />
            </div>
          </div>

          <p className={styles.subtitle}>
            Aquí podrá gestionar sus citas médicas de manera fácil y rápida.
          </p>

          <section className={styles.dataPolicySection}>
            <h3 className={styles.policyTitle}>
              Política de Tratamiento de Datos Personales
            </h3>
            <p className={styles.policyText}>
              Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013,{" "}
              <strong>CITASalud</strong> garantiza la protección de sus datos
              personales. Sus datos serán tratados de manera confidencial y
              utilizados exclusivamente para la gestión de citas médicas y
              servicios relacionados. Usted tiene derecho a acceder, actualizar y
              solicitar la supresión de su información personal en cualquier
              momento.
            </p>
            <p className={styles.policyText}>
              Para más información, consulte nuestra{" "}
              <a
                href="/politica-de-datos"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.policyLink}
              >
                política de privacidad
              </a>
              .
            </p>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Home;
