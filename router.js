const router = require('express').Router();
const controller = require('./controller');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date());
  next();
});

// define the home page route
router.get('/', (req, res) => res.sendFile(__dirname + '/dist/index.html'));
router.get('/shorturl/:id', controller.redirect);
router.get('/shorturl/:id/p', controller.preview);
router.post('/shorturl/new', controller.makeShortURL);

module.exports = router;
