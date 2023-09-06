const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('/views', 'views');

app.listen(PORT, () => {
  console.log('Database connection succeeded!');
  console.log(`http://localhost:${PORT}`);
});
