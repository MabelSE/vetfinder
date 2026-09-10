const PROPS = {
  width: 36,
  height: 36,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

function IconoResumen({ tipo }) {
  if (tipo === 'solicitudes') {
    return (
      <svg {...PROPS}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    );
  }

  if (tipo === 'reportes') {
    return (
      <svg {...PROPS}>
        <path d="M6 4v16" />
        <path d="M6 5h9.5a1.5 1.5 0 0 1 1.2 2.4L15 10l1.7 2.6A1.5 1.5 0 0 1 15.5 15H6" />
      </svg>
    );
  }

  if (tipo === 'veterinarias') {
    return (
      <svg {...PROPS}>
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (tipo === 'rechazadas') {
    return (
      <svg {...PROPS}>
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    );
  }

  return (
    <svg {...PROPS}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.4" />
      <path d="M4 19c.4-3.2 2.6-5 5-5s4.6 1.8 5 5" />
      <path d="M14.2 16.2c.8-1.4 2.2-2.2 3.8-2.2 1.8 0 3.2.8 3.8 2.4" />
    </svg>
  );
}

export default IconoResumen;
