import React from "react";
import { Text } from "react-native";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <React.Fragment>
      <Text style={styles.header}>Photos</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.thumbnail} />
        ))}
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    // marginBottom: 16,

    flex: 1,
  },
  thumbnail: {
    width: Dimensions.get("screen").width / 3,
    height: "100%",
    marginRight: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
});

export default ImageCarousel;
