"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./RegisterForm.module.css";
import { post } from "@/utils/api";

export const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({
    primerApellido: "",
    segundoApellido: "",
    nombres: "",
    numeroDocumento: "",
    tipoDocumento: "",
    telefono: "",
    fechaNacimiento: "",
    email: "",
    confirmarEmail: "",
    password: "",
    confirmarPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (
      !form.primerApellido.trim() ||
      !form.segundoApellido.trim() ||
      !form.nombres.trim() ||
      !form.numeroDocumento.trim() ||
      !form.tipoDocumento.trim() ||
      !form.telefono.trim() ||
      !form.email.trim() ||
      !form.confirmarEmail.trim() ||
      !form.password.trim() ||
      !form.confirmarPassword.trim()
    ) {
      setError("Por favor complete todos los campos obligatorios.");
      return false;
    }

    if (form.telefono.length < 10 || form.telefono.length > 15) {
      setError("El teléfono debe tener entre 10 y 15 caracteres.");
      return false;
    }

    if (form.email !== form.confirmarEmail) {
      setError("Los correos electrónicos no coinciden.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("El correo electrónico no tiene un formato válido.");
      return false;
    }

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const data = await post("/api/auth/register", {
        nombre: `${form.nombres} ${form.primerApellido} ${form.segundoApellido}`,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
      });

      setMensaje(data.message || "Registro exitoso.");
      setForm({
        primerApellido: "",
        segundoApellido: "",
        nombres: "",
        numeroDocumento: "",
        tipoDocumento: "",
        telefono: "",
        fechaNacimiento: "",
        email: "",
        confirmarEmail: "",
        password: "",
        confirmarPassword: "",
      });
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="Logo" width={65} height={65} />
        </div>

        <h2 className={styles.title}>Formulario de registro</h2>
        <p className={styles.subtitle}>Datos personales</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <input
              type="text"
              name="primerApellido"
              placeholder="Primer apellido (*)"
              value={form.primerApellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="segundoApellido"
              placeholder="Segundo apellido (*)"
              value={form.segundoApellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.row}>
            <input
              type="text"
              name="nombres"
              placeholder="Nombres (*)"
              value={form.nombres}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="numeroDocumento"
              placeholder="Número de documento (*)"
              value={form.numeroDocumento}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.row}>
            <input
              type="text"
              name="tipoDocumento"
              placeholder="Tipo de documento (*)"
              value={form.tipoDocumento}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono (*)"
              value={form.telefono}
              onChange={handleChange}
              required
              pattern="[0-9]{10,15}"
              title="El teléfono debe tener entre 10 y 15 dígitos numéricos"
            />
          </div>
          <div className={styles.row}>
            <input
              type="date"
              name="fechaNacimiento"
              placeholder="Fecha de nacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
            <input
              type="email"
              name="confirmarEmail"
              placeholder="Confirmar Email (*)"
              value={form.confirmarEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.row}>
            <input
              type="email"
              name="email"
              placeholder="Email (*)"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Confirmar Contraseña (*)"
              value={form.confirmarPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.singleRow}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña (*)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.backButton} disabled={loading}>
              ← Regresar
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Registrando..." : "Registrar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
