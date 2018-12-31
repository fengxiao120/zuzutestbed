var express = require('express');
var app = express();

app.use(express.static(__dirname +'./../../build/')); //serves the index.html
console.log(__dirname)
app.listen(3007); //listens on port 3007 -> http://localhost:3007/