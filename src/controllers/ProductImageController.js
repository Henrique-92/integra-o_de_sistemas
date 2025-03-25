const ProductImage = require('../models/ProductImage');

const ProductImageController = {

createProductImage: async (req, res) => {
  try {
    const productImage = await ProductImage.create(req.body);
    res.status(201).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

getAllProductImages: async (req, res) => {
  try {
    const productImages = await ProductImage.findAll();
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

getProductImageById: async (req, res) => {
  try {
    const productImage = await ProductImage.findByPk(req.params.id);
    if (productImage) {
      res.status(200).json(productImage);
    } else {
      res.status(404).json({ message: 'Imagem de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

updateProductImage: async (req, res) => {
  try {
    const [updated] = await ProductImage.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const productImage = await ProductImage.findByPk(req.params.id);
      res.status(200).json(productImage);
    } else {
      res.status(404).json({ message: 'Imagem de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

deleteProductImage: async (req, res) => {
  try {
    const deleted = await ProductImage.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Imagem de produto deletada com sucesso' });
    } else {
      res.status(404).json({ message: 'Imagem de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

};
module.exports = ProductImageController;