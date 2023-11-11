const mongoose = require("mongoose");
const User = require("./user");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Post", blogSchema);