"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Login.module.css";
import { post } from "@/utils/api";
import { useRouter } from "next/navigation";

export const Login: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Guardar token según remember
      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      setError(null);
      setLoading(false);

      // Redirigir a Home tras login exitoso
      router.push("/Home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftPanel}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="Logo Citasalud"
              width={100}
              height={100}
              className={styles.logo}
            />
          </div>

          <h1 className={styles.title}>Bienvenidos</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className={styles.rememberMe}>
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Recordarme
              </label>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <div className={styles.rightPanel}>
          <Image
            src="/login.png"
            alt="login"
            width={400}
            height={400}
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
};
