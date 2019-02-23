const router = require('express').Router();
const controller = require('./controller');

router.get('/shorturl/:id', controller.redirect);
router.get('/shorturl/:id/p', controller.preview);
router.post('/shorturl/new', controller.makeShortURL);

module.exports = router;
