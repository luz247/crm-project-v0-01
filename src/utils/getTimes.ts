
// 1) Partes de fecha/hora en zona Chile
export const getPartsCL = (d: Date = new Date()) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)!.value;

  return {
    y: get("year"),
    m: get("month"),
    d: get("day"),
    hh: get("hour"),
    mm: get("minute"),
    ss: get("second"),
  };
};

// 2) Fecha-hora local Chile "YYYY-MM-DDTHH:mm:ss"
export const getChileTime = (d: Date = new Date()) => {
  const { y, m, d: day, hh, mm, ss } = getPartsCL(d);
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
};

// 3) Solo fecha local Chile "YYYY-MM-DD"
export const getChileDate = (d?: Date | null) => {
  if (!d) return null;
  const { y, m, d: day } = getPartsCL(d);
  return `${y}-${m}-${day}`;
};

// 4) Parse del value de <input type="date"> a Date **local** (naive)
export const ymdFromDateInput = (value: string | null | undefined) => {
  if (!value) return null;
  const [y, m, d] = value.split("-").map((v) => parseInt(v, 10));
  // Crea Date en la zona local del navegador (no usa UTC)
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

// 5) Offset Chile (invierno -04, verano -03) como "+/-HH"
export const getChileOffsetHH = (d: Date = new Date()) => {
  const tzFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  });
  const tz = tzFmt.formatToParts(d).find(p => p.type === "timeZoneName")?.value || "GMT-03";
  const sign = tz.includes("-") ? "-" : "+";
  const hh = tz.slice(-2); // "03" o "04"
  return { sign, hh };
};

// 6) Convierte "YYYY-MM-DD" (fecha Chile) a ISO UTC **estable**
//    Preserva el día chileno: medianoche Chile = 03:00Z o 04:00Z según DST
export const chileDateToStableUTCISO = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  // Tomamos "medianoche Chile" y la movemos a UTC sumando el offset (3h o 4h)
  // Para saber el offset correcto en esa fecha, pedimos un offset con esa fecha:
  // Usamos 12:00Z para evitar borde DST al crear el Date de referencia
  const ref = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0));
  const { hh, sign } = getChileOffsetHH(ref); // "GMT-03" => sign="-", hh="03"

  // Si sign es "-", Chile está "atrasado" respecto de UTC, así que UTC = local + hh
  const addHours = sign === "-" ? Number(hh) : -Number(hh);

  // Medianoche Chile trasladada a UTC:
  const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, addHours, 0, 0));
  return utc.toISOString(); // "YYYY-MM-DDT0X:00:00.000Z"
};

// 7) De ISO UTC -> "YYYY-MM-DD" visto en Chile
export const isoToChileDate = (iso: string) => {
  const d = new Date(iso);
  return getChileDate(d);
};

// 8) Mostrar fecha/hora con formato en Chile
export const formatChile = (d: Date | string, opts?: Intl.DateTimeFormatOptions) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    dateStyle: "medium",
    timeStyle: "short",
    ...(opts || {}),
  }).format(date);
};

export const toISOFromAny = (v?: string | Date | null) => {
  if (!v) return undefined;
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return chileDateToStableUTCISO(`${y}-${m}-${d}`);
  }
  return v.trim() ? chileDateToStableUTCISO(v) : undefined;
};



export const chileDateToOffset = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  // offset actual de Chile en esa fecha
  const ref = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
  const tzFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  });
  const tz = tzFmt.formatToParts(ref).find(p => p.type === "timeZoneName")?.value || "GMT-03";

  // tz llega como "GMT-03" o "GMT-04"
  const sign = tz.includes("-") ? "-" : "+";
  const hh = tz.slice(-2);
  console.log(sign,hh)

  return ymd;  
};