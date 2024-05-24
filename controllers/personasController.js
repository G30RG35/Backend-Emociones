import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerPersona = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        // Generar la fecha de registro actual
        const fechaRegistro = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar la nueva persona en la base de datos
        const sql = 'INSERT INTO Personas (nombre, email, password, fecha_registro) VALUES (?, ?, ?, ?)';
        await db.execute(sql, [nombre, email, hashedPassword, fechaRegistro]);

        res.status(201).json({ message: 'Persona registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar la persona', error);
        res.status(500).json({ error: 'Error al registrar la persona' });
    }
};

export const loginPersona = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const sql = 'SELECT * FROM Personas WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        const persona = rows[0];
        const isPasswordValid = await bcrypt.compare(password, persona.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: persona.id, email: persona.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
