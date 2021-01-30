import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView,Text, Platform, TextInput, Button, Image, Alert, Modal, Icon } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddCmeScreen = props => {

    const [cert, setCert] = useState('');
    const [exp, setExp] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera roll permission is needed to upload pcitures. *Pictures are optional.');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const onSubmit = () => {
            props.onSubmit(cert, exp, image);
            console.log("It submitted!")
            console.log(cert);
            console.log(exp);
            console.log(image);
    };

    const onDismiss = () => {
        props.onDismiss();
    }

    return (
        <SafeAreaView >
        <ScrollView>
        <Modal visible={props.visible} animationType='slide' >
            <View style={styles.container}>
                <Text style={styles.title}>{props.header}</Text>

                {/* Name of certification */}
                {/* Start */}
                <View style={styles.rowItem}>
                    <Text style={styles.label}>Cert: </Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            maxLength={40}
                            multiline
                            onChangeText={text => setCert(text)}
                            value={cert}
                        />
                    </View>
                </View>

                {/* Date that certification expires */}
                {/* Start */}
                <View style={styles.rowItem}>
                    <Text style={styles.label}>Expires: </Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            maxLength={40}
                            multiline
                            onChangeText={text => setExp(text)}
                            value={exp}
                        />
                    </View>
                </View>
                {/* End */}
                
                {/* Pick and Add image */}
                {/* Start */}
                <View style={styles.rowItem}>
                    <Text style={styles.label}>Pick Image: </Text>
                    <Button title='pick an image' onPress={pickImage} />
                    <View style={styles.removeBtn}>
                        {image && <Button title='Remove' color='red' onPress={() => setImage(null)} />}
                    </View>
                </View>
                {/* End */}

                <View style={styles.imageContainer}>
                    {image && <Image borderRadius={20} source={{ uri: image }} style={styles.image} />}
                </View>

                <View style={styles.submit}>
                    <Button title='submit' onPress={onSubmit} />
                </View>

                <View style={styles.submit}>
                    <Button title='cancel' onPress={onDismiss} />
                </View>

                {/* End */}

            </View>
        </Modal>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 20
    },
    rowItem: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 19,
        paddingVertical: 20,
        paddingRight: 20
    },
    textInputContainer: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        width: 170
    },
    imageContainer: {
        alignItems: "center",
        color: 'red'
    },
    image: {
        width: 200,
        height: 200,
        margin: 20
    },
    removeBtn: {
        padding: 10
    },
    title: {
        fontSize: 30,
        marginBottom: 30,
        textAlign: 'center'
    },
    submit: {
        marginTop: 10
    }
});

export default AddCmeScreen;

