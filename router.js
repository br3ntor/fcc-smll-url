const router = require('express').Router();
const controller = require('./controller');

router.get('/:id', controller.redirect);
router.get('/:id/p', controller.preview);
router.post('/new', controller.makeShortURL);

module.exports = router;
