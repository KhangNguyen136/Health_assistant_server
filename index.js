const express = require('express')

//set up for api document
// const swaggerUi = require('swagger-ui-express');
// const swaggerUi = require('swagger-jsdoc');
// const swaggerDocument = require('./app/swagger.json');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080
const dialogflowController = require("./app/controllers/dialogflowController");
const illnessController = require("./app/controllers/illnessController");

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

app.get("/", (req, res) => res.send('Health assistant server'));

app.use('/api/illness', require('./app/routes/illnessRoutes'));


// require("./app/routes/illnessRoutes")(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}`))