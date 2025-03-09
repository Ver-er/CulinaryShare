import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../utils/apiConfig';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${user._id}/saved`);
        setSavedRecipes(res.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch saved recipes');
        setLoading(false);
        console.error('Error fetching saved recipes:', error);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  const handleSaveToggle = async (recipeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/recipes/${recipeId}/save`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      console.error('Error removing recipe from saved:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading saved recipes...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Your Saved Recipes</h1>
      
      {savedRecipes.length === 0 ? (
        <div>
          <p>You haven't saved any recipes yet.</p>
          <p>Browse recipes on the home page and click "Save" to add them to your collection.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {savedRecipes.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onSave={handleSaveToggle}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes; 