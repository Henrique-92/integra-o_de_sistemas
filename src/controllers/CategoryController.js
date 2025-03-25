const Category = require('../models/Category');

const CategoryController = {
  getCategories: async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, use_in_menu } = req.query;

        const finalLimit = limit === '-1' ? null : parseInt(limit, 10);

        const offset = limit === '-1' ? null : (page - 1) * finalLimit;

        const attributes = fields ? fields.split(',') : null;

        const where = use_in_menu ? { use_in_menu: use_in_menu === 'true' } : {};

        const categories = await Category.findAll({
            where,
            attributes,
            limit: finalLimit,
            offset
        });

        const total = await Category.count({ where });

        res.status(200).json({
            data: categories,
            total,
            limit: finalLimit !== null ? finalLimit : -1,
            page: parseInt(page, 10)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

  getCategoryById: async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
          res.status(200).json(category);
        } else {
          res.status(404).json({ message: 'Categoria não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

  createCategory: async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

  updateCategory: async (req, res) => {
    try {
        const [updated] = await Category.update(req.body, {
          where: { id: req.params.id }
        });
        if (updated) {
          const category = await Category.findByPk(req.params.id);
          res.status(200).json(category);
        } else {
          res.status(404).json({ message: 'Categoria não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

  deleteCategory: async (req, res) => {
    try {
        const deleted = await Category.destroy({
          where: { id: req.params.id }
        });
        if (deleted) {
          res.status(204).json();
        } else {
          res.status(404).json({ message: 'Categoria não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
};

module.exports = CategoryController;
