import type { ReactNode, SVGProps } from "react";

function Svg(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    />
  );
}

export function SortAscIcon(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <Svg {...props}>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </Svg>
  );
}

export function SortDescIcon(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <Svg {...props}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </Svg>
  );
}

export function SortDefaultIcon(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <Svg style={{ opacity: 0.3, ...props.style }} {...props}>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </Svg>
  );
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <Svg {...props}>
      <path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}
