const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const MealAPI = {
  // search meals by name
  searchMealsByName: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.log("Error fetching meals:", error);
      return [];
    }
  },

  // get meal by ID
  getMealById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.log("Error fetching meal by ID:", error);
      return null;
    }
  },
  // get random meal

  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.log("Error fetching random meal:", error);
      return null;
    }
  },

  // get multiple random meals

  getRandomMeals: async (count = 6) => {
    try {
      const promises = Array(count)
        .fill()
        .map(() => MealAPI.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null);
    } catch (error) {
      console.log("Error fetching random meals:", error);
      return [];
    }
  },
  // list categories
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.log("Error fetching categories:", error);
      return [];
    }
  },

  // filter by ingredient
  filterByIngredient: async (ingredient) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.log("Error filtering by ingredient:", error);
      return [];
    }
  },

  // filter by category
  filterByCategory: async (category) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.log("Error filtering by category:", error);
      return [];
    }
  },
  // transform meal data to our app format

  transformMealData: (meal) => {
    if (!meal) return null;

    // extract ingredients from the meal object
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const measureText = measure && measure.trim() ? `${measure}` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    // extract instructions
    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from around the world",
      image: meal.strMealThumb,
      cookTime: "30 min",
      servings: 4,
      category: meal.strCategory || "Main course",
      area: meal.strArea,
      ingredients,
      instructions,
      originData: meal,
    };
  },
};
