import axios from 'axios';
interface CupCalles {
  user: string;
}
export const cupCall = async ({ user }: CupCalles) => {
  
  //const url = '/agc/api.php'; // Ajuste de la URL base
  const params = new URLSearchParams({
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_hangup',
    value: '1',
  });

  try {
    // console.log(url)
    const response = await fetch(
      `https://konectados.integradial.us/agc/api.php?${params.toString()}`,
      {
        method: 'GET',
        mode: 'no-cors', // Esto evita las restricciones de CORS, pero limita el acceso a la respuesta
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response);
    
    return response;
  } catch (error) {
    console.error('Error en cupCall:', error);
    throw error;
  }
};

interface Props {
  user: string;
  status: string;
}

export const dispoCall = async ({ user, status }: Props) => {



  
  //const url = '/agc/api.php'; // Ajuste de la URL base
  const params = new URLSearchParams({
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_status',
    value: status,
  });

  try {
    const response = await fetch(
      `https://konectados.integradial.us/agc/api.php?${params.toString()}`,
      {
        method: 'GET',
        mode: 'no-cors', // Esto evita las restricciones de CORS, pero limita el acceso a la respuesta
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

   
    return response;
  } catch (error) {
    console.error('Error en dispoCall:', error);
    throw error;
  }
};

interface MakeCalls {
  user: string;
  phono: string;
}
export const makeCall = async ({ user, phono }: MakeCalls) => {
  const params = new URLSearchParams({
    source: 'CRM',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_dial',
    value: phono,
    phone_code: '1',
    search: 'NO',
    preview: 'NO',
    focus: 'NO',
  });

  try {
    // Construcción de la URL con los parámetros
    const response = await fetch(
      `https://konectados.integradial.us/agc/api.php?${params.toString()}`,
      {
        method: 'GET',
        mode: 'no-cors', // Esto evita las restricciones de CORS, pero limita el acceso a la respuesta
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Con `mode: 'no-cors'`, no podrás acceder al cuerpo de la respuesta directamente
    console.log(response);

    
    // Si intentas acceder a `response.json()`, no funcionará porque el modo `no-cors` clasifica la respuesta como "opaque"
    return response;
  } catch (error) {
    console.error('Error en makeCall:', error);
    throw error;
  }
};
interface MakeCalls {
  user: string;
  notificationText: string;
}

export const sendNotification = async ({ user, notificationText }: MakeCalls) => {
  const params = {
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'send_notification',
    recipient: user,
    recipient_type: 'USER',
    notification_text: encodeURIComponent(notificationText),
  };

  try {
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/proxy/', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error en sendNotification:', error);
    throw error;
  }
};
interface AuthUSer {
  user: string;
}
export const getInfoCall = async ({ user }: AuthUSer) => {
  const params = {
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    function: 'agent_status',
    agent_user: user,
    header: 'YES',
  };

  try {
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/non-agent-api/', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error en sendNotification:', error);
    throw error;
  }
};
