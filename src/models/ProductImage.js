const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('../models/Product');

class ProductImage extends Model {}

ProductImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize, 
  modelName: 'ProductImage',
});

module.exports = ProductImage;
