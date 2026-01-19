import { useState } from "react";
import {
  Clock,
  FileText,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";

export function ManagementBoletas() {
  const { customerBoletas, customerManagement } = useCustomer();
  const [activeTab, setActiveTab] = useState<"gestiones" | "boletas">(
    "gestiones"
  );

  const [boletasPage, setBoletasPage] = useState(1);
  const [gestionesPage, setGestionesPage] = useState(1);
  const itemsPerPage = 10;

  const getGestionesColumns = () => {
    if (!customerManagement || customerManagement.length === 0) return [];

    const allKeys = new Set<string>();
    customerManagement.forEach((gestion) => {
      Object.keys(gestion).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys);
  };

  const getTicketColumns = () => {
    if (!customerBoletas || customerBoletas.length === 0) return [];

    const allKeys = new Set<string>();
    customerBoletas.forEach((ticket) => {
      Object.keys(ticket).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys);
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const gestionesColumns = getGestionesColumns();
  const gestionesTotalPages = Math.ceil(
    (customerManagement?.length || 0) / itemsPerPage
  );
  const gestionesStartIndex = (gestionesPage - 1) * itemsPerPage;
  const gestionesEndIndex = gestionesStartIndex + itemsPerPage;
  const currentGestiones =
    customerManagement?.slice(gestionesStartIndex, gestionesEndIndex) || [];

  const columns = getTicketColumns();
  const totalPages = Math.ceil((customerBoletas?.length || 0) / itemsPerPage);
  const startIndex = (boletasPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = customerBoletas?.slice(startIndex, endIndex) || [];

  const goToBoletasPage = (page: number) => {
    setBoletasPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToGestionesPage = (page: number) => {
    setGestionesPage(Math.max(1, Math.min(page, gestionesTotalPages)));
  };

  return (
    <div className="pt-6 border-t">
      <div className="flex overflow-hidden justify-center">
        <button
          onClick={() => setActiveTab("gestiones")}
          className={` py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "gestiones"
              ? "bg-blue-900 text-white"
              : "bg-cyan-800 text-white hover:bg-blue-500"
          }`}
        >
          <FileText className="h-4 w-4" />
          Gestiones ({customerManagement?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("boletas")}
          className={` py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "boletas"
              ? "bg-blue-900 text-white"
              : "bg-cyan-800 text-white hover:bg-blue-500"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Boletas ({customerBoletas?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6 p-6 bg-slate-50 rounded-lg min-h-[200px]">
        {activeTab === "gestiones" ? (
          <div>
            {!customerManagement || customerManagement.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  No hay gestiones registradas
                </h3>
                <p className="text-sm text-slate-500">
                  Las gestiones aparecerán aquí una vez que las guardes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg font-medium text-slate-700">
                    Gestiones Registradas ({customerManagement.length})
                  </h3>
                  <div className="text-sm text-slate-600">
                    Mostrando {gestionesStartIndex + 1}-
                    {Math.min(gestionesEndIndex, customerManagement.length)} de{" "}
                    {customerManagement.length} gestiones
                  </div>
                </div>

                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 sticky top-0">
                        <tr>
                          {gestionesColumns.map((column) => (
                            <th
                              key={column}
                              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b"
                            >
                              {column.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentGestiones.map((gestion, index) => (
                          <tr
                            key={gestionesStartIndex + index}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            {gestionesColumns.map((column) => (
                              <td
                                key={column}
                                className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap"
                              >
                                {formatCellValue(gestion[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {gestionesTotalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToGestionesPage(gestionesPage - 1)}
                        disabled={gestionesPage === 1}
                        className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, gestionesTotalPages) },
                          (_, i) => {
                            let pageNum;
                            if (gestionesTotalPages <= 5) {
                              pageNum = i + 1;
                            } else if (gestionesPage <= 3) {
                              pageNum = i + 1;
                            } else if (
                              gestionesPage >=
                              gestionesTotalPages - 2
                            ) {
                              pageNum = gestionesTotalPages - 4 + i;
                            } else {
                              pageNum = gestionesPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToGestionesPage(pageNum)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  gestionesPage === pageNum
                                    ? "bg-emerald-500 text-white"
                                    : "border border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() => goToGestionesPage(gestionesPage + 1)}
                        disabled={gestionesPage === gestionesTotalPages}
                        className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-slate-600">
                      Página {gestionesPage} de {gestionesTotalPages}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {!customerBoletas || customerBoletas.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  No hay boletas disponibles
                </h3>
                <p className="text-sm text-slate-500">
                  Las boletas aparecerán aquí cuando estén disponibles
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg font-medium text-slate-700">
                    Boletas Disponibles ({customerBoletas.length})
                  </h3>
                  <div className="text-sm text-slate-600">
                    Mostrando {startIndex + 1}-
                    {Math.min(endIndex, customerBoletas.length)} de {customerBoletas.length}{" "}
                    boletas
                  </div>
                </div>

                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 sticky top-0">
                        <tr>
                          {columns.map((column) => (
                            <th
                              key={column}
                              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b"
                            >
                              {column.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentTickets.map((ticket, index) => (
                          <tr
                            key={startIndex + index}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            {columns.map((column) => (
                              <td
                                key={column}
                                className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap"
                              >
                                {formatCellValue(ticket[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToBoletasPage(boletasPage - 1)}
                        disabled={boletasPage === 1}
                        className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (boletasPage <= 3) {
                              pageNum = i + 1;
                            } else if (boletasPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = boletasPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToBoletasPage(pageNum)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  boletasPage === pageNum
                                    ? "bg-emerald-500 text-white"
                                    : "border border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() => goToBoletasPage(boletasPage + 1)}
                        disabled={boletasPage === totalPages}
                        className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-slate-600">
                      Página {boletasPage} de {totalPages}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
