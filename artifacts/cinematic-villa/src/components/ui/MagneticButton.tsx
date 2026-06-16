

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type MagneticButtonProps = {
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
};

export function MagneticButton({ children, variant = "solid", href, onClick, type = "button", className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  useMagnetic(ref, 0.2);

  const classes = `group relative inline-flex h-12 min-w-44 items-center justify-center gap-2 overflow-hidden rounded-full border px-6 text-sm uppercase tracking-[0.22em] transition duration-500 ${
    variant === "solid"
      ? "border-gold-300 bg-gold-300 text-black shadow-gold"
      : "border-white/25 bg-white/5 text-white backdrop-blur-xl hover:border-gold-300/70"
  } ${className}`;

  const content = (
    <>
      <span className="absolute inset-0 -translate-x-full bg-white/25 blur-xl transition duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <ArrowUpRight className="relative h-4 w-4 transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </>
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
