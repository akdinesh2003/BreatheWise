import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21a9 9 0 1 0-9-9" />
      <path d="M12 21a9 9 0 0 0 9-9" />
      <path d="M12 3a9 9 0 0 0-9 9" />
      <path d="M12 3a9 9 0 0 1 9 9" />
      <path d="M12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  );
}
