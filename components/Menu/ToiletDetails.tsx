import React, { useState } from "react";
import {
  Text,
  Box,
  Divider,
  Modal,
  Heading,
  Badge,
  Button,
  AddIcon,
  CloseIcon,
} from "../core";
import { styles } from "../../styles";
import { LatLng } from "react-native-maps";
import { TouchableOpacity, View } from "react-native";
import { ILLMap } from "../../illustration";
import { Toilet } from "../../interfaces/Toilet";
import { ButtonIcon, ButtonText } from "@gluestack-ui/themed";
import { MapPin } from "lucide-react-native";
import ImageCarousel from "../ImageCarousel";
import ReviewList from "../ReviewList";

const getRandomText = () => {
  const texts = [
    "Lorem ipsum",
    "Consectetur ",
    "Sed do ",
    "Incididunt ",
    "Magna a",
    "Ut enim iam",
    "Quis nostitation",
    "Ullamisi",
    "Aliquip ex eaat",
    "Duis aute irure dolor",
  ];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
};

const randomText = getRandomText();

const images = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
];

export const PrimaryDetails = (details: Partial<Toilet>) => {
  return (
    <React.Fragment>
      <Box style={{ marginBottom: 10 }}>
        <Heading>{details.name}</Heading>
        <Text>{details.description}</Text>
        <Text>{details.address}</Text>
      </Box>
      <Divider />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        {details?.tags?.map((data, index) => (
          <Badge
            mr={10}
            key={index}
            mt={10}
            w={140}
            h={22}
            size="lg"
            variant="solid"
            borderRadius="$2xl"
            action="success"
          >
            <Badge.Text>{data}</Badge.Text>
            {/* <Badge.Icon as={data.icon} ml="$2" /> */}
          </Badge>
        ))}
      </Box>
      <Divider />

      <Box marginTop={10}>
        <Text>
          Opening Hours : {details?.openingTime} - {details.closingTime}
        </Text>
      </Box>
    </React.Fragment>
  );
};

export const ViewDetailsModal = (props: {
  showDetailsModal: boolean;
  closeModalDetails: VoidFunction;
  details: Toilet;
  onGetDirectionsPress?: VoidFunction;
}) => {
  const { showDetailsModal, closeModalDetails, details } = props;

  return (
    <React.Fragment>
      {showDetailsModal && (
        <Modal
          isOpen={showDetailsModal}
          onClose={closeModalDetails}
          closeOnOverlayClick={true}
        >
          <View style={styles.fullPageModalContent}>
            <View style={styles.detailsModalContent}>
              <TouchableOpacity
                onPress={closeModalDetails}
                style={{
                  alignSelf: "flex-end",
                  top: 0,
                  right: 0,
                }}
              >
                <CloseIcon size="md" color="black" />
              </TouchableOpacity>
              <PrimaryDetails {...details} />
              <View
                style={{
                  flex: 1,
                }}
              >
                <ImageCarousel images={images} />
                <ReviewList />
              </View>

              <View></View>
              <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                onPress={props?.onGetDirectionsPress}
                style={{
                  marginTop: "auto",
                  borderRadius: 16,
                  backgroundColor: "#262758",
                }}
              >
                <ButtonIcon as={MapPin} />
                <ButtonText>Get Directions </ButtonText>
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </React.Fragment>
  );
};

const MenuDetail = () => {
  const [selectedMarkerDetails, setSelectedMarkerDetails] = useState<LatLng>(
    {} as LatLng
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const closeModalDetails = () => {
    setShowDetailsModal(false);
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          marginRight: 2,
        }}
      >
        <Text style={{ flex: 1, marginLeft: 10 }}>{randomText}</Text>
        <Box
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <ILLMap />
          <TouchableOpacity
            style={styles.buttonContainer2}
            onPress={() => {
              setSelectedMarkerDetails({
                latitude: 0,
                longitude: 0,
              });
              setShowDetailsModal(true);
            }}
          >
            <Text style={styles.buttonText2}>View Details</Text>
          </TouchableOpacity>
        </Box>
      </Box>
      <Divider style={styles.divider} />

      {/* <ViewDetailsModal
        closeModalDetails={closeModalDetails}
        showDetailsModal={showDetailsModal}
        details={details}
      /> */}
    </>
  );
};

export default MenuDetail;
