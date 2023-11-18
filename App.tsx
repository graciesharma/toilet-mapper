import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Dimensions, Text, TouchableOpacity, Button } from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import React, { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { EditIcon, GluestackUIProvider, Icon } from "./components";
import { config } from "./gluestack-ui.config";
import { styles } from "./styles";
import {
  PrimaryDetails,
  ViewDetailsModal,
} from "./components/Menu/ToiletDetails";
import useLocation from "./hooks/useLocation";
import { Toilet } from "./interfaces/Toilet";
import { toilets } from "./mock";
import {
  ListIcon,
  Map,
  FilterIcon,
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
import { GOOGLE_API_KEY } from "./environment";
import Filter from "./components/Filter/FilterModal";
import Review from "./components/ReviewModal";

export const { width, height } = Dimensions.get("window");

export const HEIGHT = height;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;

const getLatLngDetails = ({ currentLatitude, currentLongitude }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(toilets.slice(0, 5));
    }, 1000);
  });
};

export default function App() {
  const [showToiletListModal, setShowToiletListModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReviewModal, setshowReviewModal] = useState(false);

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

  const traceRouteOnReady = (args: any) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

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

  const ViewFilterButton = React.useCallback(() => {
    return (
      <TouchableOpacity
        style={{ ...styles.openModalButton, marginLeft: "auto" }}
        onPress={() => setShowFilterModal(true)}
      >
        <Icon as={FilterIcon} size="md" color="white" />
      </TouchableOpacity>
    );
  }, []);

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
                      title={`Marker ${index + 1}`}
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
              <>
                <ViewListButton />
                <ViewFilterButton />
                <ViewReviewModal />
              </>
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
          <ToiletListModal
            toilets={selectedToilets}
            visible={showToiletListModal}
            onClose={() => setShowToiletListModal(false)}
            onToiletSelect={(toilet) => {
              setShowToiletListModal(false);
              setSelectedToilet(toilet);
            }}
          />
          <Filter
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
          />

          <Review
            visible={showReviewModal}
            onClose={() => setshowReviewModal(false)}
          />
        </View>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
