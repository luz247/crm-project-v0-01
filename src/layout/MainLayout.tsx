import "../index.css";
import { CustomerRegister } from "@/components/CustomerRegister";
import { CustomerInfo } from "@/components/CustomerInformation";
import { Header } from "@/components/Header";
import { ManagementBoletas } from "@/components/ManagementBoletas";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  brand: string;
  image: string; // Vite importa imágenes como string (URL)
}

export const MainLayout = ({ brand, image }: Props) => {
  const location = useLocation();
  const { getUser } = useAuth();

  // Obtén el primer segmento de la URL como wallet (p.ej. /acsa -> "acsa")
  const walletFromPath = useMemo(() => {
    const seg = location.pathname.split("/")[1]?.trim().toLowerCase() ?? "";
    return seg || brand.toLowerCase(); // fallback al brand si aplica
  }, [location.pathname, brand]);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Construye el payload de usuario de forma segura
  const userPayload = useMemo(
    () => [
      {
        wallet: walletFromPath,
        Rut_Ejecutivo: params.get("user") ?? "",
        modo: params.get("MODO") ?? "",
        vendor_id: params.get("vendor_id") ?? "",
        telefono_client: params.get("phone_number") ?? "",
        uniqueid: params.get("uniqueid") ?? "",
        lead_id: params.get("lead_id") ?? "",
      },
    ],
    [walletFromPath, params]
  );

  // Evita llamadas repetidas a getUser si el payload no cambia
  const lastJson = useRef<string>("");
  useEffect(() => {
    const nextJson = JSON.stringify(userPayload);
    if (nextJson !== lastJson.current) {
      lastJson.current = nextJson;
      getUser(userPayload);
    }
  }, [userPayload, getUser]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header brand={params.get("MODO")?? "" } image={image} />

      <main className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerInfo />
          <CustomerRegister />
        </div>

        <div className="mt-6">
          <ManagementBoletas />
        </div>
      </main>
    </div>
  );
};
