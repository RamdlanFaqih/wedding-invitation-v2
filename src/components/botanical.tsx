import { useId } from "react";

/** Original vector ornament: no remote images or image requests. */
export function Botanical({ className = "", variant = "branch" }: { className?: string; variant?: "branch" | "bloom" }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={className} viewBox="0 0 260 420" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="240" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8a9471" /><stop offset="1" stopColor="#3f5036" />
        </linearGradient>
      </defs>
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
        <path d="M76 408C95 333 122 250 135 174C143 125 151 80 180 22" />
        <path d="M106 308C73 260 43 224 25 170M125 232C163 204 204 164 226 117M141 143C108 110 92 75 90 31M87 370C135 342 183 316 215 266" />
      </g>
      <g fill={`url(#${id})`} fillOpacity=".72" stroke="currentColor" strokeWidth=".5">
        <path d="M130 211C92 197 83 170 85 148C113 154 130 174 130 211Z" />
        <path d="M139 165C164 139 182 131 203 133C193 156 174 174 139 165Z" />
        <path d="M148 123C127 100 127 77 134 57C153 79 156 99 148 123Z" />
        <path d="M163 70C164 39 180 14 201 5C201 31 187 56 163 70Z" />
        <path d="M119 262C150 237 174 238 194 248C170 267 143 274 119 262Z" />
        <path d="M103 318C65 308 48 282 46 260C73 266 95 286 103 318Z" />
        <path d="M87 366C56 350 44 327 45 304C71 317 85 337 87 366Z" />
        <path d="M69 243C42 239 24 219 19 197C44 202 62 218 69 243Z" />
        <path d="M50 211C61 184 55 165 41 152C32 173 33 194 50 211Z" />
        <path d="M25 175C5 160 2 142 6 124C23 137 30 154 25 175Z" />
        <path d="M109 105C88 100 70 82 65 61C90 66 104 81 109 105Z" />
        <path d="M93 67C105 48 106 27 98 11C84 29 82 48 93 67Z" />
        <path d="M173 184C173 162 182 149 196 145C199 163 189 177 173 184Z" />
        <path d="M204 148C217 151 240 143 251 127C230 122 211 129 204 148Z" />
        <path d="M224 120C213 103 215 83 226 69C237 89 235 106 224 120Z" />
        <path d="M126 348C137 319 156 308 180 309C169 333 150 345 126 348Z" />
        <path d="M169 319C190 329 212 324 228 311C208 298 186 302 169 319Z" />
        <path d="M194 291C193 269 207 247 224 239C227 263 214 282 194 291Z" />
      </g>
      {variant === "bloom" && <g transform="translate(115 196)" fill="#f4f0e4" stroke="#a89d7f" strokeWidth=".7">
        {[0, 60, 120, 180, 240, 300].map((rotation) => <ellipse key={rotation} cx="0" cy="-20" rx="13" ry="25" transform={`rotate(${rotation})`} />)}
        <circle r="9" fill="#b39d63" /><circle r="4" fill="#796d45" />
      </g>}
    </svg>
  );
}

export function LittleFlower({ className = "" }: { className?: string }) {
  return <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1">{[0, 45, 90, 135].map((r) => <ellipse key={r} cx="20" cy="20" rx="5" ry="16" transform={`rotate(${r} 20 20)`} />)}<circle cx="20" cy="20" r="3" fill="currentColor" /></g></svg>;
}
