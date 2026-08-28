import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
  type Country,
  type Labels,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { normalizeE164PhoneNumber } from "../../utils/phoneNumber";
import "react-phone-number-input/style.css";
import "./InternationalPhoneInput.css";

type CountryOption = {
  value?: Country;
  label: string;
  divider?: boolean;
};

type CountryIconProps = {
  country?: Country;
  label: string;
};

type CountrySelectProps = {
  name?: string;
  value?: Country;
  options: CountryOption[];
  onChange: (country?: Country) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  iconComponent: ComponentType<CountryIconProps>;
};

type PopoverPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  placement: "top" | "bottom";
};

const countryDisplayNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["id-ID", "id"], { type: "region" })
    : null;

const countryLabels = getCountries().reduce<Labels>(
  (labels, country) => {
    labels[country] = countryDisplayNames?.of(country) ?? country;
    return labels;
  },
  {
    country: "Pilih negara",
    phone: "Nomor telepon",
    ZZ: "Internasional",
    ext: "Ekstensi",
  },
);

type CountryAwareNumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  "data-phone-country"?: Country;
};

const CountryAwareNumberInput = forwardRef<
  HTMLInputElement,
  CountryAwareNumberInputProps
>(({ value, onBlur, onKeyDown, ...props }, ref) => {
  const [localPrefixCommitted, setLocalPrefixCommitted] = useState(() => Boolean(value));
  const selectedCountry = props["data-phone-country"];

  const visibleValue =
    typeof value === "string" &&
    selectedCountry === "ID" &&
    localPrefixCommitted
      ? value.replace(/^0+/, "")
      : value;

  return (
    <input
      {...props}
      ref={ref}
      value={visibleValue}
      onChange={(event) => {
        if (!event.currentTarget.value) setLocalPrefixCommitted(false);
        props.onChange?.(event);
      }}
      onBlur={(event) => {
        setLocalPrefixCommitted(true);
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") setLocalPrefixCommitted(true);
        onKeyDown?.(event);
      }}
    />
  );
});

CountryAwareNumberInput.displayName = "CountryAwareNumberInput";

