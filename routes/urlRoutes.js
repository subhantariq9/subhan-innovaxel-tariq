const express = require('express');
const router = express.Router();
const {
    createShortUrl,
    getUrlDetails,
    updateShortUrl,
    deleteShortUrl,
} = require('../controllers/urlController');

router.post('/', createShortUrl);
router.get('/:shortCode', getUrlDetails);
router.put('/:shortCode', updateShortUrl);
router.delete('/:shortCode', deleteShortUrl);

module.exports = router;