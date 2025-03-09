const express = require('express');
const router = express.Router();
const { 
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);

// Protected routes
router.post('/recipes', protect, createRecipe);
router.put('/recipes/:id', protect, updateRecipe);
router.delete('/recipes/:id', protect, deleteRecipe);

// Save/unsave routes
router.post('/recipes/:id/save', protect, saveRecipe);
router.delete('/recipes/:id/save', protect, unsaveRecipe);
router.get('/users/:id/saved', protect, getSavedRecipes);

module.exports = router; 