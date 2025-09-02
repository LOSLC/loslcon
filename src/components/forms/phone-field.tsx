"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDownIcon, CheckIcon, GlobeIcon } from "lucide-react";
import { COUNTRY_LIST } from "./country-list";
import phone from "phone";
import { ensureI18n } from "@/i18n/config";

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
  const [open, setOpen] = useState(false);

  const countries = useMemo(() => COUNTRY_LIST, []);
  const selectedCountry = useMemo(
    () => countries.find((c) => c.iso2 === iso2),
    [countries, iso2],
  );
  const i18n = ensureI18n();

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
    <div className={className + " grid grid-cols-[1fr] gap-2 sm:grid-cols-[14rem,1fr]"}>
      {/* Country combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={i18n.t("country.select")}
            className="h-9 justify-between w-full"
          >
            <span className="inline-flex items-center gap-2 truncate">
              {selectedCountry ? (
                <>
                  <GlobeIcon className="size-4 opacity-60" />
                  <span className="truncate">
                    {selectedCountry.name} ({selectedCountry.iso2})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground" data-i18n="country.select">Select country</span>
              )}
            </span>
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={i18n.t("country.searchPlaceholder")} />
            <CommandList>
              <CommandEmpty>
                <span data-i18n="country.noResults">No results found.</span>
              </CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.iso2}
                    value={`${c.iso2} ${c.name}`}
                    onSelect={() => {
                      setIso2(c.iso2);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={
                        "mr-2 size-4 " + (iso2 === c.iso2 ? "opacity-100" : "opacity-0")
                      }
                    />
                    <span className="truncate">{c.name}</span>
                    <span className="ml-2 text-muted-foreground">({c.iso2})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
