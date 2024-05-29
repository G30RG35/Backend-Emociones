import db from '../config/db.js';

export const addRegistro = async (req, res) => {
    const { persona_id, fecha, emociones } = req.body;

    if (!persona_id || !fecha || !emociones) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        // Crear un nuevo registro semanal si no existe
        const semana = `${fecha.split('-')[0]}${new Date(fecha).getWeek()}`;
        const [registroSemana] = await db.execute(
            'SELECT id_registro FROM RegistrosSemanas WHERE id_persona = ? AND semana = ?',
            [persona_id, semana]
        );

        let id_registro;
        if (registroSemana.length === 0) {
            const [result] = await db.execute(
                'INSERT INTO RegistrosSemanas (id_persona, semana, fecha_registro) VALUES (?, ?, ?)',
                [persona_id, semana, fecha]
            );
            id_registro = result.insertId;
        } else {
            id_registro = registroSemana[0].id_registro;
        }

        // Insertar las emociones diarias
        const values = emociones.map(({ emocion_id, valor }) => [id_registro, emocion_id, fecha, valor]);
        const sql = 'INSERT INTO CalificacionesDiarias (id_registro, id_emocion, fecha, calificacion) VALUES ?';
        await db.query(sql, [values]);

        res.status(201).json({ message: 'Registro agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el registro', error);
        res.status(500).json({ error: 'Error al agregar el registro' });
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
        console.error('Error al obtener los registros', error);
        res.status(500).json({ error: 'Error al obtener los registros' });
    }
};
