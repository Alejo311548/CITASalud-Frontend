import styles from './Footer.module.css';
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.left}>
      <Text className={styles.footerText}>
        Bienestar y calidez en cada visita.
      </Text>
    </div>
    <div className={styles.right}>
      {/* Pasamos las clases CSS que definiremos abajo */}
      <Button text="Log in" className={styles.buttonPrimary} />
      <Button text="Registrarse" className={styles.buttonPrimary} />
    </div>
  </footer>
);
