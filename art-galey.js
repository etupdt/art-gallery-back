
const express = require('express')
const cors = require('cors')
const mariadb = require('mariadb');
const fs = require('fs');

// cors
const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
    ],
    allowedHeaders: [
        'Content-Type',
    ],
};

//Mariadb
const pool = mariadb.createPool({
    host: '192.168.1.37', 
    user:'denist', 
    password: 'Nove2015',
    database: 'common',
    connectionLimit: 5
});

//----------------------- Gestion des requêtes -----------------------

const app = express()

app.use(cors(corsOpts));

app.get('/', (req, res) => {

    console.log('get')

    pool.query("SELECT id, name, price, image from products")
    .then((products) => {
        res.send(products)
    })
    .catch((err) => {
        throw err;
    });

})

//------------------------ Démarrage HTTP ---------------------------

const portHttp = 3000
const http = require('http').Server(app);

http.listen(portHttp, () => {
    console.log(`Listening at http://localhost:${portHttp}`)
})

//------------------------ Démarrage HTTPS --------------------------

const portHttps = 3443

try {

    let optionsHttps = {
        key:  fs.readFileSync("./ssl/etupdt.fr_2023-01-03.key"),
        cert: fs.readFileSync("./ssl/etupdt.fr_2023-01-03.crt"),
        ca:   fs.readFileSync("./ssl/ca_bundle.crt")
    };

    const https = require('https').Server(optionsHttps, app);

    https.listen(portHttps, () => {
        console.log(`Listening at http://localhost:${portHttps}`)
    })

} catch (error) {
    console.log(`${error}`)
    console.log(`Https indisponible`)
}

