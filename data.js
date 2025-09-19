let products = [
  {
    id: 1,
    name: "Laptop Gaming",
    description: "Laptop para gaming de alta gama",
    price: 1299.99,
    category: "Electronics",
    stock: 10,
  },
  {
    id: 2,
    name: "Mouse Inalámbrico",
    description: "Mouse ergonómico inalámbrico",
    price: 29.99,
    category: "Accessories",
    stock: 25,
  },
  {
    id: 3,
    name: "Teclado Mecánico",
    description: "Teclado mecánico RGB",
    price: 89.99,
    category: "Accessories",
    stock: 15,
  },
];

let data = {
  products,
  nextId: 4,
};

module.exports = data;
