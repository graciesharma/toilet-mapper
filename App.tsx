import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Dimensions, Text, TouchableOpacity, Button } from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "./environment";
import React, { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import {
  Box,
  CloseIcon,
  Divider,
  GluestackUIProvider,
  Icon,
  Modal,
} from "./components";
import { config } from "./gluestack-ui.config";
import { styles } from "./styles";
import MenuDetail, {
  PrimaryDetails,
  ViewDetailsModal,
} from "./components/Menu/ToiletDetails";
import useLocation from "./hooks/useLocation";
import { Toilet } from "./interfaces/Toilet";
import { toilets } from "./mock";
import {
  ListIcon,
  Map,
  MapIcon,
  MapPin,
  SearchIcon,
} from "lucide-react-native";
import ToiletMarker from "./illustration/toilet-marker";
import SubmitButton from "./components/SubmitButton";
import navigateToMapsApp from "./utils/navigateToApp";
import ActionSheet from "./components/ActionSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ToiletListModal from "./components/ToiletListModal";
import LinkButton from "./components/LinkButton";

export const { width, height } = Dimensions.get("window");

export const HEIGHT = height;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

const generateRandomCoordinates = ({ currentLatitude, currentLongitude }) => {
  const DELTA = 0.03;
  const MAX_LATITUDE = currentLatitude + DELTA;
  const MIN_LATITUDE = currentLatitude - DELTA;
  const MAX_LONGITUDE = currentLongitude + DELTA;
  const MIN_LONGITUDE = currentLongitude - DELTA;
  const latitude = Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
  const longitude =
    Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;
  return { latitude, longitude };
};

const getLatLngDetails = ({ currentLatitude, currentLongitude }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(toilets.slice(0, 5));
    }, 1000);
  });
};

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en-GB",
          types: "(cities)", // default: 'geocode'
        }}
      />
    </>
  );
}

const Flex = () => {
  const numberOfItems = 8;

  return (
    <View style={styles.modalContainer}>
      {[...Array(numberOfItems)].map((_, index) => (
        <MenuDetail key={index} />
      ))}
    </View>
  );
};

