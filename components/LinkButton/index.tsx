import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LinkButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.linkContainer}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  linkText: {
    color: "blue", // Change the color to match your design
    textDecorationLine: "underline", // Add an underline to text
  },
});

export default LinkButton;
