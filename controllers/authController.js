const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Aquí usarías una base de datos real, por ahora un array de ejemplo
let users = [];

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ error: 'Credenciales incorrectas.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Credenciales incorrectas.' });
        }
        // Crea un token JWT
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
};
