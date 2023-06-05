const express = require("express");
const app = express();
const {diSetup} = require("./di.setup");

diSetup().then(() => {
    
    app.use(express.json());
    app.use("/orders", require("./routes/orders.routes"));

})


const port = process.env.PORT | 6000;
app.listen(port, () => console.info(`orders-service listening on port ${port}...`));