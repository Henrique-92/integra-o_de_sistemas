const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const ProductOption = require('../models/ProductOption');
const ProductCategory = require('../models/ProductCategory')
const { Op } = require('sequelize');

const ProductController = {

  getProductList: async (req, res) => {
    try {
      const { limit = 12, page = 1, fields, match, category_ids,'price-range': priceRange,option,} = req.query;
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
  
      let queryOptions = {
        include: [
          { model: ProductCategory, as: 'category_ids' },
          { model: ProductImage, as: 'images' },
          { model: ProductOption, as: 'options' }
        ],
        where: {},
        limit: parsedLimit > 0 ? parsedLimit : undefined,
        offset: parsedLimit > 0 ? (parsedPage - 1) * parsedLimit : undefined
      };
  
      if (match) {
        queryOptions.where[Op.or] = [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } }
        ];
      }
  
      if (category_ids) {
        const categoryIdsArray = category_ids.split(',').map(id => parseInt(id, 10));
        queryOptions.include[0].where = { id: categoryIdsArray };
      }
  
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(price => parseFloat(price));
        queryOptions.where.price = { [Op.between]: [minPrice, maxPrice] };
      }
  
      if (option) {
        const optionsFilters = Object.entries(option).map(([key, value]) => ({
          [Op.and]: [
            { id: parseInt(key, 10) },
            { value: { [Op.in]: value.split(',') } }
          ]
        }));
        queryOptions.include[2].where = { [Op.or]: optionsFilters };
      }

      if (fields) {
        queryOptions.attributes = fields.split(',');
      }
  
      const products = await Product.findAndCountAll(queryOptions);
  
      res.status(200).json({
        data: products.rows,
        total: products.count,
        limit: parsedLimit,
        page: parsedPage,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          { model: ProductCategory, as: 'category_ids' },
          { model: ProductImage, as: 'images' },
          { model: ProductOption, as: 'options' }
        ]
      });
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { images, options, category_ids, ...productData } = req.body;

      const product = await Product.create(productData);

      if (images && images.length > 0) {
        const productImages = images.map(image => ({
          product_id: product.id,             
          path: `${image.type}`, 
                   
        }));
      
        await ProductImage.bulkCreate(productImages);  // Inserindo no banco de dados
      }
      

      if (options && options.length > 0) {
          const productOptions = options.map(option => ({
              product_id: product.id,
              title: option.title,
              shape: option.shape,
              radius: option.radius,
              type: option.type,
              values: option.values !== undefined ? option.values.toString() : undefined,
          }));
          await ProductOption.bulkCreate(productOptions);
      }

      if (category_ids && category_ids.length > 0) {
        const productCategories = category_ids.map(category_id => ({
          product_id: product.id,
          category_id
      }));
          await ProductCategory.bulkCreate(productCategories);
      }

      const createdProduct = await Product.findByPk(product.id, {
          include: [
              { model: ProductCategory, as: 'category_ids' },
              { model: ProductImage, as: 'images' },
              { model: ProductOption, as: 'options' },
          ]
      });

      createdProduct.category_ids= category_ids;

      res.status(201).json(createdProduct);
  } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
},

  updateProduct: async (req, res) => {
    try {
      const [updated] = await Product.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const product = await Product.findByPk(req.params.id, {
          include: [
            { model: ProductCategory, as: 'category_ids' },
            { model: ProductImage, as: 'images' },
            { model: ProductOption, as: 'options' }
          ]
        });
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await Product.findByPk(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
  
      await ProductCategory.destroy({ where: { product_id: productId } });
  
      await ProductImage.destroy({ where: { product_id: productId } });
  
      await ProductOption.destroy({ where: { product_id: productId } });
  
      await Product.destroy({ where: { id: productId } });
  
      res.status(204).json({ message: 'Produto deletado com sucesso' });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ProductController;
