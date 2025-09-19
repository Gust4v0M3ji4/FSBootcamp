const express = require("express");
const app = express();
const PORT = 3030;

app.use(express.json());

const productsRouter = require("./products");
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
