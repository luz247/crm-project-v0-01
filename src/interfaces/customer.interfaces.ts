// Identificadores y utilidades
export type ID = string;

// Email/Phone/Address modelados como arreglos (soportan 0..N)
// types/email.ts
export interface Email {
  email: string;
  type?: string;          // "personal" | "trabajo" | "otro"
  customerId?: string;    // o userId, según tu modelo
  createdBy?: string;     // opcional
}


export interface Phone {
  phone: string;
  type?: string;          // "personal" | "trabajo" | "otro"
  customerId?: string;    // o userId, según tu modelo
  createdBy?: string;    
}

// export interface Address {
//   street: string;
//   city?: string;
//   region?: string;
//   country?: string;
//   postalCode?: string;
// }

export interface CustomerBoletas {
  id: ID;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  [key: string]: any;
  // ...otros campos que uses
}


export interface DiscountRecord {
  monto_real?: string;
  descuento?: string;
  porcentaje?: string;
  total_pagar?:string
}

export interface DicomRecord {
  code: string;
  description?: string;
  date?: string; // ISO
}

export interface CallManagementRecord {
  id: ID;
  status: string;
  agent?: string;
  date: string; // ISO
  notes?: string;
}

export interface CheckRecord {
  bank?: string;
  number?: string;
  amount?: number;
  dueDate?: string; // ISO
}


export interface PatentRecord {
  plate: string;
  validUntil?: string; // ISO
}

export interface Classification {
  id: string;
  glosa_gestion: string;
  glosa_estado: string;
  idrespuesta: string;
  status: string;
  tipo: string;
  pond: string;
  // // cualquier metadata adicional
  // [k: string]: unknown;
}

// 👇 Cliente: campos base + arreglos para datos variables
export interface Customer {
  rut: string;
  ic?: string;
  cc?: string;
  nombre: string;
  mora?: string;
  tipo_cobranza?: string;
  direccion_contractual?: string;
  direccion_facturacion?: string;
  direcciones?: string;
  comuna?: string;
  comuna1?: string;
  ciudad1?: string;
  region1?: string;
  ciudad: string;
  region: string;
  fijo1?: string;
  fijo2?: string;
  fijo3?: string;
  fijo4?: string;
  fijo5?: string;
  fijo6?: string;
  movil1?: number;
  movil2?: number;
  movil3?: number;
  celular?: string;
  email?: string;
  email1?: string;
  email3?: string;
  email2?: string;
  email4?: string;
  email5?: string;
  email6?: string;
  monto: number;
  dias?: string;
  cesion?: string;
  honorario?: number;
  repactacion?: string;
  boletas?: string;
  tramo?: string;
  dicom: string;
  concession_code?: string;
  
}

export interface ClientState {
  classifications: Classification[];
  customerInformation: Customer[]; // aquí soportas 0..N y estructura variable en arrays
  customerBoletas: CustomerBoletas[];
  customerManagement: Management[];
  customerDiscount: DiscountRecord[];
  customerDicom: DicomRecord[];
  // callManagement: CallManagementRecord[];
  // customerAddress: Address[];
  customerPatents: PatentsList[];
  customerEmails: EmailsList;
  customerPhones: PhoneList;
  customerChecks: CheckRecord[];
  customerCuotas: CustomerCuotas[];
  // customerBillingGroup:GrupoFacturacion[]
}

export interface Management {
  lead_id: string;
  rut: string;
  ruteje: string;
  telefono: string;
  glosa: string;
  numdoc?: number;
  monto: number;
  feccomp?: string;
  estcomp: string;
  tipocomp: number;
  abono: string;
  modo: string;
  uniqueid: string;
  idrespuesta: string;
  fecha: string;
  autoriza?: boolean;
  autorizaDate?: string;
  volverLlamar?: string;
  prefix: string;
  Fecha_Agenda?: Date | null;
  [key: string]: any;
}



export interface BillingGroup {
  ic:                 string;
  facturacion_grupos: BillingInformation[];
}

export interface BillingInformation {
  cc:                number;
  Grupo:             string;
  Fecha_Facturacion: null;
  Fecha_Vencimiento: null;
}

export interface CustomerDisabled {
  ic:               string;
  inhabilitaciones: Inhabilitacione[];
}

export interface Inhabilitacione {
  Fecha_Desconect: Date;
  Patente:         string;
}


export interface CustomerCuotas {
  rutdv:           string;
  resumen_consumo: ResumenConsumo;
}

export interface ResumenConsumo {
  RutDV:             string;
  ConsumoMes:        number;
  CuotaMes:          number;
  Total:             number;
  EstadoRepactacion: null;
  CuotasFuturas:     string;
}


export type PatentsList = string[];


export interface AutomaticPayment {
  ic:      string;
  exists:  boolean;
  message: string;
}

export type EmailsList = string[];
export type PhoneList = (number | string)[]