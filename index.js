const express = require("express");
const app = express();
const ordersRoute = require("./routes/orders.routes");

app.use(express.json());

app.use("/orders", ordersRoute);

const port = process.env.PORT | 6000;
app.listen(port, () => console.info(`orders-service listening on port ${port}...`));
