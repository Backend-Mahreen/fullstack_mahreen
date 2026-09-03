import CTA from "../../components/CTA/CTA";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Ekosistem from "./sections/Ekosistem";
import LayananProfesional from "./sections/LayananProfesional";
import LearningSection from "./sections/LearningSection";
import Partnership from "./sections/Partnership";
import Purpose from "./sections/Purpose";

const HomeSections = () => (
  <>
    <Partnership />
    <Purpose />
    <Ekosistem />
    <LayananProfesional />
    <LearningSection />
    <CTA />
    <ClosingSection />
  </>
);

export default HomeSections;
