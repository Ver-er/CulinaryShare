import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../utils/apiConfig';
import ConfirmDialog from '../components/ConfirmDialog';

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        console.log("Recipe data:", res.data); // Debug log
        setRecipe(res.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recipe details');
        setLoading(false);
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Check if recipe is saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await axios.get(`${API_BASE_URL}/users/${user._id}/saved`);
          const savedRecipeIds = res.data.map(recipe => recipe._id);
          setIsSaved(savedRecipeIds.includes(id));
        } catch (error) {
          console.error('Error checking if recipe is saved:', error);
        }
      }
    };

    checkIfSaved();
  }, [id, isAuthenticated, user]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      window.showToast('Please log in to save recipes', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      if (isSaved) {
        await axios.delete(`${API_BASE_URL}/recipes/${id}/save`);
        setIsSaved(false);
        window.showToast('Recipe removed from your collection', 'info');
      } else {
        await axios.post(`${API_BASE_URL}/recipes/${id}/save`);
        setIsSaved(true);
        window.showToast('Recipe saved to your collection', 'success');
      }
    } catch (error) {
      console.error('Error saving/unsaving recipe:', error);
      window.showToast('Failed to update saved recipes', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/recipes/${id}`);
      window.showToast('Recipe deleted successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      window.showToast('Failed to delete recipe', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return <div className="container alert alert-danger">{error || 'Recipe not found'}</div>;
  }

  // Check if the current user is the author of the recipe
  const isAuthor = isAuthenticated && user && recipe && 
    (typeof recipe.authorId === 'string' 
      ? recipe.authorId === user._id 
      : recipe.authorId && recipe.authorId.toString() === user._id);

  return (
    <div className="container recipe-details">
      <div className="recipe-header">
        <div className="recipe-title-section">
          <h1>{recipe.title}</h1>
          <div className="recipe-meta">
            <span className="recipe-author">By {recipe.authorName || 'Unknown Chef'}</span>
            <div className="recipe-difficulty">
              {recipe.difficulty || 'Medium'} • {recipe.cookingTime || '45'} min
            </div>
          </div>
        </div>
        <div className="recipe-actions">
          {isAuthenticated && (
            <button 
              onClick={handleSave} 
              className={`btn ${isSaved ? 'btn-light' : 'btn-primary'}`}
            >
              {isSaved ? 'Unsave' : 'Save Recipe'}
            </button>
          )}
          {isAuthor && (
            <>
              <button 
                onClick={() => navigate(`/edit-recipe/${id}`)} 
                className="btn btn-secondary"
              >
                Edit Recipe
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="btn btn-danger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-image-container">
          <img 
            src={recipe.imageUrl || 'https://via.placeholder.com/800x500?text=No+Image+Available'} 
            alt={recipe.title} 
            className="recipe-detail-image"
          />
          <div className="recipe-tags">
            <span className="recipe-tag">{recipe.difficulty || 'Medium'}</span>
            <span className="recipe-tag">{recipe.cookingTime || '45'} min</span>
            {recipe.tags && recipe.tags.map((tag, index) => (
              <span key={index} className="recipe-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="recipe-info">
          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-instructions">
            <h2>Instructions</h2>
            <div className="instructions-content">
              {recipe.instructions.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
      />
    </div>
  );
};

export default RecipeDetails; 