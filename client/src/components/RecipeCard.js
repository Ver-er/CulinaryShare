import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../utils/apiConfig';

const RecipeCard = ({ recipe, onSave, isSaved }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the save button
    
    if (!isAuthenticated) {
      window.showToast('Please log in to save recipes', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/recipes/${recipe._id}/save`);
      onSave(recipe._id);
      window.showToast(`"${recipe.title}" saved to your collection`, 'success');
    } catch (error) {
      console.error('Error saving recipe:', error);
      window.showToast('Failed to save recipe', 'error');
    }
  };

  const handleUnsave = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the unsave button
    
    try {
      await axios.delete(`${API_BASE_URL}/recipes/${recipe._id}/save`);
      onSave(recipe._id);
      window.showToast(`"${recipe.title}" removed from your collection`, 'info');
    } catch (error) {
      console.error('Error removing recipe from saved:', error);
      window.showToast('Failed to remove recipe', 'error');
    }
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id}`);
  };

  // Extract difficulty and cooking time if available
  const difficulty = recipe.difficulty || (recipe.ingredients && recipe.ingredients.length > 8 ? 'Medium' : 'Easy');
  const cookingTime = recipe.cookingTime || (difficulty === 'Easy' ? '30' : '45');

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-card-badge">{difficulty}</div>
      <img 
        src={recipe.imageUrl || 'https://via.placeholder.com/350x250?text=No+Image+Available'} 
        alt={recipe.title} 
      />
      <div className="recipe-card-content">
        <div className="recipe-card-author">
          {recipe.authorName && (
            <>
              <img 
                src={recipe.authorAvatar || 'https://via.placeholder.com/40x40?text=Chef'} 
                alt={recipe.authorName} 
                className="author-avatar" 
              />
              <span>Chef {recipe.authorName}</span>
            </>
          )}
        </div>
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-description">
          {recipe.description || 
            (recipe.ingredients && recipe.ingredients.length > 0
              ? `A delicious recipe with ${recipe.ingredients.length} ingredients`
              : 'No description available')}
        </p>
        <div className="recipe-card-meta">
          <span className="cooking-time">
            <i className="far fa-clock"></i> {cookingTime} min
          </span>
          <span className="difficulty">{difficulty}</span>
        </div>
        <div className="recipe-card-actions">
          {isSaved ? (
            <button 
              onClick={handleUnsave} 
              className="btn btn-light"
            >
              Unsave
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="btn btn-primary"
            >
              Save
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/recipe/${recipe._id}`);
            }} 
            className="btn btn-secondary"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 