const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients are required']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/350x250?text=No+Image+Available'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  cookingTime: {
    type: String,
    default: '45'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema); 