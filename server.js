const path = require('path');
const express = require('express');
const cors = require('cors');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirects to https if http
app.use((req, res, next) => {
  if (!req.secure) {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
  } else {
    next();  
  } 
});

// Bundled Static Files, and Raw static files used for preview.pug to get css because I don't know how to get dist css file hash programmatically
// Express sees index.html in dist as root of static files and it auto loads that so I don't have to explicitly set it
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', router);

app.listen(port, function() {
  console.log('Node.js listening ...');  
});

