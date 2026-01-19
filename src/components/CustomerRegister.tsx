import { useEffect, useState } from "react";
import { Clock, Phone, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCustomer } from "@/hooks/useCustomer";
import { useAuth } from "@/hooks/useAuth";
import { useForm, type GestionFrom } from "@/hooks/useForm";
import {
  chileDateToOffset,
  getChileTime
} from "@/utils/getTimes";
import type { Management } from "@/interfaces/customer.interfaces";
import { cupCall, dispoCall } from "@/utils/getCall";

export function CustomerRegister() {
  const {
    getClassifications,
    classifications,
    customerInformation,
    insertCustomerRecord,
  } = useCustomer();
  const { user } = useAuth();

  const [disableButton, setdisableButton] = useState(false);

  const initialForm: GestionFrom = {
    fonoGestion: "",
    volverLlamar: null,
    fechaCompromiso: null,
    montoCompromiso: "",
    glosa: "",
    autoriza: false,
    tipo: "",
    subtipo: "",
    autorizaDate: null,
    Idrespuesta: "",
  };

  const {
    volverLlamar,
    fechaCompromiso,
    montoCompromiso,
    glosa,
    autoriza,
    tipo,
    subtipo,
    autorizaDate,
    onInputChange,
    setField,
  } = useForm(initialForm);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (user && user[0]?.wallet) {
      getClassifications(user[0].wallet);
    }
  }, [user]);

  const getTiposGestion = () => {
    const arr = (classifications ?? [])
      .map((i) => i.glosa_gestion)
      .filter(Boolean) as string[];
    return Array.from(new Set(arr));
  };

  const getSubtipos = (tipoSeleccionado: string) => {
    const items = (classifications ?? []).filter(
      (i) => i.glosa_gestion === tipoSeleccionado
    );

    // Unicidad por status
    const map = new Map<
      string,
      { glosa_estado: string; status: string; Idrespuesta: string }
    >();
    for (const it of items) {
      const statusStr = String(it.status);
      if (!map.has(statusStr)) {
        map.set(statusStr, {
          glosa_estado: it.glosa_estado,
          status: statusStr,
          Idrespuesta: it.idrespuesta,
        });
      }
    }

    return Array.from(map.values());
  };

  const handleSaveGestion = async () => {
    if (!tipo) {
      setAlertMessage("Por favor seleccione un tipo de gestión");
      setShowAlert(true);
      return;
    }

    if (!customerInformation[0]?.rut.trim()) {
      setAlertMessage("Por favor Busque un Rut");
      setShowAlert(true);
      return;
    }
    if (!subtipo) {
      setAlertMessage("Por favor seleccione un subtipo");
      setShowAlert(true);
      return;
    }

    if (!glosa.trim()) {
      setAlertMessage("Por favor ingrese la glosa");
      setShowAlert(true);
      return;
    }

    const [idrespuesta, status] = subtipo.split("_") ?? "";

    const nuevaGestion: Management = {
      lead_id: user[0]?.lead_id ?? "",
      fecha: getChileTime(),
      rut: customerInformation[0]?.rut ?? "",
      ruteje: user[0]?.Rut_Ejecutivo ?? "",
      telefono: user[0].telefono_client ?? "",
      glosa: glosa,
      numdoc: 0,
      monto: customerInformation[0]?.monto ?? 0,
      feccomp: fechaCompromiso ? chileDateToOffset(fechaCompromiso) : undefined,
      estcomp: "Pendiente",
      tipocomp: 0,
      abono: montoCompromiso ?? "",
      modo: user[0]?.modo ?? "",
      uniqueid: user[0]?.uniqueid ?? "",
      idrespuesta,
      autoriza: autoriza,
      autorizaDate: autorizaDate ? chileDateToOffset(autorizaDate) : undefined,
      volverLlamar: volverLlamar ? chileDateToOffset(volverLlamar) : undefined,
      prefix: user[0]?.wallet ?? "",
    };
    setdisableButton(false);
    await dispoCall({ user: user[0].Rut_Ejecutivo, status });

     const statusInsert = await insertCustomerRecord(nuevaGestion);
    console.log(statusInsert);
    window.close();
  };

  const endCall = async () => {
    await cupCall({ user: user[0].Rut_Ejecutivo });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Datos de Gestión</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Management Type and Subtype */}
        <div className="space-y-4 space-x-4 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-sm">
              Tipo de Gestión
            </Label>
            <Select
              value={tipo}
              onValueChange={(value) => {
                setField("tipo", value);
                setField("subtipo", ""); // limpiar subtipo al cambiar tipo
              }}
            >
              <SelectTrigger className="w-full border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/80 backdrop-blur-sm h-10 sm:h-11">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm max-h-60">
                {getTiposGestion().map((t) => (
                  <SelectItem key={t} value={t} className="hover:bg-indigo-50">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold text-sm">
              Subtipo
            </Label>
            <Select
              value={subtipo}
              onValueChange={(value) => setField("subtipo", value)}
              disabled={!tipo}
            >
              <SelectTrigger className="w-full border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/80 backdrop-blur-sm h-10 sm:h-11">
                <SelectValue placeholder="Seleccionar subtipo" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm max-h-60">
                {tipo &&
                  getSubtipos(tipo).map(
                    ({ glosa_estado, status, Idrespuesta }) => (
                      <SelectItem
                        key={status}
                        value={Idrespuesta + "_" + status} // Select espera string
                        className="hover:bg-indigo-50"
                      >
                        {glosa_estado}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Management Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Teléfono de Gestión
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-500" />
            <Input
              placeholder="Sin información"
              className="bg-slate-50"
              value={user[0]?.telefono_client || "Sin información"}
              readOnly
            />
          </div>
        </div>

        {/* Callback Date and Commitment Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Volver a Llamar
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Input
                type="datetime-local"
                placeholder="mm/dd/yyyy"
                className="flex-1"
                name="volverLlamar"
                onChange={onInputChange}
                value={
                  volverLlamar
                    ? new Date(volverLlamar).toISOString().slice(0, 16)
                    : ""
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Fecha Compromiso
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                className="flex-1"
                name="fechaCompromiso"
                onChange={onInputChange}
                value={
                  fechaCompromiso
                    ? new Date(fechaCompromiso).toISOString().split("T")[0]
                    : ""
                }
              />
            </div>
          </div>
        </div>

        {/* Commitment Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Monto Compromiso
          </label>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <Input
              placeholder="$0"
              value={montoCompromiso}
              onChange={onInputChange}
              name="montoCompromiso"
              className="flex-1"
            />
          </div>
        </div>

        {/* Authorize Call Checkbox */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="authorize-call"
              checked={autoriza}
              onCheckedChange={(checked) =>
                setField("autoriza", Boolean(checked))
              }
            />
            <label
              htmlFor="authorize-call"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Autoriza Llamado
            </label>
          </div>

          {autoriza && (
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium text-slate-700">
                Fecha de Autorización
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <Input
                  type="datetime-local"
                  value={
                    autorizaDate
                      ? new Date(autorizaDate).toISOString().slice(0,16)
                      : ""
                  }
                  onChange={onInputChange}
                  name="autorizaDate"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Glosa</label>
          <Textarea
            placeholder="Detalles y observaciones de la gestión..."
            className="min-h-[100px]"
            value={glosa}
            onChange={onInputChange}
            name="glosa"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={endCall}
            className="bg-slate-600 hover:bg-slate-700 text-white flex-1"
          >
            <Phone className="h-4 w-4 mr-2" />
            Finalizar Llamada
          </Button>
          <Button
            disabled={disableButton}
            onClick={handleSaveGestion}
            className="bg-slate-600 hover:bg-slate-700 text-white flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Guardar Gestión
          </Button>
        </div>
      </div>

      {/* AlertDialog for validation messages */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Campo Requerido</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
