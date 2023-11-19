import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { Icon } from "../core";
import { CameraIcon } from "lucide-react-native";
import { ImagePickerComponent } from "../ImagePicker";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [showPhotoUpload, setshowPhotoUpload] = useState(false);

  const ViewPhotoUpload = React.useCallback(() => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#262758",
          height: 40,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          marginLeft: "auto",
        }}
        onPress={() => setshowPhotoUpload(true)}
      >
        <Icon as={CameraIcon} size="md" color="white" />
      </TouchableOpacity>
    );
  }, []);
  return (
    <React.Fragment>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={styles.header}>Photos</Text>

        <ViewPhotoUpload />
      </View>

      <ImagePickerComponent
        visible={showPhotoUpload}
        onImagePicked={(response) => {
          // Handle the picked image if needed
          console.log("Image picked:", response);
        }}
        onClose={() => setshowPhotoUpload(false)}
      />

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
