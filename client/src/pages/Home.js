import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../utils/apiConfig';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  
  const { isAuthenticated, user } = useContext(AuthContext);

  // Fetch all recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/recipes`);
        setRecipes(res.data);
        setFilteredRecipes(res.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recipes');
        setLoading(false);
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Fetch saved recipes if authenticated
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await axios.get(`${API_BASE_URL}/users/${user._id}/saved`);
          setSavedRecipes(res.data.map(recipe => recipe._id));
        } catch (error) {
          console.error('Error fetching saved recipes:', error);
        }
      }
    };

    fetchSavedRecipes();
  }, [isAuthenticated, user]);

  // Filter recipes based on search term and difficulty
  useEffect(() => {
    if (!recipes.length) return;
    
    let result = [...recipes];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(recipe => 
        recipe.title.toLowerCase().includes(term) || 
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term))
      );
    }
    
    // Filter by difficulty
    if (difficultyFilter !== 'All') {
      result = result.filter(recipe => recipe.difficulty === difficultyFilter);
    }
    
    setFilteredRecipes(result);
  }, [searchTerm, difficultyFilter, recipes]);

  // Handle save/unsave recipe
  const handleSaveToggle = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('All');
  };

  return (
    <div className="container">
      <div className="search-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search recipes by title or ingredients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control search-input"
          />
        </div>
        <div className="filter-options">
          <select 
            value={difficultyFilter} 
            onChange={handleDifficultyChange}
            className="form-control filter-select"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {(searchTerm || difficultyFilter !== 'All') && (
            <button 
              onClick={clearFilters}
              className="btn btn-light clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <h1>Discover Delicious Recipes</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="container alert alert-danger">{error}</div>
      ) : filteredRecipes.length === 0 ? (
        <div className="no-results">
          <p>No recipes found matching your criteria.</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onSave={handleSaveToggle}
              isSaved={savedRecipes.includes(recipe._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 