import { AtomImage } from "../atoms/Image";
import { Text } from "../atoms/Text";
import styles from "./Header.module.css";

export const Header: React.FC = () => (
  <header className={styles.header}>
    <Text variant="title" className={styles.title}>
      Bienvenidos a nuestro portal web
    </Text>
    <div className={styles.brand}>
      <AtomImage src="/logo.png" alt="Logo CitaSalud" width={100} height={50} />
      
    </div>
  </header>
);
