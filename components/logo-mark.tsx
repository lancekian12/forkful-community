/** Forkful mark: a fork carrying a bite. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="18" fill="var(--accent)" />
      <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M22 22v7M32 18v11M42 22v7" />
        <path d="M22 29c0 6 4.5 9.5 10 9.5s10-3.5 10-9.5" />
        <path d="M32 38.5v15" />
      </g>
      <circle cx="32" cy="14" r="6.5" fill="#f3b54a" />
    </svg>
  );
}
