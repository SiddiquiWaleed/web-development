import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        Image,
        View,
        Button,
        TouchableOpacity,
        }
from 'react-native';
import SearchBox from '../SearchBox';

export default class HomeScreen extends Component {    

    constructor(props) {
        super(props);
        this.state = {
            searchField: ''
        }
    }    

    static navigationOptions = {
        header: null,
    };    

    render() {
        return(
            <View style = {styles.container}>

                <SearchBox navigate = {this.props.navigation.navigate}>
                </SearchBox>                
                <View style = {{marginTop: 10}}>
                    <View style = {styles.bodyPartContainer}>
                        <View style = {styles.bodyPart}>
                            <TouchableOpacity
                                style = {styles.bodyPart}
                                onPress = { () => {
                                    this.props.navigation.navigate("CategoryListScreen",
                                    {
                                        bodypart: 'Eyes',
                                        user: this.props.navigation.state.params.user
                                    });
                                }}
                                >
                                <Image
                                    source = {require('./../assets/eyes.jpg')}
                                    style = {styles.bodyPartImage}                                
                                />
                                <Text style = {styles.bodyPartText}>Eyes</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.bodyPart}>
                            <TouchableOpacity
                                style = {styles.bodyPart}
                                onPress = { () => {
                                    this.props.navigation.navigate("CategoryListScreen",
                                    {
                                        bodypart: 'Face',
                                        user: this.props.navigation.state.params.user
                                    });
                                }}
                                >
                                <Image
                                    source = {require('./../assets/face.jpg')}
                                    style = {styles.bodyPartImage}
                                />
                                <Text style = {styles.bodyPartText}>Face</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style = {styles.bodyPartContainer}>
                        <View style = {styles.bodyPart}>
                            <TouchableOpacity
                                style = {styles.bodyPart}
                                onPress = { () => {
                                    this.props.navigation.navigate("CategoryListScreen",
                                    {
                                        bodypart: 'Lips',
                                        user: this.props.navigation.state.params.user
                                    });
                                }}
                                >
                                <Image
                                    source = {require('./../assets/lips.jpg')}
                                    style = {styles.bodyPartImage}
                                />
                                <Text style = {styles.bodyPartText}>Lips</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.bodyPart}>
                            <TouchableOpacity
                                style = {styles.bodyPart}
                                onPress = { () => {
                                    this.props.navigation.navigate("CategoryListScreen",
                                    {
                                        bodypart: 'Makeup',
                                        user: this.props.navigation.state.params.user
                                    });
                                }}
                                >
                                <Image
                                    source = {require('./../assets/nails.jpg')}
                                    style = {styles.bodyPartImage}
                                />
                                <Text style = {styles.bodyPartText}>Nails</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {{marginTop: 10}}>
                        <Button
                            title = "View Cart"
                            color = "#d519a5"
                            onPress = { () => {
                                this.props.navigation.navigate('Cart', {
                                    user: this.props.navigation.state.params.user
                                });
                            }}>
                        </Button>
                    </View>
                    
                    <View style = {{marginTop: 10}}>
                        <Button
                            title = "Sign out"
                            color = "#d519a5"
                            onPress = { () => {
                                this.props.navigation.navigate('LoginScreen');
                            }}>
                        </Button>
                    </View>
                    
                </View> 
            </View>
        );
    }
}

let styles = StyleSheet.create({
    logo: {
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
    },
    searchBox: {
        borderRadius: 4,
        borderWidth: 1,
        width: '180%',
        paddingHorizontal: 13,
        height: 30
    },
    bodyPartContainer: {
        flexDirection: "row",
    },
    bodyPart: {
        alignItems: "center",
        padding: 5
    },
    bodyPartText: {
        fontSize: 18
    },
    bodyPartImage: {
        width: 160,
        height: 130,
        borderRadius: 20
    },    
});