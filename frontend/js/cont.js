$(document).ready(function () {
    // Funciones para incrementar y decrementar
    window.increment = function (counterId) {
      let countElement = $(`#count${counterId}`);
      let count = parseInt(countElement.text());
      countElement.text(count + 1);
    };
  
    window.decrement = function (counterId) {
      let countElement = $(`#count${counterId}`);
      let count = parseInt(countElement.text());
      if (count > 0) {
        countElement.text(count - 1);
      }
    };
  
    const token = window.localStorage.getItem("token");
  
    function base64UrlDecode(str) {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      let padding = '='.repeat((4 - str.length % 4) % 4);
      str += padding;
      let decodedString = atob(str);
      return JSON.parse(decodedString);
    }
  
    function decodeJWT(token) {
      let parts = token.split('.');
      if (parts.length !== 3) {
          throw new Error('El token JWT no es válido.');
      }
      let payload = base64UrlDecode(parts[1]);
      return payload;
    }
  
    let decodedPayload = decodeJWT(token);
    const persona_id = decodedPayload.id_persona;
  
    // Función para aceptar y enviar los datos
    window.accept = function () {
      let emociones = [];
      for (let i = 1; i <= 6; i++) {
        let count = parseInt($(`#count${i}`).text());
        emociones.push({
          emocion_id: i, // Asumiendo que el ID de la emoción es el mismo que el contador
          valor: count,
        });
      }
  
      const fecha = $("#dateInput").val();
      if (!fecha) {
        alert('Por favor, selecciona una fecha.');
        return;
      }
  
      const data = {
        persona_id: persona_id,
        fecha: fecha,
        emociones: emociones
      };
  
      console.log(data);
      // Envía los datos al backend
      $.ajax({
        url: "http://localhost:3000/registros", // URL del endpoint de registros
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          // Maneja la respuesta exitosa aquí
          console.log("Datos guardados exitosamente:", response);
          alert("Datos guardados exitosamente");
        },
        error: function (xhr, status, error) {
          // Maneja los errores aquí
          console.error("Error al guardar los datos:", error);
          alert("Error al guardar los datos: " + xhr.responseJSON.error);
        },
      });
    };
  });
  