import type { ReactNode } from "react";
import PeduliMahreenNavbar from "../../../components/Navbar/Peduli-MahreenNavbar";
import ClosingSection from "../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../components/Footer/Footer";
import { donationFlowStyles } from "./donationFlowStyles";

type DonationLayoutProps = Readonly<{
  children: ReactNode;
}>;

const DonationLayout = ({ children }: DonationLayoutProps) => (
  <div className="donation-layout">
    <style data-component="peduli-donation-flow">{donationFlowStyles}</style>
    <PeduliMahreenNavbar />
    <main className="donation-main">{children}</main>
    <ClosingSection />
    <Footer />
  </div>
);

export default DonationLayout;
