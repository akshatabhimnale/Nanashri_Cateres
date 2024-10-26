import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import NanashriCaterersForm from "./Quotation"; // Adjust the path if needed

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale is 0

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/logo.png")} // Adjust the path to your logo
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <Text style={styles.title}>What You Want To Create?</Text>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("CaterersForm", {
              formTitle: "Generate Quotation",
              pdfTitle: "Quotation",
            })
          }
        >
          <Text style={styles.buttonText}>Create Quotation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("CaterersForm", {
              formTitle: "Generate Bill",
              pdfTitle: "Bill",
            })
          }
        >
          <Text style={styles.buttonText}>Create Bill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CaterersForm" component={NanashriCaterersForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff", // Light blue background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  button: {
    backgroundColor: "#db5c5c", // Main button color
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    marginBottom: 20, // Space between logo and title
  },
});

export default App;
