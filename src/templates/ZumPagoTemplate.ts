export const ZumpagoTemplate = `

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Instrucciones Zumpago</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f7f7f7;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .container {
      width: 600px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #003366;
    }
    .paso {
      background-color: #ffffff;
      border-left: 5px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .paso img {
      margin-top: 10px;
      width: 100%;
      height: auto;
      border: 1px solid #ccc;
    }
    a {
      color: #2196F3;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1 style="text-align: center;">PASO A PASO PARA INGRESAR A ZUMPAGO</h1>

    <div class="paso">
      <strong>Paso 1:</strong> Ingresar al portal 
      <a href="http://www.zumpago.cl" target="_blank">www.zumpago.cl</a> y seleccionar <strong>"PAGA AQUÍ"</strong>.
      <img src="https://email.tkonecta.cl/content/download.html?id=82783cfb-f6a4-4413-a02c-b3d0753502d0" alt="Imagen paso 1">
    </div>

    <div class="paso">
      Luego se abrirá una pestaña como la siguiente, donde debe seguir los pasos indicados en amarillo en la imagen.
      <img src="https://email.tkonecta.cl/content/download.html?id=4eb39905-8c18-48f8-a99c-83db85276de4" alt="Imagen paso 2">
    </div>

    <div class="paso">
      Posteriormente, el sistema le pedirá que ingrese su <strong>RUT</strong> para consultar la deuda.
      <img src="https://email.tkonecta.cl/content/download.html?id=3513066e-c31e-4f30-a3e2-542e8592127d" alt="Imagen paso 3">
    </div>

    <div class="paso">
      Finalmente, siga los pasos marcados para hacer efectivo el <strong>pago con descuento ofrecido</strong>.
      <img src="https://email.tkonecta.cl/content/download.html?id=595c8bc6-d760-449b-9dd2-d6f517c23304" alt="Imagen paso 4">
    </div>
  </div>

</body>
</html>

`

