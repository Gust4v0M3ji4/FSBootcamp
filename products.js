const express = require("express");
const router = express.Router();
const data = require("./data");

router.post("/", (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        error: "Nombre y precio son obligatorios",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        error: "El precio debe ser mayor a 0",
      });
    }

    const newProduct = {
      id: data.nextId,
      name,
      description: description || "",
      price: Number(price),
      category: category || "General",
      stock: Number(stock) || 0,
    };
    data.nextId++;
    data.products.push(newProduct);
    console.log("Producto Creado correctamente: ");
    res.status(201).json({
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("Error: " + error);
  }
});

router.get("/", (req, res) => {
  res.json({
    message: "Lista de productos",
    products: data.products,
    total: data.products.length,
  });
  console.log("Se han encontrado productos");
});

router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID debe ser un número válido",
      });
    }

    const product = data.products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto encontrado", product });
    console.log("Usuario Encontrado Exitosamente");
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, category, stock } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID debe ser un número válido",
      });
    }

    const productIndex = data.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (price && price <= 0) {
      return res.status(400).json({ error: "El precio debe ser mayor a 0" });
    }
    const updatedProduct = {
      ...data.products[productIndex],
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price && { price: Number(price) }),
      ...(category && { category }),
      ...(stock !== undefined && { stock: Number(stock) }),
    };
    data.products[productIndex] = updatedProduct;
    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
    console.log("Producto: " + id + " ha sido actualizado correctamente");
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("Error: " + error);
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID debe ser un número válido",
      });
    }

    const productIndex = data.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const deletedProduct = data.products.splice(productIndex, 1)[0];
    res.json({
      message: "Producto eliminado exitosamente",
      product: deletedProduct,
    });
    console.log("Producto " + id + " ha sido eliminado");
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("Error: " + error);
  }
});

module.exports = router;
