const express = require('express');
const dotenv = require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');

        app.use(express.json());
        app.use('/api/shorten', urlRoutes);

        // Catch-all route for redirection
        // This should be the last route defined to avoid conflicts with API routes
        
        app.get('/:shortCode', async (req, res) => {
            try {
                const urlEntry = await Url.findOne({ where: { shortCode: req.params.shortCode } });

                if (urlEntry) {
                    urlEntry.accessCount += 1;
                    await urlEntry.save();
                    return res.redirect(301, urlEntry.url);
                }

                res.status(404).json({ message: 'Short URL not found' });
            } catch (error) {
                console.error('Error during redirection:', error);
                res.status(500).json({ message: 'Server Error' });
            }
        });

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
        
};

startServer();