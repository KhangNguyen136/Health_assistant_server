const express = require('express')

const PORT = process.env.PORT || 8080
const dialogflowController = require("./app/controllers/dialogflowController");
const illnessController = require("./app/controllers/illnessController");
const auth = require("./app/middleware/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("./package.json");

var app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json())

//connect to db
const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });


app.post("/dialogflow", dialogflowController.getMsg);



app.use('/api/illness', require('./app/routes/illnessRoutes'));




// api documents
var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version,
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{
            bearerAuth: [],
        }, ],
    },
    apis: ["./app/routes/*.js", "./app/models/*.js"],
}
const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

console.log(`Docs available at http://localhost:${PORT}/api-docs`);


app.listen(PORT, () => console.log(`Listening on ${PORT}`))