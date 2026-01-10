const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./reading_list');
const Session = require('./session');

// One-to-many: User has many Blogs
User.hasMany(Blog);
Blog.belongsTo(User);

// Many-to-many: Users and Blogs through ReadingList
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' });

// One-to-many: User has many Sessions
User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
    Blog,
    User,
    ReadingList,
    Session
};
