import db from "../config/db.js";

export const addRegistro = async (req, res) => {
  const { persona_id, fecha, emociones } = req.body;

  if (!persona_id || !fecha || !emociones) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Crear un nuevo registro semanal si no existe
    const semana = `${fecha.split("-")[0]}${new Date(fecha).getWeek()}`;
    const [registroSemana] = await db.execute(
      "SELECT id_registro FROM RegistrosSemanas WHERE id_persona = ? AND semana = ?",
      [persona_id, semana]
    );

    let id_registro;
    if (registroSemana.length === 0) {
      const [result] = await db.execute(
        "INSERT INTO RegistrosSemanas (id_persona, semana, fecha_registro) VALUES (?, ?, ?)",
        [persona_id, semana, fecha]
      );
      id_registro = result.insertId;
    } else {
      id_registro = registroSemana[0].id_registro;
    }

    // Insertar las emociones diarias
    const values = emociones.map(({ emocion_id, valor }) => [
      id_registro,
      emocion_id,
      fecha,
      valor,
    ]);
    const sql =
      "INSERT INTO CalificacionesDiarias (id_registro, id_emocion, fecha, calificacion) VALUES ?";
    await db.query(sql, [values]);

    res.status(201).json({ message: "Registro agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar el registro", error);
    res.status(500).json({ error: "Error al agregar el registro" });
  }
};

// Función para obtener la semana del año de una fecha
Date.prototype.getWeek = function () {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getRegistrosUltimos7Dias = async (req, res) => {
  const { persona_id } = req.params;

  try {
    const sql = `
            SELECT e.nombre_emocion, SUM(cd.calificacion) AS total_calificacion
            FROM CalificacionesDiarias cd
            JOIN Emociones e ON cd.id_emocion = e.id_emocion
            JOIN RegistrosSemanas rs ON cd.id_registro = rs.id_registro
            WHERE rs.id_persona = ? AND cd.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY e.nombre_emocion
            ORDER BY total_calificacion DESC
        `;
    const [rows] = await db.execute(sql, [persona_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener los registros", error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
};

// Endpoint para obtener todas las semanas de un usuario
export const obtenerSemanasUsuario = async (req, res) => {
  const { persona_id } = req.params;

  try {
    // Consulta SQL para obtener todas las semanas del usuario
    const sql = `
            SELECT DISTINCT semana, fecha_registro
            FROM RegistrosSemanas
            WHERE id_persona = ?
            ORDER BY fecha_registro DESC
        `;
    const [rows] = await db.execute(sql, [persona_id]);

    // Crear un array para almacenar las opciones del select
    const options = rows.map((row) => {
      const { semana, fecha_registro } = row;
      const fecha = new Date(fecha_registro).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return { semana, fecha };
    });

    // Agregar la opción para la "semana actual" como valor predeterminado
    options.unshift({ semana: "actual", fecha: "Semana Actual" });

    // Enviar las opciones como respuesta
    res.status(200).json(options);
  } catch (error) {
    console.error("Error al obtener las semanas del usuario", error);
    res.status(500).json({ error: "Error al obtener las semanas del usuario" });
  }
};

export const buscarSemana = async (req, res) => {
  const { persona_id, semana_id } = req.params;

  try {
    // Realiza la búsqueda de la semana según el ID proporcionado
    const semanaEncontrada = await buscarSemanaEnBD(persona_id, semana_id);

    if (!semanaEncontrada) {
      return res.status(404).json({ error: "Semana no encontrada" });
    }

    res.status(200).json(semanaEncontrada);
  } catch (error) {
    console.error("Error al buscar la semana:", error);
    res.status(500).json({ error: "Error al buscar la semana" });
  }
};

export const buscarSemanaEnBD = async (persona_id, semana_id) => {
  try {
    // Realiza la consulta directamente a la base de datos para buscar la semana según el ID proporcionado
    const [rows] = await db.execute(
      "SELECT * FROM CalificacionesDiarias cd JOIN RegistrosSemanas rs ON cd.id_registro = rs.id_registro WHERE rs.id_persona = ? AND rs.semana = ?",
      [persona_id, semana_id]
    );

    // Si no se encontró ninguna fila, significa que la semana no existe
    if (rows.length === 0) {
      return null;
    }

    // Retorna las calificaciones encontradas para la semana
    return rows;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la búsqueda de la semana
    console.error("Error al buscar la semana en la base de datos:", error);
    throw error; // Opcional: relanza el error para que la función que llama pueda manejarlo
  }
};

export const getRegistrosPorSemanaYUsuario = async (req, res) => {
    const { persona_id, semana } = req.params;
  
    // Verificar si los parámetros están definidos
    if (!persona_id || !semana) {
      return res.status(400).json({ error: "Los parámetros persona_id y semana son obligatorios" });
    }
  
    try {
      const sql = `
        SELECT e.nombre_emocion, SUM(cd.calificacion) AS total_calificacion
        FROM CalificacionesDiarias cd
        JOIN Emociones e ON cd.id_emocion = e.id_emocion
        JOIN RegistrosSemanas rs ON cd.id_registro = rs.id_registro
        WHERE rs.id_persona = ? AND rs.semana = ?
        GROUP BY e.nombre_emocion
        ORDER BY total_calificacion DESC
      `;
      const [rows] = await db.execute(sql, [persona_id, semana]);
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error al obtener los registros", error);
      res.status(500).json({ error: "Error al obtener los registros" });
    }
  };
