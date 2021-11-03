import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        Image,
        View,
        Button,
        TouchableOpacity,
        TextInput,
        }
from 'react-native';

export default class SearchBox extends Component {    

    constructor(props) {
        super(props);
        this.state = {
            searchField: ''
        } 
    }    

    render() {
        return(
            <View style = {{width: '100%', alignItems: 'center'}}>
                <View style = {styles.logo}>
                    <Text style = {{fontSize: 25, fontWeight: 'bold', color: '#d519a5'}}>
                        Purple Pebbles
                    </Text>
                </View>
                <View style = {styles.searchBoxContainer}>
                    <TextInput
                        placeholder = "What are you looking for?"
                        style = {styles.searchBox}
                        onChangeText = {(text) => {this.setState({searchField: text})}}
                        onSubmitEditing = { () => {
                            this.props.navigate('HomeScreen');
                        }}
                    ></TextInput>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    container: {
        padding: 15,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        width: '100%'
    },
    searchBoxContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: '100%'
    },
    searchBox: {
        borderRadius: 4,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 13,
        height: 30
    }
});