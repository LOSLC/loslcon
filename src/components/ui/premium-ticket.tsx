import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { CheckIcon, StarIcon } from "lucide-react";
import { T } from "@/components/i18n/t";

interface PremiumTicketProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  type?: string;
  price: number;
  currency?: string;
  perks: string[];
  primary?: string;
  secondary?: string;
  href?: string;
  popular?: boolean;
  isPremium?: boolean;
  disabled?: boolean;
  disabledText?: string;
}

function PremiumTicket({
  className,
  name,
  description,
  type,
  price,
  currency = "XOF",
  perks,
  primary = "#7c3aed",
  secondary = "#06b6d4",
  href,
  popular = false,
  isPremium = false,
  disabled = false,
  disabledText = "Sold out",
  ...props
}: PremiumTicketProps) {
  const formatPrice = (price: number) => {
    if (price === 0) {
      return "Gratuit";
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 group",
        !disabled && "hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-background to-background/95",
        "border-2 border-border/50",
        !disabled && "hover:border-border",
        "mt-6 h-full flex flex-col", // Add top margin to accommodate the badge and ensure equal height
        popular && "ring-2 ring-emerald-500/30 border-emerald-500/50",
        isPremium && "ring-2 ring-amber-500/30 border-amber-500/50",
        disabled && "opacity-70 grayscale",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${primary}08 0%, ${secondary}08 100%)`,
      }}
      {...props}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      />
      
      {/* Popular/Premium/Soldout badge */}
      {(popular || isPremium || disabled) && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge
            variant="default"
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold shadow-lg whitespace-nowrap",
              popular && "bg-gradient-to-r from-emerald-500 to-teal-500",
              isPremium && "bg-gradient-to-r from-amber-500 to-orange-500",
              disabled && "bg-gradient-to-r from-zinc-500 to-neutral-500"
            )}
          >
            {disabled ? <T k="tickets.badges.soldout" /> : popular ? "Populaire" : "Premium"}
            {!disabled && isPremium && <StarIcon className="w-3 h-3 ml-1" />}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center space-y-4 pb-4">
        {type && (
          <Badge variant="outline" className="w-fit mx-auto text-xs font-medium">
            {type}
          </Badge>
        )}
        
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </CardDescription>
        </div>

        <div className="space-y-1">
          <div 
            className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
            }}
          >
            {formatPrice(price)}
          </div>
          {price > 0 && (
            <div className="text-sm text-muted-foreground">{currency}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 flex-grow">
        {perks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground/90">
              Ce qui est inclus :
            </h4>
            <ul className="space-y-2">
              {perks.map((perk, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <CheckIcon 
                    className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" 
                    strokeWidth={2.5}
                  />
                  <span className="text-muted-foreground leading-relaxed">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-6 px-6 pb-6 flex-col mt-auto relative z-10">
        {href && !disabled ? (
          <a
            href={href}
            className={cn(
              "inline-flex items-center justify-center w-full h-12 font-semibold text-white shadow-lg transition-all duration-300",
              "hover:shadow-xl hover:-translate-y-0.5 rounded-md relative z-10",
              "focus:ring-4 focus:ring-opacity-50 focus:outline-none",
              "text-center no-underline"
            )}
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
              boxShadow: `0 4px 12px ${primary}30`,
            }}
          >
            {price === 0 ? "Obtenir gratuitement" : "Acheter maintenant"}
          </a>
        ) : (
          <Button
            disabled={disabled}
            className={cn(
              "w-full h-12 font-semibold text-white shadow-lg transition-all duration-300",
              !disabled && "hover:shadow-xl hover:-translate-y-0.5",
              "focus:ring-4 focus:ring-opacity-50"
            )}
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
              boxShadow: `0 4px 12px ${primary}30`,
            }}
          >
            {disabled ? disabledText : price === 0 ? "Obtenir gratuitement" : "Acheter maintenant"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { PremiumTicket };
export default PremiumTicket;
