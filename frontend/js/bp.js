$(document).ready(function () {
  // Función para obtener los registros de los últimos 7 días
  const token = window.localStorage.getItem("token");
  let data = [];

  function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    let padding = "=".repeat((4 - (str.length % 4)) % 4);
    str += padding;
    let decodedString = atob(str);
    return JSON.parse(decodedString);
  }

  function decodeJWT(token) {
    let parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("El token JWT no es válido.");
    }
    let payload = base64UrlDecode(parts[1]);
    return payload;
  }

  let decodedPayload = decodeJWT(token);
  const persona_id = decodedPayload.id_persona;

  function obtenerRegistrosUltimos7Dias() {
    // Realizar la solicitud al endpoint
    $.ajax({
      url: `http://localhost:3000/registros/${persona_id}/ultimos7dias`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        // Manejar la respuesta exitosa
        data = response;
        console.log(data);
        actualizarPorcentajes(response);
      },
      error: function (xhr, status, error) {
        // Manejar errores
        console.error("Error al obtener los datos:", error);
      },
    });
  }

  function actualizarPorcentajes(data) {
    // Calcular el porcentaje de cada emoción
    data.forEach((emocion) => {
      if (emocion.nombre_emocion) {
        const total = emocion.total_calificacion;
        const porcentaje = (total / 70) * 100; // Dividir entre 70 y multiplicar por 100
        const idEmocion = emocion.nombre_emocion.toLowerCase();
        $(`#${idEmocion}`).find(".progress").css("width", `${porcentaje}%`);
        $(`#${idEmocion}`)
          .find(".label")
          .html(`${Math.round(porcentaje)}%<br>${emocion.nombre_emocion}`);
      }
    });
  }

  // Llamar a la función para obtener los registros de los últimos 7 días al cargar la página
  obtenerRegistrosUltimos7Dias();

  // Función para hacer la llamada al endpoint y llenar el select con las semanas del usuario
  function cargarSemanasUsuario() {
    $.ajax({
      url: `http://localhost:3000/registros/${persona_id}/semanas`,
      type: "GET",
      success: function (response) {
        const select = $("#semanasUsuario");
        select.empty(); // Vacía el select antes de agregar las nuevas opciones

        // Agrega las opciones para cada semana del usuario
        response.forEach((semana) => {
          select.append(
            `<option value="${semana.semana}">${semana.fecha}</option>`
          );
        });
      },
      error: function (xhr, status, error) {
        console.error("Error al cargar las semanas del usuario:", error);
      },
    });
  }

  // Llama a la función para cargar las semanas del usuario cuando el documento esté listo
  cargarSemanasUsuario();

  // Agregar evento para cargar los datos de la semana seleccionada
  $("#semanasUsuario").change(async function () {
    const semanaSeleccionada = $(this).val();
    if (semanaSeleccionada === "actual") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/registros/${persona_id}/semanapasada/${semanaSeleccionada}`
      );
      data = await response.json();
      console.log(data);
      actualizarPorcentajes(data);
      // Aquí puedes mostrar los datos de la semana seleccionada en la interfaz de usuario
    } catch (error) {
      console.error("Error al obtener los datos de la semana pasada:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    }
  });

  $("#recomendaciones").click(function () {
    function obtenerEmocionMaxima(data) {
      const emocionMaxima = data.reduce((max, emocion) => {
        return parseInt(emocion.total_calificacion) >
          parseInt(max.total_calificacion)
          ? emocion
          : max;
      }, data[0]);

      console.log(emocionMaxima);
      if (emocionMaxima.nombre_emocion === "Tristeza") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/res1.html";
      }

      if (emocionMaxima.nombre_emocion === "Ansiedad") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/res2.html";
      }

      if (emocionMaxima.nombre_emocion === "Estres") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/res3.html";
      }

      if (emocionMaxima.nombre_emocion === "Irritabilidad") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/res4.html";
      }

      if (emocionMaxima.nombre_emocion === "Desganado") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/res5.html";
      }

      if (emocionMaxima.nombre_emocion === "Alegría") {
        window.location.href = "http://127.0.0.1:5501/frontend/rec/resb.html";
      }
    }

    obtenerEmocionMaxima(data);
  });


});
