import React from "react";
import {
  View,
  Button,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImagePicker, {
  ImagePickerResponse,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { CloseIcon } from "../core";

interface CustomImageLibraryOptions extends ImageLibraryOptions {
  title: string;
}

interface ImagePickerComponentProps {
  onClose: () => void;
  onImagePicked: (response: ImagePickerResponse) => void;
  visible: boolean;
}

export class ImagePickerComponent extends React.Component<ImagePickerComponentProps> {
  handleChoosePhoto = () => {
    const options: CustomImageLibraryOptions = {
      title: "Select Image",
      mediaType: "photo",
    };

    ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
      this.props.onImagePicked(response);
      this.props.onClose();
    });
  };

  handleTakePhoto = () => {
    const options: CustomImageLibraryOptions = {
      title: "Take Photo",
      mediaType: "photo",
    };

    ImagePicker.launchCamera(options, (response: ImagePickerResponse) => {
      this.props.onImagePicked(response);
      this.props.onClose();
    });
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={this.props.onClose}
            >
              <CloseIcon />
            </TouchableOpacity>

            <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
            <Button title="Take Photo" onPress={this.handleTakePhoto} />
            <Button title="Cancel" onPress={this.props.onClose} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
