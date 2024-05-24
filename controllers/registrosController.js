import db from '../config/db.js';

export const addRegistro = async (req, res) => {
    const { persona_id, fecha, emociones } = req.body;

    if (!persona_id || !fecha || !emociones || emociones.length !== 5) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }

    const sqlInsertRegistro = 'INSERT INTO Registros (persona_id, fecha) VALUES (?, ?)';
    const sqlInsertDetalle = 'INSERT INTO RegistroEmociones (registro_id, emocion_id, valor) VALUES (?, ?, ?)';

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute(sqlInsertRegistro, [persona_id, fecha]);
        const registro_id = result.insertId;

        await Promise.all(emociones.map(async (emocion) => {
            await connection.execute(sqlInsertDetalle, [registro_id, emocion.emocion_id, emocion.valor]);
        }));

        await connection.commit();

        res.status(201).json({ message: 'Registro agregado exitosamente' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al agregar el registro', error);
        res.status(500).json({ error: 'Error al agregar el registro' });
    } finally {
        connection.release();
    }
};

export const getRegistros = async (req, res) => {
    const { persona_id } = req.params;

    if (!persona_id) {
        return res.status(400).json({ error: 'ID de persona es requerido' });
    }

    const sqlGetRegistros = `
        SELECT r.id, r.fecha, re.emocion_id, e.nombre_emocion, re.valor 
        FROM Registros r 
        JOIN RegistroEmociones re ON r.id = re.registro_id 
        JOIN Emociones e ON re.emocion_id = e.id 
        WHERE r.persona_id = ?
    `;

    try {
        const [rows] = await db.execute(sqlGetRegistros, [persona_id]);

        const registros = rows.reduce((acc, row) => {
            const { id, fecha, emocion_id, nombre_emocion, valor } = row;
            const registroExistente = acc.find(r => r.id === id);
            const emocion = { emocion_id, nombre_emocion, valor };

            if (registroExistente) {
                registroExistente.emociones.push(emocion);
            } else {
                acc.push({ id, fecha, emociones: [emocion] });
            }

            return acc;
        }, []);

        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al obtener los registros', error);
        res.status(500).json({ error: 'Error al obtener los registros' });
    }
};
