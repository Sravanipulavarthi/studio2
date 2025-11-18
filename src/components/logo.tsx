import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6 text-primary", className)}
    >
      <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 7-7h1" />
      <path d="M15 12h6" />
      <path d="M18 9v6" />
      <path d="M12 18a7 7 0 0 0 7-7" />
    </svg>
  );
}
