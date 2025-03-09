import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../utils/apiConfig';

const EditRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    imageUrl: '',
    difficulty: 'Medium',
    cookingTime: '45'
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { title, ingredients, instructions, imageUrl, difficulty, cookingTime } = formData;

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        
        // Check if user is the author
        if (res.data.authorId !== user?._id) {
          setFormError('You are not authorized to edit this recipe');
          return;
        }
        
        // Set form data
        setFormData({
          title: res.data.title || '',
          ingredients: res.data.ingredients || [''],
          instructions: res.data.instructions || '',
          imageUrl: res.data.imageUrl || '',
          difficulty: res.data.difficulty || 'Medium',
          cookingTime: res.data.cookingTime || '45'
        });
        
        setLoading(false);
      } catch (error) {
        setFormError('Failed to fetch recipe details');
        setLoading(false);
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...ingredients, ''] });
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: updatedIngredients });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !instructions || ingredients.some(ing => !ing.trim())) {
      setFormError('Please fill in all required fields');
      return;
    }

    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.trim());

    try {
      setIsSubmitting(true);
      setFormError('');
      
      const recipeData = {
        title,
        ingredients: filteredIngredients,
        instructions,
        imageUrl: imageUrl || undefined,
        difficulty,
        cookingTime
      };

      await axios.put(`${API_BASE_URL}/recipes/${id}`, recipeData);
      
      setSuccessMessage('Recipe updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/recipe/${id}`);
      }, 2000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container">Loading recipe...</div>;
  }

  if (formError === 'You are not authorized to edit this recipe') {
    return (
      <div className="container">
        <div className="alert alert-danger">{formError}</div>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2 className="form-title">Edit Recipe</h2>
      
      {formError && (
        <div className="alert alert-danger">{formError}</div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Recipe Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={title}
            onChange={handleChange}
            placeholder="Enter recipe title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Ingredients*</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
              <input
                type="text"
                className="form-control"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                required
              />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => removeIngredientField(index)}
                style={{ marginLeft: '10px' }}
                disabled={ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addIngredientField}
          >
            Add Ingredient
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="instructions">Instructions*</label>
          <textarea
            id="instructions"
            name="instructions"
            className="form-control"
            value={instructions}
            onChange={handleChange}
            placeholder="Enter cooking instructions"
            rows="6"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="form-control"
            value={imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              className="form-control"
              value={difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="cookingTime">Cooking Time (minutes)</label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              className="form-control"
              value={cookingTime}
              onChange={handleChange}
              min="5"
              max="300"
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Recipe'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-light"
            onClick={() => navigate(`/recipe/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe; 