import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { MealAPI } from "../../services/mealAPI";
import { useDebounce } from "../../hooks/useDebounce";
import { searchStyles } from "../../assets/styles/search.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debounceSearchQuery = useDebounce(searchQuery, 500);

  const performSearch = async (query) => {
    // for no search query give random meals
    if (query.trim() === "") {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
    }
    // search by name first, then by ingredients if no result

    const nameResults = await MealAPI.searchMealsByName(query);
    let results = nameResults;
    if (results.length === 0) {
      const ingredientResults = await MealAPI.searchMealsByIngredient(query);
      results = ingredientResults;
    }
    return results
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.log("Error fetching initial data:", error);
        setRecipes([]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialLoading) return;
    const handleSearch = async () => {
      try {
        setLoading(true);
        const results = await performSearch(debounceSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.log("Error fetching data:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debounceSearchQuery, initialLoading]);

  if (initialLoading) return <LoadingSpinner message="Loading recipes..." size="large" />;
  

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={24}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length}</Text>
        </View>

         {loading ? (
        <View style={searchStyles.loadingContainer}><LoadingSpinner message="Loading recipes..." size="small"/></View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} />
          )}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={searchStyles.row}
          contentContainerStyle={searchStyles.recipesGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoResultsFound />}

        />
          
       
      )}
      </View>

     
    </View>
  );
};

export default SearchScreen;

function NoResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
    <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>Try adjusting your search or try different keywords</Text>
    </View>
  );
}
