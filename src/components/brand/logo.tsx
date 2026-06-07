import { cn } from "@/lib/utils";

type LogoProps = React.SVGProps<SVGSVGElement> & {
  showRedDot?: boolean;
};

export function Logo({
  className,
  showRedDot = true,
  ...props
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      <circle
        cx="31"
        cy="29"
        r="17"
        stroke="currentColor"
        strokeWidth="3.2"
      />
      <path
        d="M43.5 40.5L53 50"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M27.5 17.5C25 16.5 22 17.5 21 20.5C20 23 18.5 25.5 18 28C17.5 30.5 18 33 19.5 35C21 37 23 38.5 25 39"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="42"
        y1="24"
        x2="47.5"
        y2="19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="42.5"
        y1="25"
        x2="48.5"
        y2="25.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="26.5"
        x2="47"
        y2="31.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="40.5"
        y1="27.5"
        x2="41.5"
        y2="33.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="48" cy="19.5" r="2" fill="currentColor" />
      <circle cx="49" cy="25.5" r="2" fill="currentColor" />
      <circle cx="47.5" cy="31.5" r="2" fill="currentColor" />
      <circle cx="42" cy="33.5" r="2" fill="currentColor" />
      <circle cx="38.5" cy="25" r="3.5" fill="url(#logo-node-glow)" />
      {showRedDot ? (
        <circle cx="15.5" cy="40.5" r="1.8" className="fill-destructive" />
      ) : null}
      <defs>
        <radialGradient
          id="logo-node-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(38.5 25) scale(3.5)"
        >
          <stop stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type LogoWordmarkProps = {
  className?: string;
  logoClassName?: string;
  showRedDot?: boolean;
};

export function LogoWordmark({
  className,
  logoClassName,
  showRedDot = true,
}: LogoWordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo
        aria-hidden
        className={cn("size-8 text-brand", logoClassName)}
        showRedDot={showRedDot}
      />
      <span className="font-heading text-base font-bold tracking-tight">
        Human Context
      </span>
    </span>
  );
}
