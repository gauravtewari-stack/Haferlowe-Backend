// Admin Recipes Service - Handles all recipe-related admin API calls
import apiClient from '../api/client';

export const adminRecipesService = {
  // Get all recipes with pagination and filtering
  async getAll(params = {}) {
    const { page = 1, limit = 50, category, section, search, isActive } = params;
    const queryParams = { page, limit };
    if (category) queryParams.category = category;
    if (section) queryParams.section = section;
    if (search) queryParams.search = search;
    if (typeof isActive === 'boolean') queryParams.isActive = isActive;

    const response = await apiClient.get('/admin/recipes', queryParams);
    return response;
  },

  // Get recipe by ID
  async getById(id) {
    const response = await apiClient.get(`/admin/recipes/${id}`);
    return response;
  },

  // Create new recipe
  async create(recipeData) {
    // Transform the frontend format to API format
    const apiRecipeData = transformToApiFormat(recipeData);
    const response = await apiClient.post('/admin/recipes', apiRecipeData);
    return response;
  },

  // Update recipe
  async update(id, recipeData) {
    // Transform the frontend format to API format
    const apiRecipeData = transformToApiFormat(recipeData);
    const response = await apiClient.put(`/admin/recipes/${id}`, apiRecipeData);
    return response;
  },

  // Delete recipe
  async delete(id) {
    const response = await apiClient.delete(`/admin/recipes/${id}`);
    return response;
  },
};

// Transform frontend recipe format to API format
function transformToApiFormat(recipe) {
  return {
    name: recipe.title || recipe.name,
    description: recipe.instructions || recipe.description,
    imageUrl: recipe.image || recipe.imageUrl,
    prepTimeMinutes: recipe.prepTime || recipe.prepTimeMinutes,
    caloriesPerServing: recipe.calories || recipe.caloriesPerServing,
    servingsCount: recipe.servingsCount || 1,
    proteinGramsPerServing: recipe.protein || recipe.proteinGramsPerServing,
    carbohydratesGramsPerServing: recipe.carbs || recipe.carbohydratesGramsPerServing,
    fatGramsPerServing: recipe.fats || recipe.fatGramsPerServing,
    category: (recipe.category || '').toLowerCase(),
    sections: recipe.sections || [],
    ingredients: (recipe.ingredients || []).map((ing) => ({
      name: ing.name,
      quantity: Number(ing.amount) || ing.quantity || 0,
      unit: ing.unit || '',
      notes: ing.notes || '',
    })),
    preparationSteps: recipe.instructions
      ? recipe.instructions.split('\n').filter((s) => s.trim())
      : recipe.preparationSteps || [],
    isActive: recipe.isActive !== false,
  };
}

// Transform API recipe format to frontend format
export function transformFromApiFormat(apiRecipe) {
  return {
    id: apiRecipe.id || apiRecipe._id,
    title: apiRecipe.name,
    category: capitalizeFirst(apiRecipe.category || ''),
    calories: apiRecipe.caloriesPerServing || 0,
    protein: apiRecipe.proteinGramsPerServing || 0,
    carbs: apiRecipe.carbohydratesGramsPerServing || 0,
    fats: apiRecipe.fatGramsPerServing || 0,
    prepTime: apiRecipe.prepTimeMinutes || 0,
    tags: apiRecipe.sections || [],
    image: apiRecipe.imageUrl || '',
    ingredients: (apiRecipe.ingredients || []).map((ing) => ({
      name: ing.name || '',
      amount: ing.quantity || 0,
      unit: ing.unit || 'g',
    })),
    instructions: Array.isArray(apiRecipe.preparationSteps)
      ? apiRecipe.preparationSteps.join('\n')
      : apiRecipe.description || '',
    isActive: apiRecipe.isActive !== false,
  };
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default adminRecipesService;
