require('dotenv').config();
const express = require('express');
const customErrorHandler = require('./middleware/error/errorMiddleware');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require('hpp');
const cors = require('cors');
const route = require('./route');
const rateLimit = require("express-rate-limit");
const databaseConnection = require('./helper/database/databaseConnection');
const { encryptBody } = require('./middleware/crypt/cryptBody');
const CustomError = require('./helper/error/CustomError');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { PORT } = process.env;



//including express.json()
app.use(express.json());

app.use(express.static('public'))

// including body-parser
app.use(bodyParser.urlencoded({ extended: false }));

//Database connection
databaseConnection();


// Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Minutes
  max: 500
}));
app.use(hpp());
app.use(cors());


app.use(cookieParser());



//Using route file
app.use('/api', route)






// encrypting values before going
app.use(encryptBody);



//404
app.use('/*', (req, res, next) => {
  throw new CustomError("404 Not Founded", 404);
})


//Error handler
app.use(customErrorHandler);



//listening the app
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))