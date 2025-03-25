const express = require('express');
const categoryController = require('../controllers/CategoryController');
const router = express.Router();
const authenticateToken  = require('../middleware/authMiddleware');

router.get('/v1/category/search', categoryController.getCategories);
router.get('/v1/category/:id', categoryController.getCategoryById);
router.post('/v1/category', authenticateToken, categoryController.createCategory);
router.put('/v1/category/:id', authenticateToken, categoryController.updateCategory);
router.delete('/v1/category/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router;
