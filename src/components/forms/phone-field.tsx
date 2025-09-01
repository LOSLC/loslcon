"use client";
import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { COUNTRY_LIST } from "./country-list";
import phone from "phone";

type Props = {
  id?: string;
  placeholder?: string;
  required?: boolean;
  // Names for submitted fields
  namePhone?: string; // national number without country code (defaults to "phone_number")
  nameCountryIso?: string; // ISO2 like TG, BJ (defaults to "country")
  nameCountryCode?: string; // Dial code like 228 (defaults to "dial_code")
  nameCountryIsoForServer?: string; // ISO2 sent for server action (defaults to "country_code")
  defaultValue?: string;
  className?: string;
};

export function PhoneField({
  id,
  placeholder = "90 00 00 00",
  required,
  namePhone = "phone_number",
  nameCountryIso = "country",
  nameCountryCode = "dial_code",
  nameCountryIsoForServer = "country_code",
  defaultValue = "",
  className,
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [iso2, setIso2] = useState<string>("");
  const [dial, setDial] = useState<string>("");
  const [national, setNational] = useState<string>(defaultValue);

  // Best-effort: initialize ISO2 from defaultValue if it contains a valid phone
  useEffect(() => {
    if (!defaultValue) {
      // Default to Togo (TG) if not prefilled; adjust if your audience differs
      setIso2((prev) => prev || "TG");
      return;
    }
    try {
      const res = phone(defaultValue) as unknown as { isValid?: boolean; countryIso2?: string; countryCode?: string };
      if (res?.isValid) {
        setIso2(String(res.countryIso2 || ""));
        const countryCode = String(res.countryCode || "");
        setDial(countryCode);
      }
    } catch {}
  }, [defaultValue]);

  // Keep dial code in sync from selection and national number
  useEffect(() => {
    if (!iso2) {
      setDial("");
      return;
    }
    try {
      const res = phone(national || "0", { country: iso2 }) as unknown as { isValid?: boolean; countryCode?: string };
      if (res && (res.isValid || res.countryCode)) {
        setDial(String(res.countryCode || ""));
      } else {
        setDial("");
      }
    } catch {
      setDial("");
    }
  }, [iso2, national]);

  return (
    <div className={className + " grid grid-cols-[8rem,1fr] gap-2 md:grid-cols-[12rem,1fr]"}>
      <select
        aria-label="Country"
        className="rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={iso2}
        onChange={(e) => setIso2(e.target.value)}
        required={required}
      >
        <option value="" disabled>
          Select country
        </option>
        {COUNTRY_LIST.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.name} ({c.iso2})
          </option>
        ))}
      </select>
      <Input
        id={inputId}
        inputMode="tel"
        placeholder={placeholder}
        required={required}
        value={national}
        onChange={(e) => setNational(e.target.value)}
      />
      {/* hidden fields used on submit */}
      <input type="hidden" name={namePhone} value={national} />
      <input type="hidden" name={nameCountryIso} value={iso2} />
      <input type="hidden" name={nameCountryIsoForServer} value={iso2} />
      <input type="hidden" name={nameCountryCode} value={dial} />
    </div>
  );
}
