const labels = ["Verifikasi", "Nomor Baru", "Selesai"] as const;

const PhoneChangeStepper = ({ step }: Readonly<{ step: 1 | 2 | 3 }>) => (
  <ol className="phone-stepper" aria-label="Tahap perubahan nomor telepon">
    {labels.map((label, index) => {
      const number = index + 1;
      const active = number === step;
      return (
        <li className={active ? "is-active" : number < step ? "is-complete" : ""} key={label}>
          <span>{number}</span>
          <strong>{label}</strong>
        </li>
      );
    })}
  </ol>
);

export default PhoneChangeStepper;
