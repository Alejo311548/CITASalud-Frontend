import { Header } from "../molecules/Header";
import { MainSection } from "../organisms/MainSection";
import { Footer } from "../molecules/Footer";

export const HomePage = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <MainSection />
    <Footer />
  </div>
);
