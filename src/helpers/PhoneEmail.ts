// helpers (pueden ir arriba del componente)
export const onlyDigits = (v: number | string) =>
  String(v ?? "").replace(/[^\d]/g, "").replace(/^0+/, "");

export const normalizeEmail = (v?: string) => String(v ?? "").trim().toLowerCase();
export const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const dedupe = <T,>(arr: T[]) => Array.from(new Set(arr));

export const phoneKeys = ["fijo1","fijo2","fijo3","movil1","movil2","movil3"] as const;
export const emailKeys = ["email","email1","email2","email3","email4","email5","email6"] as const;
export const addrKeys  = ["direccion_contractual","direccion_facturacion"] as const;




