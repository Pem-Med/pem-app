import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform,  } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import ChatList from '../../components/ChatList';
import Colors from '../../constants/Colors';
import { IconButton } from 'react-native-paper';
import RadioModal from '../../components/RadioModal';


/**
 * The ChatTabScreen component is the first thing in the hierarchy of the chat's functionality. It's the first thing 
 * a user sees when they click on the chat section, and is meant to display all the chat rooms
 */
const ChatTabScreen = (props) => {
    const radioOptions = [
        { label: 'Global Room', value: 0 },
        { label: 'Private', value: 1 }
    ];

    const [modalVisible, setModalVisible] = useState(false);

    //set up handler for button on header to open the modal
    const createHandler = useCallback(() => {
        setModalVisible(true);
    }, [setModalVisible]);

    useEffect(() => {
        props.navigation.setParams({ create: createHandler })
    }, [createHandler]);

    const navigateToCreate = (selectedOption) => {
        setModalVisible(false);
        if (selectedOption == 0) {
            props.navigation.navigate('AddRoom');
        } else {
            props.navigation.navigate('AddPrivateChat');
        }
    };

    return (
        <View style={styles.screen}>
            <ChatList navigation={props.navigation} ></ChatList>
            <RadioModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                onSubmit={navigateToCreate}
                radioOptions={radioOptions}
                headerText={'Choose the type of chat:'}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 5,
        paddingVertical: 5,
        backgroundColor: Colors.androidCustomWhite
    },
});


ChatTabScreen.navigationOptions = navigationData => {
    return {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white'

        },
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),

        headerRight: () => (
            <IconButton
                icon='message-plus'
                size={28}
                color={Platform.OS === 'android' ? Colors.white : Colors.primaryColor}
                onPress={navigationData.navigation.getParam('create')}
            />
        )
    }
};

export default ChatTabScreen; ChatTabScreen
