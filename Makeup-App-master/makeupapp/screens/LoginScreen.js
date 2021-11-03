import React, {Component} from 'react';
import {
        StyleSheet,
        Text,
        View,
        ImageBackground,
        TouchableOpacity,
        TextInput,
        Alert
        }
from 'react-native';
let util = require('./../Utilities');

export default class LoginScreen extends Component {    

    constructor(props) {
        super(props);
        this.state = {
            emailField: 'email',
            passwordField: 'password'
        }
    }        

    loginButtonPressed = async () => {
             
        if(!util.validateEmail(this.state.emailField)) {
            Alert.alert(
                'Invalid email address',
                'Enter valid email address',
                [
                    {text: 'OK'}                                                    
                ],
                {cancelable: false},
            );
        }
        else if(!util.validatePassword(this.state.passwordField)) {
            Alert.alert(
                'Invalid password',
                'Minimum password length is 8',
                [
                    {text: 'OK'}                                                    
                ],
                {cancelable: false},
            );
        }
        else {
            let constants = require('./../Constants');
            try {                        
                let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/check_login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: this.state.emailField,
                        password: this.state.passwordField
                    })
                });

                let jsonData = await res.json();
                let data = JSON.parse(jsonData);
                
                if(data.length > 0) {
                    console.log('Correct login');
                    console.log(data[0]);                
                    this.props.navigation.navigate(
                        'HomeScreen',
                        {
                            user: data[0]
                        }
                    );
                }
                else {
                    console.log('Wrong login');
                    console.log(data[0]);
                    Alert.alert(
                        'Incorrect Login',
                        'Email or Password is Incorrect',
                        [
                            {text: 'OK'}                                                    
                        ],
                        {cancelable: false},
                    );
                }            
            }
            catch(err) {
                console.log('error');
                Alert.alert(
                    'Some error occured',
                    'Please check you internet connection',
                    [
                        {text: 'OK'}                                                    
                    ],
                    {cancelable: false},
                );
            }
        }
                        
    }

    static navigationOptions = {
        header: null
    };

    render() {        

        return(
            <ImageBackground source = {require('../assets/bgi.png')} style = {styles.backgroundImage}>
                
                <View style = {{alignItems: 'flex-end'}}>
                    <View style = {styles.signupButtonContainer}>
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress = { () => {
                                this.props.navigation.navigate("SignupScreen");
                            }}
                            >
                            <Text style = {styles.signupText}> Sign Up </Text>
                        </TouchableOpacity>                
                    </View>
                </View>
                
                <View>
                    <View style ={styles.loginTextContainer}>
                        <Text style = {styles.loginText}>Login</Text>
                    </View>
                </View>

                <View style = {styles.loginFieldsContainer}>
                    <TextInput
                        style = {styles.loginField}
                        placeholder = 'Email'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({emailField: text})}}
                        >
                    </TextInput>
                    <TextInput
                        style = {styles.loginField}
                        secureTextEntry = {true}
                        placeholder = 'Password'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({passwordField: text})}}
                        >                        
                    </TextInput>
                </View>

                <View style ={styles.loginButtonContainer}>
                    <TouchableOpacity
                        style = {styles.loginButton}
                        onPress = {this.loginButtonPressed}>
                        <Text style = {styles.loginTextButton}>Login</Text>
                    </TouchableOpacity>
                </View>
                                
            </ImageBackground>
        );
    }

}

let styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    signupButton: {
        backgroundColor: 'rgba(52, 52, 52, 0.0)'
    },
    signupButtonContainer: {
        paddingTop: 30,
        paddingRight: 10,
        width: '23%',        
    },
    signupText: {
        color: '#ffffff',
        fontSize: 18
    },
    loginFieldsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 30
    },
    loginTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50        
    },
    loginText: {
        fontSize: 60,
        color: '#ffffff'
    },
    loginField: {
        color: '#ffffff',
        borderRadius: 4,
        marginTop: 15,
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 13,
    },
    loginButtonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        marginTop: 0
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '80%',
        backgroundColor: '#ffffff',
    },
    loginTextButton: {
        color: '#84356a',
        fontSize: 25,
    }
});