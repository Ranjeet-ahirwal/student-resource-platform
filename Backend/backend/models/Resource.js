const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({

  title: String,

  description: String,

  file: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  downloads: {
    type: Number,
    default: 0
  },

  likes: {
    type: Number,
    default: 0
  },

  comments: [
    {
      text: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  embedding: {
  type: [Number],
  default: []
}

});

module.exports = mongoose.model("Resource", resourceSchema);