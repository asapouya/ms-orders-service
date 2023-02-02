const express = require("express");
const app = express();
const ordersRoute = require("./routes/orders.routes");

const port = process.env.PORT | 6000;

app.use(express.json());

app.use("/orders", ordersRoute);

app.listen(port, () => console.info(`listening on port ${port}`));