import React, { useState } from "react";
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
import { Button, CloseIcon, Divider, Icon } from "../core";
import { FilterIcon, MapPin } from "lucide-react-native";
import Filter from "../Filter/FilterModal";

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
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <Modal visible={visible} animationType="slide">
      <View
        style={{
          margin: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "600" , marginRight: 10}}>Toilet List</Text>

          <TouchableOpacity
            style={{ ...styles.openModalButton, marginLeft: "auto" }}
            onPress={() => setShowFilterModal(true)}
          >
            <Icon as={FilterIcon} size="xs" color="white" />
          </TouchableOpacity>
          <Filter
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
          />
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={{
            marginLeft: "auto",
          }}
        >
          <CloseIcon size="md" color="black" />
        </TouchableOpacity>
      </View>

      <Divider />

      <View style={styles.container}>
        <FlatList
          data={toilets}
          keyExtractor={(toilet) => toilet.name}
          style={{
            width: "100%",
            padding: 15,
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
    fontSize: 16,
    fontWeight: "500",
  },
  address: {
    fontSize: 14,
  },
  reviews: {
    fontSize: 12,
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

export default ToiletListModal;
