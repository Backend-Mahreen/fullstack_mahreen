import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import { getCountries, type Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import "./InternationalPhoneInput.css";
import "./CountryPicker.css";

type CountryOption = Readonly<{
  code: Country;
  label: string;
  englishLabel: string;
}>;

type PopoverPosition = Readonly<{
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  placement: "top" | "bottom";
}>;

export type CountryPickerProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaLabelledBy?: string;
}>;

const localDisplayNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["id-ID", "id"], { type: "region" })
    : null;

const englishDisplayNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const countryOptions: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    label: localDisplayNames?.of(code) ?? code,
    englishLabel: englishDisplayNames?.of(code) ?? code,
  }))
  .sort((first, second) => {
    if (first.code === "ID") return -1;
    if (second.code === "ID") return 1;
    return first.label.localeCompare(second.label, "id-ID");
  });

const normalizeSearchText = (value: string) =>
  value.trim().toLocaleLowerCase("id-ID");

const CountryFlag = ({ country, label }: { country: Country; label: string }) => {
  const Flag = flags[country];

  return (
    <span className="country-picker__flag" aria-hidden="true">
      {Flag ? <Flag title={label} /> : <span>{country}</span>}
    </span>
  );
};

const CountryPicker = ({
  value,
  onChange,
  disabled = false,
  ariaLabelledBy,
}: CountryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = useMemo(() => {
    const normalizedValue = normalizeSearchText(value);

    return (
      countryOptions.find(
        (option) =>
          option.code.toLocaleLowerCase("id-ID") === normalizedValue ||
          normalizeSearchText(option.label) === normalizedValue ||
          normalizeSearchText(option.englishLabel) === normalizedValue,
      ) ?? countryOptions.find((option) => option.code === "ID")!
    );
  }, [value]);

  const visibleOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return countryOptions;

    return countryOptions.filter(
      (option) =>
        normalizeSearchText(option.label).includes(normalizedQuery) ||
        normalizeSearchText(option.englishLabel).includes(normalizedQuery) ||
        option.code.toLocaleLowerCase("id-ID").includes(normalizedQuery),
    );
  }, [query]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportGap = 12;
    const availableBelow = window.innerHeight - rect.bottom - viewportGap;
    const availableAbove = rect.top - viewportGap;
    const openAbove = availableBelow < 280 && availableAbove > availableBelow;
    const availableHeight = openAbove ? availableAbove : availableBelow;

    const width = Math.max(
      330,
      Math.min(rect.width, window.innerWidth - viewportGap * 2),
    );
    const safeWidth = Math.min(width, window.innerWidth - viewportGap * 2);
    const left = Math.min(
      Math.max(viewportGap, rect.left),
      Math.max(viewportGap, window.innerWidth - safeWidth - viewportGap),
    );
    const maxHeight = Math.min(410, Math.max(180, availableHeight - 6));

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
  }, []);

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

  const popover =
    open && position
      ? createPortal(
          <div className="international-phone-input__portal country-picker__portal">
            <div
              className={`international-phone-input__popover country-picker__popover${position.placement === "top" ? " is-top" : ""}`}
              ref={popoverRef}
              role="dialog"
              aria-label="Pilih negara tempat tinggal"
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
                  <span>Seluruh negara tersedia dan dapat dicari</span>
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
                  placeholder="Cari negara, contoh Jepang atau JP"
                  aria-label="Cari negara"
                />
              </div>

              {visibleOptions.length > 0 ? (
                <ul className="international-phone-input__options" role="listbox">
                  {visibleOptions.map((option) => {
                    const selected = option.code === selectedOption.code;

                    return (
                      <li key={option.code} role="presentation">
                        <button
                          className={`international-phone-input__option country-picker__option${selected ? " is-selected" : ""}`}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            onChange(option.label);
                            close();
                            window.requestAnimationFrame(() => triggerRef.current?.focus());
                          }}
                        >
                          <CountryFlag country={option.code} label={option.label} />
                          <span className="international-phone-input__option-name">
                            {option.label}
                          </span>
                          <span className="country-picker__option-meta">
                            <span>{option.code}</span>
                            {selected ? (
                              <Check aria-hidden="true" size={15} strokeWidth={2.2} />
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="international-phone-input__empty">
                  Negara tidak ditemukan. Coba gunakan nama atau kode negara.
                </p>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="country-picker">
      <button
        className="country-picker__trigger"
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          if (open) {
            close();
            return;
          }

          updatePosition();
          setOpen(true);
        }}
      >
        <CountryFlag country={selectedOption.code} label={selectedOption.label} />
        <span className="country-picker__value">{selectedOption.label}</span>
        <span className="country-picker__code">{selectedOption.code}</span>
        <span className="country-picker__chevron" aria-hidden="true" />
      </button>
      {popover}
    </div>
  );
};

export default CountryPicker;
