import express from "express";
import router from "./routes/router.js";
import { setupMiddlewares } from "./middlewares/setupMiddlewares.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { PORT_DATAHUB } from "./config/constantes.js";

const app = express();

setupMiddlewares(app);

app.use("/api", router);

app.use(errorHandler);

app.listen(PORT_DATAHUB, () => {
    console.log(`\n **Servidor rodando na porta** ${PORT_DATAHUB}`);
});
