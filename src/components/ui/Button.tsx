import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  external?: boolean;
}

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 will-change-transform";
  const sizes = { md: "px-5 py-2.5 text-sm", lg: "px-6 py-3.5 text-[15px]" };
  const variants = {
    primary:
      "bg-accent text-[#161006] hover:bg-accent-strong hover:-translate-y-0.5 shadow-[0_0_0_1px_rgba(214,161,92,0.4)]",
    secondary:
      "border border-border text-text-primary hover:border-accent/50 hover:-translate-y-0.5 bg-bg-elevated/50",
    ghost: "text-text-secondary hover:text-text-primary",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  if (external || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("/rudra")) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
