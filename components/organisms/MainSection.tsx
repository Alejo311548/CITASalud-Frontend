import { AtomImage } from "../atoms/Image";
import { Button } from "../atoms/Button";

export const MainSection: React.FC = () => (
  <div className="relative">
    <AtomImage
      src="/doctor-family.png"
      alt="Doctor y Familia"
      className="w-full h-auto"
      width={1200}
      height={600}
    />
    
  </div>
);
