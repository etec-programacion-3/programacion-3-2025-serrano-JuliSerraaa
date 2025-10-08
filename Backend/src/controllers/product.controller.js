// src/controllers/product.controller.js

import Product from '../models/products.js'; // Asegúrate que el modelo se llame 'products.js'

// --- 1. GET ALL PRODUCTS ---
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de productos.' });
  }
};

// --- 2. GET PRODUCT BY ID ---
export const getProductById = async (req, res) => {
  const { id } = req.params; // Captura el parámetro :id de la URL

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: `Producto con ID ${id} no encontrado.` });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

// --- 3. ADD NEW PRODUCT (CREATE) ---
export const addProduct = async (req, res) => {
  const { productName, productType, price } = req.body;

  try {
    const newProduct = await Product.create({
      productName,
      productType,
      price,
    });

    res.status(201).json({ 
      message: 'Producto agregado exitosamente.', 
      product: newProduct 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto.' });
  }
};

// --- 4. UPDATE PRODUCT (PUT) ---
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, productType, price } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: `Producto con ID ${id} no encontrado.` });
    }

    // Actualiza el producto
    product.productName = productName || product.productName;
    product.productType = productType || product.productType;
    product.price = price || product.price;

    await product.save();

    res.status(200).json({ 
        message: 'Producto actualizado exitosamente.', 
        product 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto.' });
  }
};

// --- 5. DELETE PRODUCT ---
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Product.destroy({
      where: { productId: id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: `Producto con ID ${id} no encontrado.` });
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
};