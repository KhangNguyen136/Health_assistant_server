const express = require('express')

//set up for api document
// const swaggerUi = require('swagger-ui-express');
// const swaggerUi = require('swagger-jsdoc');
// const swaggerDocument = require('./app/swagger.json');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080
const dialogflowController = require("./app/controllers/dialogflowController");
const illnessController = require("./app/controllers/illnessController");
const auth = require("./app/middleware/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/swagger.json');

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


// require("./app/routes/illnessRoutes")(app);

// api documents
var options = {
    swaggerOptions: {
        url: "/api-docs/swagger.json",
    },
}
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serveFiles(null, options), swaggerUi.setup(null, options));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))