export default function App() {
  const [showToiletListModal, setShowToiletListModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedToilets, setSelectedToilets] = useState<Array<Toilet>>(null);

  const [isFetchingToilets, setIsFetchingToilets] = React.useState(false);

  const fetchLatLng = React.useCallback(() => {
    const currentLatitude = location?.coords?.latitude;
    const currentLongitude = location?.coords?.longitude;
    setIsFetchingToilets(true);
    getLatLngDetails({ currentLatitude, currentLongitude })
      .then((value: Toilet[]) => {
        setSelectedToilets(value);
      })
      .catch(() => {})
      .finally(() => setIsFetchingToilets(false));
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args: any) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const closeModalDetails = () => {
    setShowDetailsModal(false);
  };

  const [showAutoCompleteButton, setShowAutoCompleteButton] = useState(false);

  const userLocation = useLocation();

  const [selectedToilet, setSelectedToilet] = React.useState<Toilet>(null);

  const handleMarkerPress = (toilet: Toilet) => {
    setSelectedToilet(toilet);
  };

  const ViewListButton = React.useCallback(() => {
    return (
      <TouchableOpacity
        style={{ ...styles.openModalButton, marginLeft: "auto" }}
        onPress={() => setShowToiletListModal(true)}
      >
        <Icon as={ListIcon} size="md" color="white" />
      </TouchableOpacity>
    );
  }, []);

  if (!location)
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Loading!!</Text>
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config.theme}>
        <View style={styles.container}>
          <ViewDetailsModal
            details={selectedToilet}
            closeModalDetails={() => setSelectedToilet(null)}
            showDetailsModal={!!selectedToilet && !showDirections}
            onGetDirectionsPress={() => setShowDirections(true)}
          />

          {location ? (
            <View
              style={{
                ...styles.mapContainer,
                height: showDirections ? "66.66%" : "100%",
                top: 0,
              }}
            >
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location?.coords?.latitude || 0,
                  longitude: location?.coords?.longitude || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                region={location}
                showsUserLocation={true}
                zoomEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: location?.coords?.latitude || 0,
                    longitude: location?.coords?.longitude || 0,
                  }}
                  title="Your Current Location"
                />

                {/* {origin && <Marker coordinate={currentLocation} />}
              {destination && <Marker coordinate={destination} />} */}

                {location && selectedToilet && showDirections && (
                  <MapViewDirections
                    origin={location?.coords}
                    destination={selectedToilet?.coords}
                    apikey={GOOGLE_API_KEY}
                    strokeColor="#232578"
                    strokeWidth={8}
                    onReady={traceRouteOnReady}
                  />
                )}
                {/* Render random markers  */}
                {!showDirections &&
                  selectedToilets?.map((marker, index) => (
                    <Marker
                      key={index}
                      coordinate={marker?.coords}
                      title={`Marker ass ${index + 1}`}
                      onPress={() => handleMarkerPress(marker)}
                    >
                      <Icon as={ToiletMarker} />
                    </Marker>
                  ))}
                {showDirections && (
                  <Marker coordinate={selectedToilet?.coords}>
                    <Icon as={MapPin} />
                  </Marker>
                )}
              </MapView>
            </View>
          ) : (
            <View
              style={{
                height: "100%",
                width: "100%",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Text>hi</Te> */}

              <Text>Loading...</Text>
            </View>
          )}

          <ActionSheet
            open={showDirections}
            onClose={() => {
              setShowDirections(false);
            }}
            actions={() => {
              return <ViewListButton />;
            }}
          >
            <PrimaryDetails {...selectedToilet} />
            <LinkButton
              text="View Details"
              onPress={() => setShowDirections(false)}
            ></LinkButton>
            <View
              style={{
                marginTop: "auto",
              }}
            >
              <SubmitButton
                //  @ts-expect-error
                onPress={() => {
                  navigateToMapsApp(location?.coords, selectedToilet?.coords);
                }}
                text="Open In Google maps"
                icon={MapIcon}
              />
            </View>
          </ActionSheet>

          <View style={styles.buttonsContainer}>
            {selectedToilets?.length > 0 && !showDirections && (
              <ViewListButton />
            )}
            {!showDirections ? (
              <>
                <View style={styles.currentAddressContainer}>
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    {userLocation ? userLocation : "Loading location..."}
                  </Text>
                </View>
                <SubmitButton
                  //  @ts-expect-error
                  onPress={fetchLatLng}
                  text="Search For toilets Nearby"
                  icon={SearchIcon}
                  isLoading={isFetchingToilets}
                />
              </>
            ) : null}
          </View>

          {showAutoCompleteButton ? (
            <View style={styles.searchContainer}>
              <>
                {/* <InputAutocomplete
                label="Origin"
                onPlaceSelected={(details) => {
                  onPlaceSelected(details, "origin");
                }}
              />
              <InputAutocomplete
                label="Destination"
                onPlaceSelected={(details) => {
                  onPlaceSelected(details, "destination");
                }}
              /> */}
                {/* <TouchableOpacity style={styles.button} onPress={traceRoute}>
                <Text style={styles.buttonText}>Trace route</Text>
              </TouchableOpacity> */}
                {distance && duration ? (
                  <View>
                    <Text>Distance: {distance.toFixed(2)}</Text>
                    <Text>Duration: {Math.ceil(duration)} min</Text>
                  </View>
                ) : null}
              </>
            </View>
          ) : null}

          <ToiletListModal
            toilets={selectedToilets}
            visible={showToiletListModal}
            onClose={() => setShowToiletListModal(false)}
            onToiletSelect={(toilet) => {
              setShowToiletListModal(false);
              setSelectedToilet(toilet);
            }}
          />

          {/* Second Modal */}

          <Modal isOpen={showDetailsModal} onClose={closeModalDetails}>
            <TouchableOpacity
              style={styles.fullPageModalContent}
              activeOpacity={1}
              onPress={closeModalDetails}
            >
              <View style={styles.detailsModalContent}>
                <Box bg="$rose100" p="$5">
                  <Text>This is the Box</Text>
                </Box>
                <Divider />
                <Box bg="$primary500" p="$5">
                  <Text>This is the Box</Text>
                </Box>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
