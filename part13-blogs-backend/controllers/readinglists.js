const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
    const readingList = await ReadingList.create({
        blogId: req.body.blogId,
        userId: req.user.id
    });
    res.json(readingList);
});

router.put('/:id', async (req, res) => {
    const readingList = await ReadingList.findByPk(req.params.id);

    if (readingList && readingList.userId === req.user.id) {
        readingList.read = req.body.read;
        await readingList.save();
        res.json(readingList);
    } else {
        res.status(404).end();
    }
});

module.exports = router;
