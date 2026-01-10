const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');

router.get('/', async (req, res) => {
    const where = {};

    if (req.query.search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${req.query.search}%` } },
            { author: { [Op.iLike]: `%${req.query.search}%` } }
        ];
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [['likes', 'DESC']]
    });

    res.json(blogs);
});

router.post('/', async (req, res) => {
    const user = req.user;
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
});

router.delete('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id);
    if (blog && blog.userId === req.user.id) {
        await blog.destroy();
    }
    res.status(204).end();
});

router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
        blog.likes = req.body.likes;
        await blog.save();
        res.json(blog);
    } else {
        res.status(404).end();
    }
});

module.exports = router;
