const Url = require('../models/Url');

const createShortUrl = async (req, res) => {
    const { url } = req.body;

    if (!url || !url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
        return res.status(400).json({ message: 'Invalid or missing URL' });
    }

    try {
        const { nanoid } = await import('nanoid');
        let shortCode;
        do {
            shortCode = nanoid(7);
        } while (await Url.findOne({ where: { shortCode } }));

        const newUrl = await Url.create({ url, shortCode });

        res.status(201).json({
            id: newUrl.id,
            url: newUrl.url,
            shortCode: newUrl.shortCode,
            createdAt: newUrl.createdAt,
            updatedAt: newUrl.updatedAt,
        });
    } catch (error) {
        const statusCode = error.name === 'SequelizeUniqueConstraintError' ? 409 : 500;
        res.status(statusCode).json({ message: 'Server Error', error: error.message });
    }
};

const getUrlDetails = async (req, res) => {
    try {
        const urlEntry = await Url.findOne({ where: { shortCode: req.params.shortCode } });

        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        urlEntry.accessCount += 1;
        await urlEntry.save();

        res.status(200).json({
            id: urlEntry.id,
            url: urlEntry.url,
            shortCode: urlEntry.shortCode,
            createdAt: urlEntry.createdAt,
            updatedAt: urlEntry.updatedAt,
            accessCount: urlEntry.accessCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateShortUrl = async (req, res) => {
    const { url } = req.body;
 
    if (!url) {
        return res.status(400).json({ message: 'Please provide a URL' });
    }

    try {
        if (!url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
            return res.status(400).json({ message: 'Invalid URL format' });
        }

        const [numberOfAffectedRows, affectedRows] = await Url.update(
            { url },
            {
                where: { shortCode: req.params.shortCode },
                returning: true,
            }
        );

        if (numberOfAffectedRows === 0) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        const updatedUrl = affectedRows[0];

        res.status(200).json({
            id: updatedUrl.id,
            url: updatedUrl.url,
            shortCode: updatedUrl.shortCode,
            createdAt: updatedUrl.createdAt,
            updatedAt: updatedUrl.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteShortUrl = async (req, res) => {
    try {
        const deletedRowsCount = await Url.destroy({
            where: { shortCode: req.params.shortCode }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createShortUrl,
    getUrlDetails,
    updateShortUrl,
    deleteShortUrl,
};