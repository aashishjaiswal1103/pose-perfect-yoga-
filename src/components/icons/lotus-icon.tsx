import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function LotusIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8.5 18.5c.3-1 .5-2.2.5-3.5C9 12.2 7.8 10 5 10c-2 0-3 1-3 3 0 1.5 1.2 3 3 3" />
      <path d="M15.5 18.5c-.3-1-.5-2.2-.5-3.5C15 12.2 16.2 10 19 10c2 0 3 1 3 3 0 1.5-1.2 3-3 3" />
      <path d="M12 16.5c0-1.5.8-3 2.5-3 .8 0 1.5.3 2 .8" />
      <path d="M12 16.5c0-1.5-.8-3-2.5-3-.8 0-1.5.3-2 .8" />
      <path d="M12 15a2.5 2.5 0 0 0-2.5-2.5c-1 0-2 .5-2.5 1.5" />
      <path d="M12 15a2.5 2.5 0 0 1 2.5-2.5c1 0 2 .5 2.5 1.5" />
      <path d="M12 12c0-2.5-2-4-2-4-1.5 1-2 2.5-2 4" />
      <path d="M12 12c0-2.5 2-4 2-4 1.5 1 2 2.5 2 4" />
      <path d="M12 10c0-1 .5-2 1.5-2.5" />
      <path d="M12 10c0-1-.5-2-1.5-2.5" />
    </svg>
  );
}
