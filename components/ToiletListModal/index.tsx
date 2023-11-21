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
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          padding: 15,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Toilet List</Text>

        <TouchableOpacity
          style={{ ...styles.openModalButton, marginLeft: 15 }}
          onPress={() => setShowFilterModal(true)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 4,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "500",
                marginRight: 5,
                fontSize: 20,
              }}
            >
              Filter
            </Text>
            <Icon as={FilterIcon} size="xs" color="white" />
          </View>
        </TouchableOpacity>
        <Filter
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
        />

        <TouchableOpacity
          onPress={onClose}
          style={{
            marginLeft: "auto",
          }}
        >
          <CloseIcon size="xl" color="black" />
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
                  style={{ borderRadius: 10 }}
                  backgroundColor="#23256A"
                  onPress={() => onToiletSelect(item)}
                >
                  <MapPin color="white" />

                  <Text
                    style={{
                      color: "#fff",
                      borderRadius: 40,
                      marginLeft: 6,
                      fontWeight: "500",
                      fontSize : 15
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
    padding: 15,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    elevation: 3,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    color: "#8990A3",
  },
  openModalButton: {
    backgroundColor: "#262758",
    width: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default ToiletListModal;
