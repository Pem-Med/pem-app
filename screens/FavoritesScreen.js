import React from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';
import {HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';

const FavoritesScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The Favorites Screen!</Text>
            <Button title='Go Back' onPress={() => props.navigation.navigate({ routeName: 'Categories' })} />
        </View>
    );
};

FavoritesScreen.navigationOptions = navigationdata => {
    return {
        headerTitle: 'Favorite',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navigationdata.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),

    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default FavoritesScreen;
