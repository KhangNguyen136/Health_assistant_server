const express = require('express')

const PORT = process.env.PORT || 8080
const dialogflowController = require("./app/controllers/dialogflowController");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("./package.json");

var app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json())

//connect to db
const db = require("./app/models");
const searchOtherInfoController = require('./app/controllers/otherInfoController');
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

app.use('/test', dialogflowController.test);

app.use('/api/illness', require('./app/routes/illnessRoutes'));

app.use('/api/historyChat', require('./app/routes/historyChatRoutes'));

app.use('/api/thong_tin_khac', require('./app/routes/otherRoutes'));

app.use('/api/feedback', require('./app/routes/feedbackRoutes'));

app.post('/api/searchOtherInfo', searchOtherInfoController.searchOtherInfo)
// const textToSpeechController = require('./app/controllers/textToSpeechController');
// const { Server } = require("socket.io")
// app.post('/speechConverted', textToSpeechController.getResult);


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
        },],
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


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Interal Server Error',
        }
    })
});

console.log(`Docs available at http://localhost:${PORT}/api-docs`);


app.listen(PORT, () => console.log(`Listening on ${PORT}`))