const CountrySelect = ({
  value,
  options,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  tabIndex,
  iconComponent: CountryIcon,
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const selectableOptions = useMemo(
    () => options.filter((option) => option.value && !option.divider),
    [options],
  );
  const selectedOption =
    selectableOptions.find((option) => option.value === value) ??
    selectableOptions.find((option) => option.value === "ID") ??
    selectableOptions[0];

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const field = trigger.closest(".international-phone-input") as HTMLElement | null;
    const rect = (field ?? trigger).getBoundingClientRect();
    const viewportGap = 12;
    const availableBelow = window.innerHeight - rect.bottom - viewportGap;
    const availableAbove = rect.top - viewportGap;
    const openAbove = availableBelow < 280 && availableAbove > availableBelow;
    const availableHeight = openAbove ? availableAbove : availableBelow;
    const maxHeight = Math.min(410, Math.max(180, availableHeight - 6));
    const width = Math.max(
      330,
      Math.min(rect.width, window.innerWidth - viewportGap * 2),
    );
    const safeWidth = Math.min(width, window.innerWidth - viewportGap * 2);
    const left = Math.min(
      Math.max(viewportGap, rect.left),
      Math.max(viewportGap, window.innerWidth - safeWidth - viewportGap),
    );

    setPosition({
      left,
      top: openAbove
        ? Math.max(viewportGap, rect.top - maxHeight - 6)
        : rect.bottom + 6,
      width: safeWidth,
      maxHeight,
      placement: openAbove ? "top" : "bottom",
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    onBlur?.();
  }, [onBlur]);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open, updatePosition]);

  const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
  const visibleOptions = selectableOptions.filter((option) => {
    if (!normalizedQuery || !option.value) return true;
    const callingCode = getCountryCallingCode(option.value);
    return (
      option.label.toLocaleLowerCase("id-ID").includes(normalizedQuery) ||
      option.value.toLocaleLowerCase("id-ID").includes(normalizedQuery) ||
      `+${callingCode}`.includes(normalizedQuery.replace(/\s/g, ""))
    );
  });

  const popover =
    open && position
      ? createPortal(
          <div className="international-phone-input__portal">
            <div
              className={`international-phone-input__popover${position.placement === "top" ? " is-top" : ""}`}
              ref={popoverRef}
              role="dialog"
              aria-label="Pilih negara dan kode telepon"
              style={
                {
                  left: position.left,
                  top: position.top,
                  width: position.width,
                  maxHeight: position.maxHeight,
                } as CSSProperties
              }
            >
              <div className="international-phone-input__popover-header">
                <div>
                  <strong>Pilih negara</strong>
                  <span>Kode telepon akan terisi otomatis</span>
                </div>
                <button
                  className="international-phone-input__close"
                  type="button"
                  aria-label="Tutup pilihan negara"
                  onClick={() => {
                    close();
                    window.requestAnimationFrame(() => triggerRef.current?.focus());
                  }}
                >
                  <X aria-hidden="true" size={17} strokeWidth={1.8} />
                </button>
              </div>

              <div className="international-phone-input__search-wrap">
                <input
                  className="international-phone-input__search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari negara atau kode, contoh +62"
                  aria-label="Cari negara atau kode telepon"
                />
              </div>

              {visibleOptions.length > 0 ? (
                <ul className="international-phone-input__options" role="listbox">
                  {visibleOptions.map((option) => {
                    const country = option.value as Country;
                    const selected = country === value;
                    return (
                      <li key={country} role="presentation">
                        <button
                          className={`international-phone-input__option${selected ? " is-selected" : ""}`}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            onChange(country);
                            close();
                            window.requestAnimationFrame(() => triggerRef.current?.focus());
                          }}
                        >
                          <span className="international-phone-input__option-flag">
                            <CountryIcon country={country} label={option.label} />
                          </span>
                          <span className="international-phone-input__option-name">
                            {option.label}
                          </span>
                          <span className="international-phone-input__option-code">
                            +{getCountryCallingCode(country)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="international-phone-input__empty">
                  Negara atau kode telepon tidak ditemukan.
                </p>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="international-phone-input__country">
      <button
        className="international-phone-input__country-trigger"
        ref={triggerRef}
        type="button"
        disabled={disabled || readOnly}
        tabIndex={tabIndex}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Negara: ${selectedOption?.label ?? "Indonesia"}. Ubah negara dan kode telepon.`}
        onClick={() => {
          if (disabled || readOnly) return;
          if (open) {
            close();
            return;
          }

          updatePosition();
          onFocus?.();
          setOpen(true);
        }}
      >
        {selectedOption?.value ? (
          <span className="international-phone-input__country-flag">
            <CountryIcon
              country={selectedOption.value}
              label={selectedOption.label}
            />
          </span>
        ) : null}
        <span className="international-phone-input__country-code">
          +{getCountryCallingCode(selectedOption?.value ?? "ID")}
        </span>
        <span className="international-phone-input__country-chevron" aria-hidden="true" />
      </button>
      {popover}
    </div>
  );
};

export type InternationalPhoneInputProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  ariaLabel?: string;
}>;

const InternationalPhoneInput = ({
  value,
  onChange,
  id,
  name,
  className = "",
  placeholder = "812 3456 7890",
  autoComplete = "tel",
  required = false,
  disabled = false,
  invalid = false,
  describedBy,
  ariaLabel,
}: InternationalPhoneInputProps) => {
  const normalizedValue = normalizeE164PhoneNumber(value);
  const [selectedCountry, setSelectedCountry] = useState<Country>("ID");

  return (
    <>
      <PhoneInput
        id={id}
        className={`international-phone-input ${className}${invalid ? " is-invalid" : ""}`.trim()}
        value={normalizedValue}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        defaultCountry="ID"
        addInternationalOption={false}
        international={false}
        smartCaret={false}
        limitMaxLength
        flags={flags}
        labels={countryLabels}
        locales={["id-ID", "id"]}
        countryOptionsOrder={["ID", "|", "..."]}
        countrySelectComponent={CountrySelect}
        inputComponent={CountryAwareNumberInput}
        numberInputProps={{ "data-phone-country": selectedCountry }}
        onCountryChange={(country) => setSelectedCountry(country ?? "ID")}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        data-error={invalid}
      />
      {name ? <input type="hidden" name={name} value={normalizedValue} /> : null}
    </>
  );
};

export default InternationalPhoneInput;
