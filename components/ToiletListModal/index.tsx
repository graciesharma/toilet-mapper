import React from "react";
import {
  Modal,
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Toilet } from "../../interfaces/Toilet";
import { Button, CloseIcon } from "../core";
import { MapIcon, MapPin } from "lucide-react-native";

interface ToiletListModalProps {
  visible: boolean;
  onClose: () => void;
  toilets: Toilet[];
  onToiletSelect: (toilet: Toilet) => void;
}

const ToiletListModal: React.FC<ToiletListModalProps> = ({
  visible,
  onClose,
  toilets,
  onToiletSelect,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <TouchableOpacity
        onPress={onClose}
        style={{
          alignSelf: "flex-end",
          top: 10,
          right: 20,
        }}
      >
        <CloseIcon size="md" color="black" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Toilet List</Text>

        <FlatList
          data={toilets}
          keyExtractor={(toilet) => toilet.name}
          style={{
            width: "100%",
            padding: 12,
          }}
          renderItem={({ item }) => (
            <View style={styles.toiletItem}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.reviews}>
                  Reviews: {item.reviews.length}
                </Text>
              </View>
              <View>
                <Button
                  backgroundColor="#23256A"
                  onPress={() => onToiletSelect(item)}
                >
                  <MapPin color="white" />

                  <Text
                    style={{
                      color: "#fff",
                      borderRadius: 20,
                      marginLeft: 6,
                    }}
                  >
                    View Details
                  </Text>
                </Button>
              </View>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("window")?.height,
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  toiletItem: {
    padding: 10,
    borderStyle: "solid",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
  },
  name: {
    fontSize: 14,
  },
  address: {
    fontSize: 12,
  },
  reviews: {
    fontSize: 10,
  },
});

export default ToiletListModal;
