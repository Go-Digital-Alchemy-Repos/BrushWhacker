import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  variant?: "default" | "tinted" | "gradient" | "pattern";
  className?: string;
  id?: string;
  "data-testid"?: string;
}

export function Section({ children, variant = "default", className, id, ...props }: SectionProps) {
  const variantClasses: Record<string, string> = {
    default: "",
    tinted: "bg-gradient-tinted",
    gradient: "bg-gradient-section",
    pattern: "bg-dot-pattern-light",
  };

  return (
    <section
      id={id}
      className={cn("py-16 sm:py-20 lg:py-24", variantClasses[variant], className)}
      data-testid={props["data-testid"]}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  "data-testid"?: string;
}

export function SectionHeaderPro({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeaderProProps) {
  const alignClasses = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={cn("mb-10 sm:mb-12", alignClasses, className)} data-testid={props["data-testid"]}>
      {eyebrow && (
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-muted-foreground leading-relaxed", align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface ImageFloatProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  "data-testid"?: string;
}

export function ImageFloat({ src, alt, className, aspectRatio = "4/3", ...props }: ImageFloatProps) {
  return (
    <div
      className={cn("image-float overflow-hidden", className)}
      style={{ aspectRatio }}
      data-testid={props["data-testid"]}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

interface TrustBadgeProps {
  items: { icon: ElementType; text: string }[];
  className?: string;
}

export function TrustRow({ items, className }: TrustBadgeProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4", className)}>
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
          <item.icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
