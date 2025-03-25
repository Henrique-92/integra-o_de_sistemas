const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserController = {

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: hashedPassword 
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const user = await User.findByPk(req.params.id);
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  generateToken: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


};

module.exports = UserController;
