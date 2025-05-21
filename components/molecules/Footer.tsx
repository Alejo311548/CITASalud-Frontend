"use client";

import styles from './Footer.module.css';
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import { useRouter } from "next/navigation";

export const Footer: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <Text className={styles.footerText}>
          Bienestar y calidez en cada visita.
        </Text>
      </div>
      <div className={styles.right}>
        <Button text="Log in" className={styles.buttonPrimary} onClick={handleLogin} />
        <Button text="Registrarse" className={styles.buttonPrimary} onClick={handleRegister} />
      </div>
    </footer>
  );
};
