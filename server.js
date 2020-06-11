const path = require('path');
const express = require('express');
const router = require('./router');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bundled Static Files, and Raw static files used for preview.pug to get css because I don't know how to get dist css file hash programmatically
// Express sees index.html in dist as root of static files and it auto loads that so I don't have to explicitly set it
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(router);

app.use((req, res) => {
  res.status(404).send('404: Page not Found');
});

app.listen(port, function () {
  console.log('Node.js listening ...');

  if (process.env.NODE_ENV === 'production') {
    console.log('We are running in production mode');
  } else {
    console.log('We are running in development mode');
  }
});
