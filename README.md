<h1 align="center">
NOTES
</h1>
<p align="center">
MERN Stack
</p>


## Usage 

Notice, you need client and server runs concurrently in different terminal session, in order to make them talk to each other


## Client-side usage(PORT: 3000)

### Env Variables
Make Sure to Create a .env file in client directory and add appropriate variables in order to use the app.

Essential Variables 
REACT_APP_API_URL= example: localhost:3001/api
REACT_APP_IMAGES_URL= example: localhost:3001/images/
REACT_APP_CRYPT_SECRET_KEY= This have to be same the server variable


(You need to add something in .env, api url and other things)
```terminal
$ cd client          // go to client folder
$ yarn # or npm i    // npm install packages
$ npm run start        // run it locally

// deployment for client app
$ npm run start // this will run the files in docs, this behavior is exactly the same how gh-pages will run your static site
```

## Server-side usage

### Prepare your secret

(You need to add something in .env to connect to MongoDB and other things)

### Env Variables
Make Sure to Create a .env file in server directory and add appropriate variables in order to use the app.

Essential Variables 
PORT=
MONGO_URI=
RESET_PASSWORD_EXPIRE=
JWT_EXPIRE=
JWT_SECRET_KEY=
JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRE=
JWT_COOKIE_EXPIRE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_HOST=
SMTP_PORT=
CRYPT_SECRET_KEY=


### Start

```terminal
$ cd server   // go to server folder
$ npm i       // npm install packages
$ npm run dev // run it locally
```



# Dependencies
Client-side | Server-side
--- | ---
@emotion/react: ^11.11.1 |bcryptjs: ^2.4.3
@emotion/styled: ^11.11.0|body-parser: ^1.20.2
@mui/material: ^5.14.7 | cookie-parser: ^1.4.6
@reduxjs/toolkit: ^1.9.5 | cors: ^2.8.5
alertifyjs: ^1.13.1 | crypto-js: ^4.1.1
axios: ^1.4.0 | dotenv: ^16.3.1
bootstrap: ^5.3.1 | express: ^4.18.2
crypto-js: ^4.1.1 | express-async-handler: ^1.2.0
framer-motion: ^10.16.1 | express-mongo-sanitize: ^2.2.0
jwt-decode: ^3.1.2 |express-rate-limit: ^6.8.0
mdb-react-ui-kit: ^6.2.0 |helmet: ^7.0.0
react: ^18.2.0 |hpp: ^0.2.3
react-cookie: ^6.1.0 |jsonwebtoken: ^9.0.1
react-dom: ^18.2.0 |mongoose: ^7.5.0
react-icons: ^4.10.1 |multer: ^1.4.5-lts.1
react-quill: ^2.0.0 |nodemailer: ^6.9.4
react-redux: ^8.1.2 | path: ^0.12.7
react-router-dom: ^6.14.2 |xss-clean: ^0.1.4
react-scripts: 5.0.1 |nodemon: ^3.0.1
reactstrap: ^9.2.0 |
redux: ^4.2.1 |
universal-cookie: ^6.1.0 |
web-vitals: 2.1.4 |

# Screenshots of this project

Login page
![User visit public and Home page](https://i.imgur.com/cfmq8pu.png)

Dashboard
![User can sign in or sign up](https://i.imgur.com/Cv1txp1.png)

## BUGs or comments

[Create new Issues](https://github.com/29apo29/notes.project_29apo29/issues)

Email Me: abdullahergeni@yandex.com

## Author
[29apo29](https://twitter.com/29apo29)

[Demo](https://eclectic-klepon-7ca0f7.netlify.app/) 
