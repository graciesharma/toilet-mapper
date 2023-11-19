import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-ratings"; // Import AirbnbRating from react-native-ratings
import { AddIcon, Button, EditIcon, Icon } from "../core";
import Review from "../ReviewModal";

// Sample data for reviews
const reviewsData = [

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
  const [showReviewModal, setshowReviewModal] = useState(false);

  const ViewReviewModal = React.useCallback(() => {
    return (
      <TouchableOpacity

        style={{ ...styles.openModalButton, marginLeft: "auto" }}
        onPress={() => setshowReviewModal(true)}
      >
        <Icon as={EditIcon} size="md" color="white" />
      </TouchableOpacity>
    );
  }, []);
  return (
    <View style={styles.container}>

      
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 30,
alignItems: "center",
        }}
      >
        <Text style={styles.reviewHeader}>Reviews</Text>
        <ViewReviewModal />

        <Review
            visible={showReviewModal}
            onClose={() => setshowReviewModal(false)}
          />

      
      </View>

      <FlatList
        data={reviewsData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            
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
  },
  reviewHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    
  },
  reviewContainer: {
    width: "auto",
    marginBottom: 16,
    borderStyle: "solid",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  openModalButton: {
    backgroundColor: "#262758",
    height: 35,
    width: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default ReviewList;
