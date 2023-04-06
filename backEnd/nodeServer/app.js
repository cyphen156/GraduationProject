const express = require('express');
const app = express();

app.use((request, response) => {
  response.send('<h1>HelloWorld</h1>');
});

app.listen(8080, () => {
  console.log("serverStarted");
});3