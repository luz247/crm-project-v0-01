"use client";

import type React from "react";
import { useState } from "react";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/hooks/useCustomer";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string) => void;
  namedb: string;
  lead_id:string;
  rut:string;
  ruteje:string
}

export const EmailModal = ({
  isOpen,
  onClose,
  onAdd,
  namedb,
  lead_id,
  rut,
  ruteje
}: EmailModalProps) => {
  const { insertEmail } = useCustomer();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // payload como lo espera tu API
      const payload = {
        email,
        lead_id,
        rut,
        ruteje,
      };

      await insertEmail(namedb, payload);

      // notifica al padre con el email para setEmails([...])

      onAdd(email);

      // limpia y cierra
      setEmail("");
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
            <Mail className="h-5 w-5 text-emerald-500" />
            Agregar Correo Electrónico
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo Electrónico</label>
            <Input
             className="mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
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
