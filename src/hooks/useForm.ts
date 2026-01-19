import { useState } from "react";

export interface GestionFrom {
  fonoGestion: string;
  volverLlamar?: string | null; // YYYY-MM-DD
  fechaCompromiso?: string | null; // YYYY-MM-DD
  montoCompromiso?: string;
  glosa: string;
  autoriza: boolean;
  tipo?: string;
  subtipo?: string;
  autorizaDate?: string | null; // YYYY-MM-DD
  Idrespuesta: string;
}

type FieldName = keyof GestionFrom;
type TextEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const isDateField = (name: FieldName) =>
  name === "volverLlamar" ||
  name === "fechaCompromiso" ||
  name === "autorizaDate";

export const useForm = (initialForm: GestionFrom) => {
  const [formState, setFormState] = useState<GestionFrom>(initialForm);

  // Coerción segura por tipo de campo
  const coerceValue = (
    name: FieldName,
    value: unknown
  ): GestionFrom[FieldName] => {
    // boolean
    if (name === "autoriza") {
      return (
        typeof value === "boolean" ? value : String(value) === "true"
      ) as GestionFrom[FieldName];
    }

    // fechas: mantener como string "YYYY-MM-DD" o null
    if (isDateField(name)) {
      if (value == null || value === "") return null as GestionFrom[FieldName];
      // Si viene un Date, lo formateamos a "YYYY-MM-DD" local Chile (sin UTC)
      if (value instanceof Date) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, "0");
        const d = String(value.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}` as GestionFrom[FieldName];
      }
      // Si viene string, asumir que ya es "YYYY-MM-DD"
      return String(value) as GestionFrom[FieldName];
    }

    // resto: dejar tal cual
    return value as GestionFrom[FieldName];
  };

  // 1) Para <Input/> y <Textarea/>
  const onInputChange = (e: TextEvent) => {
    const { name, value, type } = e.target;
    const key = name as FieldName;

    // Si algún día usas <input type="checkbox" onChange={onInputChange}>
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState((prev) => ({ ...prev, [key]: coerceValue(key, checked) }));
      return;
    }

    setFormState((prev) => ({ ...prev, [key]: coerceValue(key, value) }));
  };

  // 2) Para Select/Checkbox o setear directo
  const setField = (name: FieldName, value: unknown) => {
    setFormState((prev) => ({ ...prev, [name]: coerceValue(name, value) }));
  };

  const onResetFrom = () => setFormState(initialForm);

  return {
    ...formState,
    onInputChange,
    setField,
    onResetFrom,
  };
};
