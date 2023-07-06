const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path =require('path')

const app = express();
const { connection } = require('./connection/mongo-connection');
const cronJobs=require('./crons/payment-cron')
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connection();

app.use('/',require('./routers/index'));

const port = 8540;
app.listen(port, () => console.log(`Listening on port ${port}...`));