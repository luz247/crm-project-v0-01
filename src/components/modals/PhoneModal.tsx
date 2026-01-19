import { useState } from "react";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/hooks/useCustomer";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (phone: string) => void;
  namedb: string;
  lead_id: string;
  rut: string;
  ruteje: string;
}

export const PhoneModal = ({
  isOpen,
  onClose,
  onAdd,
  namedb,
  lead_id,
  rut,
  ruteje,
}: PhoneModalProps) => {
  const { insertPhone } = useCustomer();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // payload como lo espera tu API
      const payload = {
        phone: phoneNumber,
        lead_id,
        rut,
        ruteje,
      };

      await insertPhone(namedb, payload);

      onAdd(phoneNumber);

      // limpia y cierra
      setPhoneNumber("");
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo guardar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-emerald-500" />
            Agregar Teléfono
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Número de Teléfono</label>
            <Input 
              className="mt-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+56 9 1234 5678"
              required
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
