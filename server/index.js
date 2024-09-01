const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./src/routes/User');
const quizRoutes = require('./src/routes/Quiz');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRoutes);
app.use(quizRoutes);

app.get('/', (req, res) => {
    res.status(200).send({ status: "success", msg: "API is working well." });
})

app.use((req, res, next) => {
    const err = Object.assign(Error("Endpoint not found"), { code: 404 });
    next(err);
})

app.use(errorHandler);

const port = process.env.PORT || 1000
app.listen(port, () => {
    mongoose.connect(process.env.DB_URL).then(() => console.log('Server is running :)')).catch((error) => console.log(error))
})
