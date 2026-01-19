export interface authUser {
  Rut_Ejecutivo: string;
  wallet: string;
  modo: string;
  vendor_id: string;
  telefono_client:string;
  uniqueid:string
  lead_id: string
  
}

export interface authState {
  user: authUser[];
}
