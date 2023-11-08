import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AirbnbRating } from "react-native-ratings"; // Import AirbnbRating from react-native-ratings
import { AddIcon, Button } from "../core";

// Sample data for reviews
const reviewsData = [
  {
    text: "Great place, clean and well-maintained. Highly recommended!",
    rating: 5,
  },
  {
    text: "Decent restroom, but could be cleaner. 3 stars from me.",
    rating: 3,
  },
  {
    text: "Terrible experience, never going back. 1 star.",
    rating: 1,
  },
];

const ReviewList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Button
        backgroundColor="skyblue"
        //   onPress={() => onToiletSelect(item)}
        style={{
          marginVertical: 6,
          borderRadius: 8,
        }}
      >
        <AddIcon color="white" />

        <Text
          style={{
            color: "#fff",
            borderRadius: 20,
          }}
        >
          Add Review
        </Text>
      </Button>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={styles.reviewHeader}>Reviews</Text>

        <AirbnbRating
          count={5}
          defaultRating={4}
          size={20}
          showRating={false}
          isDisabled
        />
      </View>

      <FlatList
        data={reviewsData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            {/* <AirbnbRating
              count={5}
              defaultRating={item.rating}
              size={20}
              showRating={false}
              isDisabled
            /> */}
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 16,
  },
  reviewHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  reviewContainer: {
    marginBottom: 16,
    borderStyle: "solid",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});

export default ReviewList;
