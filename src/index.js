const express = require('express');
const mongoose = require('mongoose');
const route = require('../src/routes/route');

const app = express();

app.use(express.json());


const port = 8000;

mongoose
  .connect(
    "mongodb+srv://ishaan:ishaan007@cluster1.wumfpap.mongodb.net/BookManagement001",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is Connected"))
  .catch((error) => {
    console.log(error);
  });

app.use('/',route);

app.all('/*',function(req,res){
    res.status(400).send({ status: false, message: "invalid http request" });
});

app.listen(port, function(){
     console.log("Express app running on port " + port);
})