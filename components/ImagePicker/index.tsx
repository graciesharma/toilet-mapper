    import React from 'react';
    import { View, Button, Image, Modal, StyleSheet } from 'react-native';
    import ImagePicker, { ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';

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
        title: 'Select Image',
        mediaType: 'photo',
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
                {/* Your ImagePicker UI */}
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
            </View>
            </View>
        </Modal>
        );
    }
    }

    const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    });
