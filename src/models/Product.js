const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');
const ProductCategory = require('./ProductCategory');

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  use_in_menu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  price_with_discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Product',
  timestamps: true, 
});

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options' });
Product.hasMany(ProductCategory, { foreignKey: 'product_id', as: 'category_ids' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductCategory.belongsTo(Product, { foreignKey: 'product_id', as: 'category_ids' });

module.exports = Product;
