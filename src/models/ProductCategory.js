const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');

class ProductCategory extends Model {}

ProductCategory.init({
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'ProductCategory',
});

module.exports = ProductCategory;
