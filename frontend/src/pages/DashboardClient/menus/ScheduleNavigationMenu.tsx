import { ChevronLeft, ChevronRight } from "lucide-react";

type ScheduleNavigationMenuProps = {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

const SCHEDULE_NAVIGATION_STYLES = `
  .client-dashboard__schedule-nav {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 9px;
  }

  .client-dashboard__schedule-nav button {
    display: grid;
    width: 38px;
    height: 38px;
    padding: 0;
    place-items: center;
    border: 1px solid #2b2925;
    border-radius: 50%;
    background: #090909;
    color: #aaa49b;
    cursor: pointer;
    transition: color 220ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }

  .client-dashboard__schedule-nav button:hover:not(:disabled) {
    border-color: rgba(232, 199, 121, .56);
    background: rgba(217, 183, 101, .08);
    color: #e8c779;
    box-shadow: 0 0 19px rgba(217, 183, 101, .14);
    transform: translateY(-2px);
  }

  .client-dashboard__schedule-nav button:disabled {
    opacity: .38;
    cursor: not-allowed;
  }

  .client-dashboard__schedule-nav svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.8;
  }

  @media (prefers-reduced-motion: reduce) {
    .client-dashboard__schedule-nav button {
      transition: none;
    }
  }
`;

const ScheduleNavigationMenu = ({
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
}: ScheduleNavigationMenuProps) => (
  <>
    <style>{SCHEDULE_NAVIGATION_STYLES}</style>
    <div className="client-dashboard__schedule-nav" aria-label="Navigasi jadwal">
      <button type="button" aria-label="Jadwal sebelumnya" onClick={onPrevious} disabled={previousDisabled}><ChevronLeft /></button>
      <button type="button" aria-label="Jadwal berikutnya" onClick={onNext} disabled={nextDisabled}><ChevronRight /></button>
    </div>
  </>
);

export default ScheduleNavigationMenu;
