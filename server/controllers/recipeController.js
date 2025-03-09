const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('authorId', 'username');
    
    if (recipe) {
      // Add authorName property for frontend display
      const recipeWithAuthor = {
        ...recipe._doc,
        authorName: recipe.authorId ? recipe.authorId.username : 'Unknown Chef',
        // Ensure authorId is properly included
        authorId: recipe.authorId ? recipe.authorId._id : null
      };
      
      res.json(recipeWithAuthor);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl, difficulty, cookingTime } = req.body;

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl: imageUrl || 'https://via.placeholder.com/350x250?text=No+Image+Available',
      difficulty: difficulty || 'Medium',
      cookingTime: cookingTime || '45',
      authorId: req.user._id
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl, difficulty, cookingTime } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the recipe author
    if (recipe.authorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this recipe' });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.imageUrl = imageUrl || recipe.imageUrl;
    recipe.difficulty = difficulty || recipe.difficulty;
    recipe.cookingTime = cookingTime || recipe.cookingTime;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the recipe author
    if (recipe.authorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this recipe' });
    }

    // Remove recipe from all users' saved recipes
    await User.updateMany(
      { savedRecipes: req.params.id },
      { $pull: { savedRecipes: req.params.id } }
    );

    // Delete the recipe
    await recipe.deleteOne();
    
    res.json({ message: 'Recipe removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save a recipe to user's collection
// @route   POST /api/recipes/:id/save
// @access  Private
const saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if recipe is already saved
    if (user.savedRecipes.includes(recipe._id)) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    // Add recipe to saved recipes
    user.savedRecipes.push(recipe._id);
    await user.save();

    res.json({ message: 'Recipe saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove a recipe from user's collection
// @route   DELETE /api/recipes/:id/save
// @access  Private
const unsaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove recipe from saved recipes
    user.savedRecipes = user.savedRecipes.filter(
      (recipeId) => recipeId.toString() !== req.params.id
    );
    
    await user.save();

    res.json({ message: 'Recipe removed from saved collection' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's saved recipes
// @route   GET /api/users/:id/saved
// @access  Private
const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedRecipes');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.savedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes
}; 