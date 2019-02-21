const path = require('path');
const express = require('express');
const cors = require('cors');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.set('view engine', 'pug');

// Bundled Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// Raw Static Files, used for preview.pug view
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static(process.cwd() + '/public'));

app.listen(port, function() {
  console.log('Node.js listening ...');
  console.log('NODE_ENV: ' + process.env.NODE_ENV);
});

