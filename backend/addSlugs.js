const mongoose = require('mongoose');
const Community = require('./models/Community');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log("Connected to DB");

    const communities = await Community.find();

    for (let c of communities) {
        if (!c.slug) {
            c.slug = c.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            await c.save();
            console.log(`Updated: ${c.name} → ${c.slug}`);
        }
    }

    console.log("All slugs added");
    process.exit();
})
.catch(err => console.log(err));