var express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const { connectMongoDb } = require('./db/db_connection')


const app = express();

// Route-
const adminRouter = require('./routes/adminRoutes');
const movieRoute = require('./routes/movieRoute');

//  Connect MongoDB
connectMongoDb(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => console.log(`MongoDB Error ${error}`));

// Route

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.json({ message: "Welcome to our site!" });
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use('/api/admin', adminRouter);
app.use('/api/movie', movieRoute);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});



