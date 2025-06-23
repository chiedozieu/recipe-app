import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useClerk } from "@clerk/clerk-expo";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useClerk();
//  if (!isLoaded) return null
  
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Recipes",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
