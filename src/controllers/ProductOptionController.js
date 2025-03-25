const ProductOption = require('../models/ProductOption');

const productOptionController = {

createProductOption: async (req, res) => {
  try {
    const productOption = await ProductOption.create(req.body);
    res.status(201).json(productOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

getAllProductOptions: async (req, res) => {
  try {
    const productOptions = await ProductOption.findAll();
    res.status(200).json(productOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


getProductOptionById: async (req, res) => {
  try {
    const productOption = await ProductOption.findByPk(req.params.id);
    if (productOption) {
      res.status(200).json(productOption);
    } else {
      res.status(404).json({ message: 'Opção de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

updateProductOption: async (req, res) => {
  try {
    const [updated] = await ProductOption.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const productOption = await ProductOption.findByPk(req.params.id);
      res.status(200).json(productOption);
    } else {
      res.status(404).json({ message: 'Opção de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

deleteProductOption: async (req, res) => {
  try {
    const deleted = await ProductOption.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Opção de produto deletada com sucesso' });
    } else {
      res.status(404).json({ message: 'Opção de produto não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};

module.exports = productOptionController;