import React, { useRef, useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import { captureRef } from "react-native-view-shot";

const HtmlToJpg = () => {
  const viewRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const convertHtmlToJpg = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "jpg",
        quality: 1,
      });
      setImageUri(uri);
    } catch (error) {
      console.error("Error generating image:", error);
      Alert.alert("Error", "An error occurred while generating the image.");
    }
    };
    
    

  return (
    <View style={styles.container}>
      {/* View that contains the HTML content */}
      <View ref={viewRef} style={styles.htmlContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Sample HTML Content</Text>
          <Text>This content will be converted to a JPG image.</Text>
        </View>
      </View>

      <Button title="Convert to JPG" onPress={convertHtmlToJpg} />

      {/* Display the generated JPG image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  htmlContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default HtmlToJpg;
