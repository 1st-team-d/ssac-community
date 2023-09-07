const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('/views', 'views');
app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.render('login');
});

app.listen(PORT, () => {
  console.log('Database connection succeeded!');
  console.log(`http://localhost:${PORT}`);
});
