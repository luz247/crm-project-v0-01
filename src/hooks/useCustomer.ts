import ApiWeb from '@/api/ApiWeb';
import type { Customer, Email, Management, Phone } from '@/interfaces/customer.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hook/useRedux';
import {
  onCustomerChecks,
  onClassifications,
  onCustomerInformation,
  onCustomerDiscount,
  onCustomerManagement,
  onCustomerPatents,
  onCustomerCuotas,
  onCustomerBoletas,
  onCustomerEmail,
  onCustomerPhone,
} from '@/store/customer/customerSlice';

export const useCustomer = () => {
  const dispatch = useAppDispatch();

  const {
    classifications,
    customerInformation,
    customerBoletas,
    customerManagement,
    customerDiscount,
    customerCuotas,
    customerPatents,
    customerChecks,
    customerEmails,
    customerPhones,
  } = useAppSelector((customer) => customer.customer);

  // TODO:acsa generals
  const getClassifications = async (path: string) => {
    try {
      console.log('llego', path);
      let data = [];

      if (path === 'pass') {
        data = await (await ApiWeb.get('/core/Classifications-pass/')).data;
      } else {
        data = (await ApiWeb.get(`core/generals-Classifications/`)).data;
      }

      dispatch(onClassifications(data));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onClassifications([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error(error.response);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:todas las carteras generals
  const getCustomerInformations = async (path: string, rut: string) => {
    try {
      const data = (
        await ApiWeb.get<Customer[]>(`/core/customer-information/${rut}/${path.toUpperCase()}/`)
      ).data;
      dispatch(onCustomerInformation(data));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerInformation([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:todas las carteras generals
  const getCustomerBoletas = async (path: string, rut: string) => {
    try {
      const data = (await ApiWeb.get(`/core/customer-boletas/${rut}/${path.toUpperCase()}/`))
        .data;
      dispatch(onCustomerBoletas(data));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerBoletas([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error(error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:todas las carteras generals
  const getCustomerManagement = async (path: string, rut: string) => {
    try {
      const data = (await ApiWeb.get(`/core/customer-management/${rut}/${path.toUpperCase()}/`))
        .data;
      dispatch(onCustomerManagement(data));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerManagement([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:todas las carteras
  const getCustomerDiscount = async (path: string, rut: string) => {
    try {
      const descuento = await (
        await ApiWeb.get(`/core/customer-discount/${rut}/${path}/`)
      ).data;
      dispatch(onCustomerDiscount(descuento));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerDiscount([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getCustomerCutoas = async (rut: string) => {
    try {
      return dispatch(
        onCustomerCuotas(await (await ApiWeb.get(`/avo/customer-cuotas/${rut}/`)).data),
      );
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerCuotas([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getCustomerPatentes = async (rut: string) => {
    try {
      const data = await (await ApiWeb.get(`/avo/customer-patentes/${rut}/`)).data;
      dispatch(onCustomerPatents(data));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerPatents([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getAutomaticCustomerPayments = async (ic: string) => {
    try {
      return (await ApiWeb.get(`/acsa/customer-automatic-payments/${ic}/`)).data;
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error(error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getCustomerInhabilitado = async (ic: string) => {
    try {
      return (await ApiWeb.get(`/acsa/customer-disabled/${ic}/`)).data;
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error('Error inesperado al obtener email:', error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getCustomerBillingGroup = async (ic: string) => {
    try {
      return await (
        await ApiWeb.get(`/acsa/customer-billing-group/${ic}/`)
      ).data;
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa
  const getCustomerCheks = async (rut: string) => {
    try {
      dispatch(
        onCustomerChecks(await (await ApiWeb.get(`/acsa/customer-checks/${rut}/`)).data),
      );
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerChecks([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error( error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:acsa simulacion convenio caido
  const getSimulationOfaFailedAgreement = async (rut: string) => {
    try {
      const simudata = await (await ApiWeb.get(`/acsa/customer-failed-agreement/${rut}/`)).data;

      console.log(simudata);
      return simudata;
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error(error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  // TODO:todas las carteras en generals
  const insertCustomerRecord = async ({
    lead_id,
    telefono,
    rut,
    ruteje,
    glosa,
    numdoc,
    monto,
    feccomp,
    estcomp,
    tipocomp,
    abono,
    modo,
    uniqueid,
    autoriza,
    Fecha_Agenda,
    autorizaDate,
    idrespuesta,
    fecha,
    prefix,
  }: Management) => {
    let statusInsert: number = 0;
    statusInsert = await (
      await ApiWeb.post(`/core/insert-data-customer/${prefix}/`, {
        lead_id,
        idrespuesta,
        rut,
        ruteje,
        telefono,
        glosa,
        numdoc,
        monto,
        feccomp,

        estcomp,
        fecha,
        tipocomp,
        abono,
        uniqueid,
        modo,
      })
    ).status;

    // si el cliente requiere volver a llamar
    if (idrespuesta === '5') {
      statusInsert = await (
        await ApiWeb.post(`/insert-callAgain/`, {
          Rut: rut,
          Ruteje: ruteje,
          Fecha_Gestion: fecha,
          Fecha_Agenda,
          Prefix: prefix,
          telefono,
          monto,
          glosa,
        })
      ).status;
    }

    // si el cliete autoriza otro llamado
    if (autoriza) {
      statusInsert = (
        await ApiWeb.post(`/insert-authorizesCall/`, {
          lead_id,
          telefono,
          rut,
          ruteje,
          glosa,
          numdoc,
          monto,
          feccomp,
          estcomp,
          tipocomp,
          abono,
          modo,
          uniqueid,
          Fecha_Agenda,
          idrespuesta,
          fecha,
          prefix,
          autorizo: 'si',
          autorizaDate,
        })
      ).status;
    }

    return statusInsert;
  };

  // TODO: insert mail

  const insertEmail = async (namedb: string, data: Email) => {
    const result = await ApiWeb.post(`/core/insert-data-email/${namedb}/`, { ...data });

    return result;
  };
  // TODO: insert phone
  const insertPhone = async (namedb: string, data: Phone) => {
    const result = await ApiWeb.post(`/core/insert-data-phone/${namedb.toUpperCase()}/`, {
      ...data,
    });

    return result;
  };

  // TODO: obtener mail

  const getEmail = async (rut: string, namedb: string) => {
    try {
      const result = await (
        await ApiWeb.get(`/core/customer-email/${rut}/${namedb.toUpperCase()}/`)
      ).data;
      dispatch(onCustomerEmail(result));
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerEmail([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error('Error inesperado al obtener email:', error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };
  // TODO: obtener phone
  const getPhone = async (rut: string, namedb: string) => {
    try {
      const result = (await ApiWeb.get(`/core/customer-phone/${rut}/${namedb.toUpperCase()}/`))
        .data;
      dispatch(onCustomerPhone(result));

      return result;
    } catch (error: any) {
      // 1. Verifica si es un error de respuesta HTTP y si el código es 404 o 400
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // No hacemos nada, ignoramos el error esperado.
        // Opcionalmente, puedes asignar un array vacío al estado para inicializarlo.
        dispatch(onCustomerPhone([]));
      } else {
        // 2. Si es cualquier otro error (500, error de red, etc.), lo mostramos.
        console.error('Error inesperado al obtener phone:', error);
        // También puedes mostrar el error.response.data si existe y es relevante.
        if (error.response) console.log(error.response.data);
      }
    }
  };

  return {
    //method
    getSimulationOfaFailedAgreement,
    getAutomaticCustomerPayments,
    getCustomerInhabilitado,
    getCustomerBillingGroup,
    getCustomerInformations,
    getCustomerManagement,
    insertCustomerRecord,
    getCustomerPatentes,
    getClassifications,
    getCustomerBoletas,
    getCustomerDiscount,
    getCustomerCutoas,
    getCustomerCheks,
    getPhone,
    getEmail,

    //property
    customerInformation,
    customerManagement,
    classifications,
    customerBoletas,
    customerDiscount,
    customerCuotas,
    customerPatents,
    customerChecks,
    insertEmail,
    insertPhone,
    customerEmails,
    customerPhones,
  };
};
