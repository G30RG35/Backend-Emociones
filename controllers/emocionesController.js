import db from '../config/db.js';

export const addDefaultEmotions = async (req, res) => {
    const emociones = ['Alegría', 'Tristeza', 'Miedo', 'Desagrado', 'Furia'];
    const sql = 'INSERT INTO Emociones (nombre_emocion) VALUES (?)';

    try {
        await Promise.all(emociones.map(async (nombre_emocion) => {
            await db.execute(sql, [nombre_emocion]);
        }));
        res.status(201).json({ message: 'Emociones agregadas exitosamente' });
    } catch (error) {
        console.error('Error al agregar las emociones', error);
        res.status(500).json({ error: 'Error al agregar las emociones' });
    }

    
};

export const getTotalEmocionesUltimos7Dias = async (req, res) => {
    try {
        const sql = `
            SELECT e.nombre_emocion, SUM(re.valor) AS total_emocion
            FROM Registros r
            JOIN RegistroEmociones re ON r.id = re.registro_id
            JOIN Emociones e ON re.emocion_id = e.id
            WHERE r.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY e.nombre_emocion
        `;
        const [rows] = await db.execute(sql);

        const totalEmociones = {};
        rows.forEach(row => {
            totalEmociones[row.nombre_emocion] = row.total_emocion;
        });

        res.status(200).json(totalEmociones);
    } catch (error) {
        console.error('Error al obtener el total de emociones en los últimos 7 días', error);
        res.status(500).json({ error: 'Error al obtener el total de emociones en los últimos 7 días' });
    }
};