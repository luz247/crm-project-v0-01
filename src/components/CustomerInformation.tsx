import { useState, useEffect, useMemo } from "react";
import {
  User,
  Plus,
  DollarSign,
  Receipt,
  FileText,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  UserX,
  Building,
  ChevronDown,
  MailCheck,
  PhoneIncoming,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddressModal } from "./modals/AddressModal";
import { PhoneModal } from "./modals/PhoneModal";
import { EmailModal } from "./modals/EmailModal";
import { useCustomer } from "@/hooks/useCustomer";
import { useAuth } from "@/hooks/useAuth";
import type {
  AutomaticPayment,
  BillingGroup,
  Customer,
  CustomerDisabled
} from "@/interfaces/customer.interfaces";
import { getPersonType } from "@/utils/personType";
import { useMessages } from "@/hooks/useMessages";
import { SecondStepsTemplateHTML, ZumpagoTemplate } from "@/templates";
import { addrKeys, dedupe, emailKeys, emailRx, normalizeEmail, onlyDigits, phoneKeys } from "@/helpers/PhoneEmail";

export function CustomerInfo() {
  const {
    getSimulationOfaFailedAgreement,
    getAutomaticCustomerPayments,
    getCustomerInhabilitado,
    getCustomerBillingGroup,
    getCustomerInformations,
    getCustomerManagement,
    getCustomerBoletas,
    getCustomerDiscount,
    getCustomerCheks,
    getCustomerPatentes,
    getCustomerCutoas,
    getEmail,
    getPhone,
    customerDiscount,
    customerInformation,
    customerCuotas,
    customerPatents,
    customerChecks,
    customerEmails,
    customerPhones
    
  } = useCustomer();
  const { user } = useAuth();
  const { SendMessages } = useMessages();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isIhabilitado, setInhabilitado] = useState<CustomerDisabled[]>([]);
  const [billingGroup, setBillingGroup] = useState<BillingGroup[]>([]);
  const [automaticPayment, setAutomaticPayment] = useState<AutomaticPayment[]>(
    []
  );

  const [chequesCurrentPage, setChequesCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [showAlert, setShowAlert] = useState(false);
  const [rut, setRut] = useState("");
  const [convenioCaido, setConvenioCaido] = useState(false);
  const [simulacion, setsimulacion] = useState(false);


  const [activeTab, setActiveTab] = useState<
    | "deuda"
    | "resumen-deuda"
    | "Cuotas"
    | "patentes"
    | "Inhabilitado"
    | "Grupo Facturacion"
    | "Cheques"
  >("deuda");

  const InformationWallet = async () => {
    const ic = customerInformation?.[0]?.ic;
    if (ic) {
      setBillingGroup(await getCustomerBillingGroup(ic));
      setInhabilitado(await getCustomerInhabilitado(ic));
      setAutomaticPayment(await getAutomaticCustomerPayments(ic));
    }
  };

 const firstCI = Array.isArray(customerInformation) ? customerInformation[0] : undefined;

// 1) “base” desde customerInformation
const phonesFromCI = useMemo(() => {
  if (!firstCI) return [];
  const raw = phoneKeys.map(k => firstCI?.[k]).filter(Boolean) as (string|number)[];
  return dedupe(raw.map(onlyDigits).filter(v => v.length > 0));
}, [firstCI]);

const emailsFromCI = useMemo(() => {
  if (!firstCI) return [];
  const raw = emailKeys.map(k => firstCI?.[k]).filter(Boolean) as string[];
  return dedupe(raw.map(normalizeEmail).filter(e => e && emailRx.test(e)));
}, [firstCI]);

const addressesFromCI = useMemo(() => {
  if (!firstCI) return [];
  return addrKeys.map(k => firstCI?.[k]).filter(Boolean) as string[];
}, [firstCI]);

// 2) estados SOLO para “agregados locales” (si aún no los persististe)
const [addedPhones, setAddedPhones] = useState<string[]>([]);
const [addedEmails, setAddedEmails] = useState<string[]>([]);
const [addedAddresses, setAddedAddresses] = useState<string[]>([]);

// 3) mezcla final SIN dispatch, usando también lo que viene del store
const phones = useMemo(
  () => dedupe([...phonesFromCI, ...customerPhones.map(String), ...addedPhones]),
  [phonesFromCI, customerPhones, addedPhones]
);

const emails = useMemo(
  () => dedupe([...emailsFromCI, ...customerEmails.map(normalizeEmail), ...addedEmails]),
  [emailsFromCI, customerEmails, addedEmails]
);

const addresses = useMemo(
  () => dedupe([...addressesFromCI, ...addedAddresses]),
  [addressesFromCI, addedAddresses]
);

// 4) handlers de “Agregar” SOLO tocan los agregados locales
const handleAddPhone = (phone: string) => {
  const clean = onlyDigits(phone);
  if (!clean) return;
  setAddedPhones(prev => dedupe([...prev, clean]));
};

const handleAddEmail = (email: string) => {
  const clean = normalizeEmail(email);
  if (!clean || !emailRx.test(clean)) return;
  setAddedEmails(prev => dedupe([...prev, clean]));
};

const handleAddAddress = (addr: string) => {
  const clean = String(addr ?? "").trim();
  if (!clean) return;
  setAddedAddresses(prev => dedupe([...prev, clean]));
};



  const currentCustomer: Customer | null =
    customerInformation && customerInformation.length > 0
      ? customerInformation[0]
      : null;

  const hasFinancialData = () => {
    return (
      currentCustomer &&
      (currentCustomer.mora ||
        currentCustomer.monto ||
        currentCustomer.dias ||
        (customerDiscount && customerDiscount[0]))
    );
  };

  const getPaginatedCheques = () => {
    if (!customerChecks || customerChecks.length === 0) return [];
    const startIndex = (chequesCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return customerChecks.slice(startIndex, endIndex);
  };

  const getTotalChequesPages = () => {
    if (!customerChecks || customerChecks.length === 0) return 0;
    return Math.ceil(customerChecks.length / itemsPerPage);
  };

  const handleChequesPageChange = (page: number) => {
    setChequesCurrentPage(page);
  };

  // Reemplaza tu handleCustomerSearch por esta versión
  const handleCustomerSearch = async () => {

    const wallet = user?.[0]?.wallet;
    const modo = user?.[0]?.modo;

    // Si es AUTOMATICA → usar vendor_id
    // Si no → usar rut escrito en input o lo que tengas en customerInformation
    const rutToUse = (
      modo === "AUTOMATICO"
        ? user?.[0]?.vendor_id
        : rut || customerInformation?.[0]?.rut
    )?.trim();

    if (!rutToUse) {
      setShowAlert(true);
      return;
    }

    if (wallet) {
      getCustomerInformations(wallet, rutToUse);
      getCustomerBoletas(wallet, rutToUse);
      getCustomerManagement(wallet, rutToUse);
      getCustomerDiscount(wallet, rutToUse);
     await getEmail(rutToUse,wallet)
     await getPhone(rutToUse,wallet)

      if (wallet === "avo") {
        getCustomerCutoas(rutToUse);
        getCustomerPatentes(rutToUse);
      }

      if (wallet === "acsa") {
        const { convenio_caido, simulacion } =
          await getSimulationOfaFailedAgreement(wallet);

        console.log(convenio_caido, simulacion);

        await getCustomerCheks(rutToUse);

        setConvenioCaido(convenio_caido);
        setsimulacion(simulacion);
      }
    }
  };

  useEffect(() => {
    if (user?.[0]?.modo === "AUTOMATICO") {
      handleCustomerSearch();
    }
  }, [user]);

useEffect(() => {
  
if (user?.[0]?.wallet == "acsa") {
   InformationWallet();
   }

}, [customerInformation])


  // TODO:envio de mail
  const handSendMail = async (email: string) => {
    const wallet = user?.[0]?.wallet;

    if (wallet.trim() === "avo") {
      await SendMessages({
        email,
        subject: "Paso a paso ZumPago",
        body: ZumpagoTemplate,
      });
    } else if (wallet.trim() === "rpass") {
      await SendMessages({
        email,
        subject: "Refinanciacion Ruta Pass",
        body: SecondStepsTemplateHTML,
      });
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-lg border
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          p-4
          text-white
          bg-slate-800
          rounded-t-lg
        "
      >
        <div
          className="
            flex
            items-center gap-2
          "
        >
          <User
            className="
              h-5 w-5
            "
          />
          <h2
            className="
              text-lg font-semibold
            "
          >
            Información del Cliente
          </h2>
        </div>
      </div>

      {/* Content */}
      <div
        className="
          p-6 space-y-6
        "
      >
        {/* RUT Section */}
        <div
          className="
            space-y-2
          "
        >
          <label
            className="
              text-sm font-medium text-slate-700
            "
          >
            RUT
          </label>
          <div
            className="
              flex
              gap-2
            "
          >
            <Input
              value={
                (user?.[0]?.modo === "AUTOMATICO"
                  ? user?.[0]?.vendor_id // en automática siempre vendor_id
                  : rut) ||
                customerInformation[0]?.rut ||
                ""
              }
              onChange={(e) => setRut(e.target.value)}
              placeholder="12345678-9"
              readOnly={user?.[0]?.modo === "AUTOMATICO"}
              className="
                flex-1
              "
            />

            {user?.[0]?.modo !== "AUTOMATICO" && (
              <Button
                onClick={handleCustomerSearch}
                className={`
                  px-6
                  text-white
                  ${
                  user[0]?.modo !="AUTOMATICO"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500"
                  : "bg-emerald-500 hover:bg-emerald-600"
                  
                  }
                `}
              >
                Buscar
              </Button>
            )}
          </div>
        </div>
        {user?.[0]?.wallet === "acsa" && customerInformation[0]?.rut && (
          <div
            className="
              space-y-2
            "
          >
            <div
              className="
                flex
                items-center gap-2
              "
            >
              <ChevronDown
                className="
                  h-4 w-4
                  text-slate-600
                "
              />
              <label
                className="
                  text-sm font-medium text-slate-700
                "
              >
                Tipo de Persona:
              </label>
              <span
                className={`
                  px-3 py-1
                  text-sm font-medium
                  rounded-md
                  ${
                    getPersonType(rut) === "Natural"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {getPersonType(rut)}
              </span>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div
          className="
            space-y-2
          "
        >
          <label
            className="
              text-sm font-medium text-slate-700
            "
          >
            Nombre Completo
          </label>
          <Input
            placeholder="Sin información"
            value={customerInformation[0]?.nombre || "Sin información"}
            readOnly
            className="
              bg-slate-50
            "
          />
        </div>

        {/* Region and Comuna */}
        <div
          className="
            grid grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          <div
            className="
              space-y-2
            "
          >
            <label
              className="
                text-sm font-medium text-slate-700
              "
            >
              Región
            </label>
            <Input
              placeholder="Sin información"
              value={customerInformation[0]?.region || "Sin información"}
              readOnly
              className="
                bg-slate-50
              "
            />
          </div>
          <div
            className="
              space-y-2
            "
          >
            <label
              className="
                text-sm font-medium text-slate-700
              "
            >
              Comuna
            </label>
            <Input
              placeholder="Sin información"
              value={customerInformation[0]?.comuna || "Sin información"}
              readOnly
              className="
                bg-slate-50
              "
            />
          </div>
        </div>

        {/* Addresses */}
        <div
          className="
            space-y-3
          "
        >
          <div
            className="
              flex
              items-center justify-between
            "
          >
            <label
              className="
                text-sm font-medium text-slate-700
              "
            >
              Direcciones
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(true)}
              className="
                text-blue-600
                border-blue-200
                hover:bg-blue-50
              "
            >
              <Plus
                className="
                  h-4 w-4
                  mr-1
                "
              />
              Agregar
            </Button>
          </div>
          <div
            className="
              space-y-2
            "
          >
            {addresses.length === 0 ? (
              <Input
                placeholder="Dirección adicional"
                readOnly
                className="
                  bg-slate-50
                "
              />
            ) : (
              addresses.map((address, index) => (
                <Input
                  key={index}
                  value={address}
                  readOnly
                  className="
                    bg-slate-50
                  "
                />
              ))
            )}
          </div>
        </div>

        {/* Emails */}
        <div
          className="
            space-y-3
          "
        >
          <div
            className="
              flex
              items-center justify-between
            "
          >
            <label
              className="
                text-sm font-medium text-slate-700
              "
            >
              Correos Electrónicos
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmailModalOpen(true)}
              className="
                text-blue-600
                border-blue-200
                hover:bg-blue-50
              "
            >
              <Plus
                className="
                  h-4 w-4
                  mr-1
                "
              />
              Agregar
            </Button>
          </div>
          <div
            className="
              gap-x-4
              flex flex-wrap
              w-full
              items-center
              justify-start
            "
          >
            {emails.length === 0 ? (
              <Input
                placeholder="correo@ejemplo.com"
                readOnly
                className="
                  bg-slate-50
                 
                "
              />
            ) : (
              emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center  "
                >
                  <MailCheck
                    onClick={() => handSendMail(email)}
                    className="h-8 w-8 text-cyan-900 cursor-pointer"
                  />
                  <Input
                    value={email}
                    readOnly
                    className="
                  text-cyan-900
                    bg-slate-50
                     max-w-60
                  "
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Phone Numbers */}
        <div
          className="
            space-y-3
          "
        >
          <div
            className="
              flex
              items-center justify-between
            "
          >
            <label
              className="
                text-sm font-medium text-slate-700
              "
            >
              Números Telefónicos
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPhoneModalOpen(true)}
              className="
                text-blue-600
                border-blue-200
                hover:bg-blue-50
              "
            >
              <Plus
                className="
                  h-4 w-4
                  mr-1
                "
              />
              Agregar
            </Button>
          </div>
          <div
            className="
            gap-x-4
              flex flex-wrap
              w-full
              gap-y-2
              justify-start
              items-center
            "
          >
            {phones.length === 0 ? (
              <Input
                placeholder="+56 9 1234 5678"
                readOnly
                className="
                  bg-slate-50
                "
              />
            ) : (
              phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-center">
                  <PhoneIncoming className="h-7 w-7 text-cyan-900 cursor-pointer" />
                  <Input
                    value={phone}
                    readOnly
                    className="
                  text-cyan-900
                    bg-slate-50
                    max-w-60
                  "
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {(hasFinancialData() ||
          (customerCuotas && customerCuotas.length > 0) ||
          (customerPatents && customerPatents.length > 0) ||
          (customerChecks && customerChecks.length > 0) ||
          (billingGroup && billingGroup.length > 0) ||
          (isIhabilitado && isIhabilitado.length > 0)) && (
          <div
            className="
              space-y-4
            "
          >
            {/* Tab Buttons */}
            <div
              className="
                "
            >
              <div
                className="
                flex flex-col
                min-w-max
                pb-2
                gap-2
                xl:flex-row
              "
              >
                <Button
                  onClick={() => setActiveTab("deuda")}
                  className={`
                    flex
                    whitespace-nowrap
                    items-center gap-2
                    ${
                      activeTab === "deuda"
                        ? "bg-slate-600 text-white hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  <DollarSign
                    className="
                      h-4 w-4
                    "
                  />
                  Deuda
                </Button>
                {hasFinancialData() && user[0].wallet === "acsa" && (
                  <Button
                    onClick={() => setActiveTab("resumen-deuda")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "resumen-deuda"
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                      }
                    `}
                  >
                    <User
                      className="
                        h-4 w-4
                      "
                    />
                    Resumen
                  </Button>
                )}

                {customerCuotas && customerCuotas.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("Cuotas")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "Cuotas"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }
                    `}
                  >
                    <Receipt
                      className="
                        h-4 w-4
                      "
                    />
                    Cuotas ({customerCuotas.length})
                  </Button>
                )}

                {customerPatents && customerPatents.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("patentes")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "patentes"
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }
                    `}
                  >
                    <FileText
                      className="
                        h-4 w-4
                      "
                    />
                    Patentes ({customerPatents.length})
                  </Button>
                )}

                {isIhabilitado && isIhabilitado.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("Inhabilitado")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "Inhabilitado"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }
                    `}
                  >
                    <UserX
                      className="
                        h-4 w-4
                      "
                    />
                    Inhabilitado ({isIhabilitado.length})
                  </Button>
                )}

                {billingGroup && billingGroup.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("Grupo Facturacion")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "Grupo Facturacion"
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }
                    `}
                  >
                    <Building
                      className="
                        h-4 w-4
                      "
                    />
                    Grupo Facturación (
                    {billingGroup[0].facturacion_grupos.length})
                  </Button>
                )}

                {customerChecks && customerChecks.length > 0 && (
                  <Button
                    onClick={() => setActiveTab("Cheques")}
                    className={`
                      flex
                      whitespace-nowrap
                      items-center gap-2
                      ${
                        activeTab === "Cheques"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
                    `}
                  >
                    <CreditCard
                      className="
                        h-4 w-4
                      "
                    />
                    Cheques ({customerChecks.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div
              className="
                p-4
                border rounded-lg
              "
            >
              {/* Debt Information Tab */}
              {activeTab === "deuda" && (
                <div
                  className="
                    space-y-4 p-4
                    bg-slate-50
                    rounded-lg
                  "
                >
                  <div
                    className="
                      grid grid-cols-1
                      gap-4
                      md:grid-cols-2
                      lg:grid-cols-3
                    "
                  >
                    {currentCustomer?.repactacion?.trim() && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Repactacion
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.repactacion.trim()}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.dicom && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Dicom
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.dicom}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.ic && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          IC
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.ic}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.concession_code && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Concession Code
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.concession_code}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.tipo_cobranza && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Tipo Cobranza
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.tipo_cobranza}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.cc && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          CC
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          {currentCustomer.cc}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.mora && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Mora
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          ${currentCustomer.mora.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.cesion && (
                      <div
                        className="
                          p-3
                          bg-white
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Cesion
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          ${currentCustomer.cesion.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.monto && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-blue-50 to-blue-100
                          rounded-lg border border-blue-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-blue-700 tracking-wide
                            uppercase
                          "
                        >
                          Total Pago
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-blue-700
                          "
                        >
                          ${currentCustomer.monto.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* {currentCustomer?.interes && (
                      <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Interés
                        </label>
                        <p className="text-lg font-bold text-red-600 mt-1">
                          ${currentCustomer.interes.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.gastos && (
                      <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Gastos
                        </label>
                        <p className="text-lg font-bold text-red-600 mt-1">
                          ${currentCustomer.gastos.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.honorarios && (
                      <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Honorarios
                        </label>
                        <p className="text-lg font-bold text-red-600 mt-1">
                          ${currentCustomer.honorarios.toLocaleString()}
                        </p>
                      </div>
                    )} */}

                    {customerDiscount && customerDiscount[0]?.descuento && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-green-50 to-green-100
                          rounded-lg border border-green-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-green-700 tracking-wide
                            uppercase
                          "
                        >
                          Descuento
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-green-700
                          "
                        >
                          ${customerDiscount[0].descuento.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {customerDiscount && customerDiscount[0]?.descuento && (
                      <div
                        className="
                          p-3 bg-gradient-to-br from-amber-50 to-fuchsia-50
                         
                          rounded-lg border border-red-200
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-slate-500 tracking-wide
                            uppercase
                          "
                        >
                          Total Pagar
                        </label>
                        <p
                          className="
                            mt-1
                            text-lg font-bold text-red-600
                          "
                        >
                          $
                          {customerDiscount[0]?.total_pagar
                            ? customerDiscount[0].total_pagar.toLocaleString() // Caso 1: Muestra total_pagar directamente
                            : // Caso 2: Calcula (Monto - Descuento)
                              (
                                Number(currentCustomer?.monto || 0) -
                                Number(customerDiscount[0].descuento || 0)
                              ).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {currentCustomer?.tramo && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-blue-50 to-blue-100
                          rounded-lg border border-blue-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-blue-700 tracking-wide
                            uppercase
                          "
                        >
                          Tramo
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-blue-700
                          "
                        >
                          ${currentCustomer.tramo}
                        </p>
                      </div>
                    )}
                    {currentCustomer?.dias && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-orange-50 to-orange-100
                          rounded-lg border border-orange-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-orange-700 tracking-wide
                            uppercase
                          "
                        >
                          Días de Atraso
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-orange-700
                          "
                        >
                          {currentCustomer.dias} días
                        </p>
                      </div>
                    )}
                    {simulacion && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-blue-50 to-blue-100
                          rounded-lg border border-blue-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-blue-700 tracking-wide
                            uppercase
                          "
                        >
                          Simulacion
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-fuchsia-800
                          "
                        >
                          Simulacion Web
                        </p>
                      </div>
                    )}
                    {convenioCaido && (
                      <div
                        className="
                          p-3
                          bg-gradient-to-br from-blue-50 to-blue-100
                          rounded-lg border border-blue-300
                          shadow-sm
                        "
                      >
                        <label
                          className="
                            text-xs font-medium text-blue-700 tracking-wide
                            uppercase
                          "
                        >
                          Convenio
                        </label>
                        <p
                          className="
                            mt-1
                            text-xl font-bold text-amber-700
                          "
                        >
                          Convenio Caido
                        </p>
                      </div>
                    )}
                    {automaticPayment && automaticPayment.length > 0 && (
                      <div
                        className="
                          flex flex-col items-center justify-center
                          bg-gradient-to-br from-blue-50 to-blue-100
                          rounded-lg border border-blue-300
                          shadow-sm
                        "
                      >
                        <span
                          className="
                            text-xs font-medium text-blue-700 tracking-wide
                            uppercase
                          "
                        >
                          Pago Automatico
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "resumen-deuda" &&
                hasFinancialData() &&
                user[0].wallet === "acsa" && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-emerald-50
                      rounded-lg
                    "
                  >
                    <h3
                      className="
                        mb-4
                        text-lg font-semibold text-emerald-800
                      "
                    >
                      Resumen de Deuda
                    </h3>

                    {/* Debt Range Table */}
                    <div
                      className="
                        overflow-hidden
                        bg-white
                        rounded-lg
                        shadow-sm
                      "
                    >
                      <table
                        className="
                          w-full
                        "
                      >
                        <thead
                          className="
                            text-white
                            bg-emerald-600
                          "
                        >
                          <tr>
                            <th
                              className="
                                px-4 py-3
                                text-left font-semibold
                              "
                            >
                              Tramo de Deuda
                            </th>
                            <th
                              className="
                                px-4 py-3
                                text-center font-semibold
                              "
                            >
                              Q Cheques
                            </th>
                            <th
                              className="
                                px-4 py-3
                                text-center font-semibold
                              "
                            >
                              Q Cuotas
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className="
                            divide-y divide-gray-200
                          "
                        >
                          <tr
                            className="
                              hover:bg-emerald-50
                            "
                          >
                            <td
                              className="
                                px-4 py-3
                                font-medium text-gray-900
                              "
                            >
                              Hasta MM$1
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              12
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              12
                            </td>
                          </tr>
                          <tr
                            className="
                              hover:bg-emerald-50
                            "
                          >
                            <td
                              className="
                                px-4 py-3
                                font-medium text-gray-900
                              "
                            >
                              MM$1 - MM$3
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              24
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              24
                            </td>
                          </tr>
                          <tr
                            className="
                              hover:bg-emerald-50
                            "
                          >
                            <td
                              className="
                                px-4 py-3
                                font-medium text-gray-900
                              "
                            >
                              &gt;MM$3
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              36
                            </td>
                            <td
                              className="
                                px-4 py-3
                                text-center text-gray-700
                              "
                            >
                              36
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Additional Information */}
                    <div
                      className="
                        overflow-hidden
                        bg-white
                        rounded-lg
                        shadow-sm
                      "
                    >
                      <div
                        className="
                          px-4 py-3
                          text-white
                          bg-gray-600
                        "
                      >
                        <h4
                          className="
                            font-semibold
                          "
                        >
                          Información Adicional
                        </h4>
                      </div>
                      <div
                        className="
                          p-4 space-y-3
                        "
                      >
                        <div
                          className="
                            flex
                            py-2
                            border-b border-gray-100
                            justify-between items-center
                          "
                        >
                          <span
                            className="
                              font-medium text-gray-900
                            "
                          >
                            Monto mínimo cheques
                          </span>
                          <span
                            className="
                              font-bold text-emerald-600
                            "
                          >
                            $30.000
                          </span>
                        </div>
                        <div
                          className="
                            flex
                            py-2
                            border-b border-gray-100
                            justify-between items-center
                          "
                        >
                          <span
                            className="
                              font-medium text-gray-900
                            "
                          >
                            Monto mínimo convenio
                          </span>
                          <span
                            className="
                              font-bold text-emerald-600
                            "
                          >
                            $30.000
                          </span>
                        </div>
                        <div
                          className="
                            flex
                            py-2
                            justify-between items-center
                          "
                        >
                          <span
                            className="
                              font-medium text-gray-900
                            "
                          >
                            Pie (para pago convenio y/o cheques)
                          </span>
                          <span
                            className="
                              font-bold text-emerald-600
                            "
                          >
                            17%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Quotas Information Tab */}
              {activeTab === "Cuotas" &&
                customerCuotas &&
                customerCuotas.length > 0 && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-blue-50
                      rounded-lg
                    "
                  >
                    <div
                      className="
                        overflow-x-auto
                      "
                    >
                      <table
                        className="
                          w-full
                          bg-white
                          border-collapse rounded-lg
                          shadow-sm
                        "
                      >
                        <thead>
                          <tr
                            className="
                              bg-blue-100
                              border-b border-blue-200
                            "
                          >
                            {Object.keys(customerCuotas[0]).map((key) => (
                              <th
                                key={key}
                                className="
                                  p-3
                                  text-left text-xs font-semibold text-blue-800 tracking-wide
                                  border-r border-blue-200
                                  uppercase last:border-r-0
                                "
                              >
                                {key.replace(/_/g, " ")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {customerCuotas.map((cuota, index) => (
                            <tr
                              key={index}
                              className="
                                border-b border-blue-100
                                transition-colors
                                hover:bg-blue-25
                              "
                            >
                              {Object.entries(cuota).map(([key, value]) => (
                                <td
                                  key={key}
                                  className="
                                    p-3
                                    text-sm
                                    border-r border-blue-100
                                    last:border-r-0
                                  "
                                >
                                  <span
                                    className="
                                      font-medium text-blue-900
                                    "
                                  >
                                    {value === null || value === undefined ? (
                                      <span
                                        className="
                                          text-slate-400
                                          italic
                                        "
                                      >
                                        null
                                      </span>
                                    ) : typeof value === "number" ? (
                                      key.toLowerCase().includes("rut") ? (
                                        String(value)
                                      ) : (
                                        `$${value.toLocaleString()}`
                                      )
                                    ) : (
                                      String(value)
                                    )}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile responsive cards for small screens */}
                    <div
                      className="
                        space-y-3 mt-4
                        md:hidden
                      "
                    >
                      {customerCuotas.map((quota, index) => (
                        <div
                          key={index}
                          className="
                            p-4
                            bg-white
                            rounded-lg border border-blue-200
                            shadow-sm
                          "
                        >
                          <div
                            className="
                              mb-2
                              text-xs font-semibold text-blue-600
                            "
                          >
                            Cuota #{index + 1}
                          </div>
                          <div
                            className="
                              space-y-2
                            "
                          >
                            {Object.entries(quota).map(([key, value]) => (
                              <div
                                key={key}
                                className="
                                  flex
                                  py-1
                                  border-b border-blue-100
                                  justify-between items-center last:border-b-0
                                "
                              >
                                <label
                                  className="
                                    text-xs font-medium text-slate-600 tracking-wide
                                    uppercase
                                  "
                                >
                                  {key.replace(/_/g, " ")}
                                </label>
                                <span
                                  className="
                                    text-sm font-semibold text-blue-700
                                  "
                                >
                                  {value === null || value === undefined ? (
                                    <span
                                      className="
                                        text-slate-400
                                        italic
                                      "
                                    >
                                      null
                                    </span>
                                  ) : typeof value === "number" ? (
                                    key.toLowerCase().includes("rut") ? (
                                      String(value)
                                    ) : (
                                      `$${value.toLocaleString()}`
                                    )
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Patents Information Tab */}
              {activeTab === "patentes" &&
                customerPatents &&
                customerPatents.length > 0 && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-purple-50
                      rounded-lg
                    "
                  >
                    <div
                      className="
                        overflow-x-auto
                      "
                    >
                      <table
                        className="
                          w-full
                          bg-white
                          border-collapse rounded-lg
                          shadow-sm
                        "
                      >
                        <thead>
                          <tr
                            className="
                              bg-purple-100
                              border-b border-purple-200
                            "
                          >
                            <th
                              className="
                                  p-3
                                  text-left text-xs font-semibold text-purple-800 tracking-wide
                                  border-r border-purple-200
                                  uppercase last:border-r-0
                                "
                            >
                              Patentes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerPatents.map((patent, index) => (
                            <tr
                              key={index} // Consider using a unique patent ID if available, e.g., key={patent.id}
                              className="border-b border-purple-100 hover:bg-purple-25 transition-colors"
                            >
                              <td className="p-3 text-sm border-r border-purple-100 last:border-r-0">
                                <span className="font-medium text-purple-900">
                                  {patent}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Cheques Information Tab with pagination and responsive design */}
              {activeTab === "Cheques" &&
                customerChecks &&
                customerChecks.length > 0 && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-green-50
                      rounded-lg
                    "
                  >
                    {/* Desktop Table */}
                    <div
                      className="
                        hidden
                        md:block
                      "
                    >
                      <div
                        className="
                          overflow-x-auto
                          max-h-96
                          border border-green-200 rounded-lg
                        "
                      >
                        <table
                          className="
                            w-full
                            bg-white
                            border-collapse
                          "
                        >
                          <thead
                            className="
                              bg-green-100
                              border-b border-green-200
                              sticky top-0
                            "
                          >
                            <tr>
                              {Object.keys(customerChecks[0]).map((key) => (
                                <th
                                  key={key}
                                  className="
                                    p-3
                                    text-left text-xs font-semibold text-green-800 tracking-wide
                                    border-r border-green-200
                                    uppercase last:border-r-0
                                  "
                                >
                                  {key.replace(/_/g, " ")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {getPaginatedCheques().map((cheque, index) => (
                              <tr
                                key={index}
                                className="
                                  border-b border-green-100
                                  transition-colors
                                  hover:bg-green-25
                                "
                              >
                                {Object.entries(cheque).map(([key, value]) => (
                                  <td
                                    key={key}
                                    className="
                                      p-3
                                      text-sm
                                      border-r border-green-100
                                      last:border-r-0
                                    "
                                  >
                                    <span
                                      className="
                                        font-medium text-green-900
                                      "
                                    >
                                      {value === null || value === undefined ? (
                                        <span
                                          className="
                                            text-slate-400
                                            italic
                                          "
                                        >
                                          null
                                        </span>
                                      ) : typeof value === "number" ? (
                                        key.toLowerCase().includes("rut") ? (
                                          String(value)
                                        ) : (
                                          `$${value.toLocaleString()}`
                                        )
                                      ) : (
                                        String(value)
                                      )}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* TODO:aqui volver el codigo  */}
                      {getTotalChequesPages() > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
                          <div className="text-sm text-green-700 order-2 sm:order-1">
                            Mostrando{" "}
                            {(chequesCurrentPage - 1) * itemsPerPage + 1} a{" "}
                            {Math.min(
                              chequesCurrentPage * itemsPerPage,
                              customerChecks.length
                            )}{" "}
                            de {customerChecks.length} cheques
                          </div>
                          <div className="flex items-center gap-2 order-1 sm:order-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleChequesPageChange(chequesCurrentPage - 1)
                              }
                              disabled={chequesCurrentPage === 1}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex gap-1 max-w-xs overflow-x-auto">
                              {(() => {
                                const totalPages = getTotalChequesPages();
                                const current = chequesCurrentPage;
                                const pages = [];

                                if (totalPages <= 7) {
                                  // Show all pages if 7 or fewer
                                  for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                  }
                                } else {
                                  // Smart pagination for many pages
                                  if (current <= 4) {
                                    // Show first 5 pages + ... + last page
                                    pages.push(
                                      1,
                                      2,
                                      3,
                                      4,
                                      5,
                                      "...",
                                      totalPages
                                    );
                                  } else if (current >= totalPages - 3) {
                                    // Show first page + ... + last 5 pages
                                    pages.push(
                                      1,
                                      "...",
                                      totalPages - 4,
                                      totalPages - 3,
                                      totalPages - 2,
                                      totalPages - 1,
                                      totalPages
                                    );
                                  } else {
                                    // Show first + ... + current-1, current, current+1 + ... + last
                                    pages.push(
                                      1,
                                      "...",
                                      current - 1,
                                      current,
                                      current + 1,
                                      "...",
                                      totalPages
                                    );
                                  }
                                }

                                return pages.map((page, index) =>
                                  page === "..." ? (
                                    <span
                                      key={`ellipsis-${index}`}
                                      className="px-2 py-1 text-green-700"
                                    >
                                      ...
                                    </span>
                                  ) : (
                                    <Button
                                      key={page}
                                      variant={
                                        page === current ? "default" : "outline"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        handleChequesPageChange(page as number)
                                      }
                                      className={
                                        page === current
                                          ? "bg-green-600 text-white hover:bg-green-700 min-w-[2rem]"
                                          : "border-green-200 text-green-700 hover:bg-green-50 min-w-[2rem]"
                                      }
                                    >
                                      {page}
                                    </Button>
                                  )
                                );
                              })()}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleChequesPageChange(chequesCurrentPage + 1)
                              }
                              disabled={
                                chequesCurrentPage === getTotalChequesPages()
                              }
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile responsive cards */}
                    <div
                      className="
                        space-y-3
                        md:hidden
                      "
                    >
                      {getPaginatedCheques().map((cheque, index) => (
                        <div
                          key={index}
                          className="
                            p-4
                            bg-white
                            rounded-lg border border-green-200
                            shadow-sm
                          "
                        >
                          <div
                            className="
                              mb-2
                              text-xs font-semibold text-green-600
                            "
                          >
                            Cheque #
                            {(chequesCurrentPage - 1) * itemsPerPage +
                              index +
                              1}
                          </div>
                          <div
                            className="
                              space-y-2
                            "
                          >
                            {Object.entries(cheque).map(([key, value]) => (
                              <div
                                key={key}
                                className="
                                  flex
                                  py-1
                                  border-b border-green-100
                                  justify-between items-center last:border-b-0
                                "
                              >
                                <label
                                  className="
                                    text-xs font-medium text-slate-600 tracking-wide
                                    uppercase
                                  "
                                >
                                  {key.replace(/_/g, " ")}
                                </label>
                                <span
                                  className="
                                    text-sm font-semibold text-green-700
                                  "
                                >
                                  {value === null || value === undefined ? (
                                    <span
                                      className="
                                        text-slate-400
                                        italic
                                      "
                                    >
                                      null
                                    </span>
                                  ) : typeof value === "number" ? (
                                    key.toLowerCase().includes("rut") ? (
                                      String(value)
                                    ) : (
                                      `$${value.toLocaleString()}`
                                    )
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Mobile Pagination */}
                      {getTotalChequesPages() > 1 && (
                        <div
                          className="
                            flex flex-col
                            mt-4
                            gap-2
                          "
                        >
                          <div
                            className="
                              text-sm text-green-700 text-center
                            "
                          >
                            Página {chequesCurrentPage} de{" "}
                            {getTotalChequesPages()} ({customerChecks.length}{" "}
                            cheques)
                          </div>
                          <div
                            className="
                              flex
                              justify-center gap-2
                            "
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleChequesPageChange(chequesCurrentPage - 1)
                              }
                              disabled={chequesCurrentPage === 1}
                              className="
                                text-green-700
                                border-green-200
                                hover:bg-green-50
                              "
                            >
                              <ChevronLeft
                                className="
                                  h-4 w-4
                                "
                              />
                              Anterior
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleChequesPageChange(chequesCurrentPage + 1)
                              }
                              disabled={
                                chequesCurrentPage === getTotalChequesPages()
                              }
                              className="
                                text-green-700
                                border-green-200
                                hover:bg-green-50
                              "
                            >
                              Siguiente
                              <ChevronRight
                                className="
                                  h-4 w-4
                                "
                              />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {activeTab === "Grupo Facturacion" &&
                billingGroup &&
                billingGroup[0].facturacion_grupos.length > 0 && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-indigo-50
                      rounded-lg
                    "
                  >
                    <div
                      className="
                        hidden overflow-x-auto
                        md:block
                      "
                    >
                      <table
                        className="
                          w-full
                          bg-white
                          border-collapse rounded-lg
                          shadow-sm
                        "
                      >
                        <thead>
                          <tr
                            className="
                              bg-indigo-100
                              border-b border-indigo-200
                            "
                          >
                            {Object.keys(
                              billingGroup[0].facturacion_grupos[0]
                            ).map((key) => (
                              <th
                                key={key}
                                className="
                                  p-3
                                  text-left text-xs font-semibold text-indigo-800 tracking-wide
                                  border-r border-indigo-200
                                  uppercase last:border-r-0
                                "
                              >
                                {key.replace(/_/g, " ")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {billingGroup[0].facturacion_grupos.map(
                            (facturacion, index) => (
                              <tr
                                key={index}
                                className="
                                  border-b border-indigo-100
                                  transition-colors
                                  hover:bg-indigo-25
                                "
                              >
                                {Object.entries(facturacion).map(
                                  ([key, value]) => (
                                    <td
                                      key={key}
                                      className="
                                        p-3
                                        text-sm
                                        border-r border-indigo-100
                                        last:border-r-0
                                      "
                                    >
                                      <span
                                        className="
                                          font-medium text-indigo-900
                                        "
                                      >
                                        {value === null ||
                                        value === undefined ? (
                                          <span
                                            className="
                                              text-slate-400
                                              italic
                                            "
                                          >
                                            null
                                          </span>
                                        ) : typeof value === "number" ? (
                                          key.toLowerCase().includes("rut") ||
                                          key.toLowerCase().includes("id") ? (
                                            String(value)
                                          ) : (
                                            `$${value.toLocaleString()}`
                                          )
                                        ) : (
                                          String(value)
                                        )}
                                      </span>
                                    </td>
                                  )
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile responsive cards for small screens */}
                    <div
                      className="
                        space-y-3 mt-4
                        md:hidden
                      "
                    >
                      {billingGroup[0].facturacion_grupos.map(
                        (facturacion, index) => (
                          <div
                            key={index}
                            className="
                              p-4
                              bg-white
                              rounded-lg border border-indigo-200
                              shadow-sm
                            "
                          >
                            <div
                              className="
                                mb-2
                                text-xs font-semibold text-indigo-600
                              "
                            >
                              Facturación #{index + 1}
                            </div>
                            <div
                              className="
                                space-y-2
                              "
                            >
                              {Object.entries(facturacion).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="
                                      flex
                                      py-1
                                      border-b border-indigo-100
                                      justify-between items-center last:border-b-0
                                    "
                                  >
                                    <label
                                      className="
                                        text-xs font-medium text-slate-600 tracking-wide
                                        uppercase
                                      "
                                    >
                                      {key.replace(/_/g, " ")}
                                    </label>
                                    <span
                                      className="
                                        text-sm font-semibold text-indigo-700
                                      "
                                    >
                                      {value === null || value === undefined ? (
                                        <span
                                          className="
                                            text-slate-400
                                            italic
                                          "
                                        >
                                          null
                                        </span>
                                      ) : typeof value === "number" ? (
                                        key.toLowerCase().includes("rut") ||
                                        key.toLowerCase().includes("id") ? (
                                          String(value)
                                        ) : (
                                          `$${value.toLocaleString()}`
                                        )
                                      ) : (
                                        String(value)
                                      )}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {activeTab === "Inhabilitado" &&
                isIhabilitado &&
                isIhabilitado.length > 0 && (
                  <div
                    className="
                      space-y-4 p-4
                      bg-red-50
                      rounded-lg
                    "
                  >
                    <div
                      className="
                        hidden overflow-x-auto
                        md:block
                      "
                    >
                      <table
                        className="
                          w-full
                          bg-white
                          border-collapse rounded-lg
                          shadow-sm
                        "
                      >
                        <thead>
                          <tr
                            className="
                              bg-red-100
                              border-b border-red-200
                            "
                          >
                            {Object.keys(
                              isIhabilitado[0].inhabilitaciones[0]
                            ).map((key) => (
                              <th
                                key={key}
                                className="
                                  p-3
                                  text-left text-xs font-semibold text-red-800 tracking-wide
                                  border-r border-red-200
                                  uppercase last:border-r-0
                                "
                              >
                                {key.replace(/_/g, " ")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {isIhabilitado[0].inhabilitaciones.map(
                            (inhabilitado, index) => (
                              <tr
                                key={index}
                                className="
                                  border-b border-red-100
                                  transition-colors
                                  hover:bg-red-25
                                "
                              >
                                {Object.entries(inhabilitado).map(
                                  ([key, value]) => (
                                    <td
                                      key={key}
                                      className="
                                        p-3
                                        text-sm
                                        border-r border-red-100
                                        last:border-r-0
                                      "
                                    >
                                      <span
                                        className="
                                          font-medium text-red-900
                                        "
                                      >
                                        {value === null ||
                                        value === undefined ? (
                                          <span
                                            className="
                                              text-slate-400
                                              italic
                                            "
                                          >
                                            null
                                          </span>
                                        ) : typeof value === "number" ? (
                                          key.toLowerCase().includes("rut") ||
                                          key.toLowerCase().includes("id") ? (
                                            String(value)
                                          ) : (
                                            `$${value.toLocaleString()}`
                                          )
                                        ) : (
                                          String(value)
                                        )}
                                      </span>
                                    </td>
                                  )
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile responsive cards for small screens */}
                    <div
                      className="
                        space-y-3 mt-4
                        md:hidden
                      "
                    >
                      {isIhabilitado[0].inhabilitaciones.map(
                        (inhabilitado, index) => (
                          <div
                            key={index}
                            className="
                              p-4
                              bg-white
                              rounded-lg border border-red-200
                              shadow-sm
                            "
                          >
                            <div
                              className="
                                mb-2
                                text-xs font-semibold text-red-600
                              "
                            >
                              Inhabilitado #{index + 1}
                            </div>
                            <div
                              className="
                                space-y-2
                              "
                            >
                              {Object.entries(inhabilitado).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="
                                      flex
                                      py-1
                                      border-b border-red-100
                                      justify-between items-center last:border-b-0
                                    "
                                  >
                                    <label
                                      className="
                                        text-xs font-medium text-slate-600 tracking-wide
                                        uppercase
                                      "
                                    >
                                      {key.replace(/_/g, " ")}
                                    </label>
                                    <span
                                      className="
                                        text-sm font-semibold text-red-700
                                      "
                                    >
                                      {value === null || value === undefined ? (
                                        <span
                                          className="
                                            text-slate-400
                                            italic
                                          "
                                        >
                                          null
                                        </span>
                                      ) : typeof value === "number" ? (
                                        key.toLowerCase().includes("rut") ||
                                        key.toLowerCase().includes("id") ? (
                                          String(value)
                                        ) : (
                                          `$${value.toLocaleString()}`
                                        )
                                      ) : (
                                        String(value)
                                      )}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAdd={handleAddAddress}
      />
      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onAdd={handleAddPhone}
        namedb={user[0]?.wallet}
        rut={user[0]?.vendor_id}
        ruteje={user[0]?.Rut_Ejecutivo}
        lead_id={user[0]?.lead_id}
      />
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onAdd={handleAddEmail}
        namedb={user[0]?.wallet}
        rut={user[0]?.vendor_id}
        ruteje={user[0]?.Rut_Ejecutivo}
        lead_id={user[0]?.lead_id}
      />

      {/* AlertDialog for empty RUT validation */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Campo Requerido</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor ingrese un RUT para realizar la búsqueda.
            </AlertDialogDescription>
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
