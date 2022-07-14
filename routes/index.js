const router = require('express').Router();

const htmlRoutes = require('./html/homeRoutes');
const noteRoutes = require('./api/noteRoutes');

router.use('/', htmlRoutes);
router.use('/api/notes', noteRoutes);

module.exports = router;