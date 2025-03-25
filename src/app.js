const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const productRoutes = require('./routes/ProductRoutes');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

module.exports = app;
