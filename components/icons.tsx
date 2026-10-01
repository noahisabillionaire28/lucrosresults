import type { SVGProps } from "react";

const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
type P = SVGProps<SVGSVGElement>;

export const PinIcon = (p: P) => (<svg {...base} {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const ShieldIcon = (p: P) => (<svg {...base} {...p}><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>);
export const BoltIcon = (p: P) => (<svg {...base} {...p}><path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" /></svg>);
export const EyeIcon = (p: P) => (<svg {...base} {...p}><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const ChartIcon = (p: P) => (<svg {...base} {...p}><path d="M3 20h18" /><path d="m4 15 5-5 4 3 7-8" /><path d="M15 5h5v5" /></svg>);
export const KeyIcon = (p: P) => (<svg {...base} {...p}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9" /><path d="m16 7 3 3" /></svg>);
export const UsersIcon = (p: P) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.8c1.9.7 3.1 2.4 3.5 5.2" /></svg>);
export const GiftIcon = (p: P) => (<svg {...base} {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8c-2.5 0-4-1-4-2.5S9.5 3 12 8Zm0 0c2.5 0 4-1 4-2.5S14.5 3 12 8Z" /></svg>);
export const icons = { eye: EyeIcon, chart: ChartIcon, key: KeyIcon } as const;
