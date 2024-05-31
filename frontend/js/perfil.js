// Función para decodificar el token JWT
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  let padding = "=".repeat((4 - (str.length % 4)) % 4);
  str += padding;
  let decodedString = atob(str);
  return JSON.parse(decodedString);
}

// Función para extraer los datos del token JWT
function decodeJWT(token) {
  let parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("El token JWT no es válido.");
  }
  let payload = base64UrlDecode(parts[1]);
  return payload;
}

// Obtener el token del almacenamiento local
let token = window.localStorage.getItem("token");

// Decodificar el token JWT para obtener los datos del usuario
let decodedPayload = decodeJWT(token);
const persona_id = decodedPayload.id_persona
$(document).ready(function () {

  $("#nuevoNombre").val(decodedPayload.nombre);
  $("#nuevoCorreo").val(decodedPayload.correo);
  // Evento al hacer clic en el botón de guardar
  $("#btnGuardar").click(function (event) {
    // Obtener los valores de los inputs
    event.preventDefault();
    const nuevoNombre = $("#nuevoNombre").val();
    const nuevoCorreo = $("#nuevoCorreo").val();

    // Objeto con los datos a enviar al servidor
    const nuevosDatosUsuario = {
        id:persona_id,
      nombre: nuevoNombre,
      correo: nuevoCorreo,
    };

    $.ajax({
        url: "http://localhost:3000/personas/usuario/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevosDatosUsuario),
        success: function (response) {
          console.log("Datos actualizados exitosamente:", response);
          // Borrar el token del localStorage
          window.localStorage.removeItem("token");
          // Redirigir al usuario a la pantalla de inicio de sesión
          window.location.href = "ruta/a/la/pagina/de/login.html";
        },
        error: function (xhr, status, error) {
          console.error("Error al actualizar los datos:", error);
          // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
        },
      });
      
  });
});
