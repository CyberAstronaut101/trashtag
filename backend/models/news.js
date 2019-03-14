const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedDate: { type: String }
});

module.exports = mongoose.model('News', todoSchema);

