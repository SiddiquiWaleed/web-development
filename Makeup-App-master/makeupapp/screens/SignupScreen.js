import React, {Component} from 'react';
import {
        StyleSheet,
        Text,
        View,
        ImageBackground,
        TouchableOpacity,
        KeyboardAvoidingView,
        TextInput,
        Alert
        }
from 'react-native';
let util = require('./../Utilities');

export default class LoginScreen extends Component {    

    constructor(props) {
        super(props);
        this.state = {
            nameField: 'Name',
            emailField: 'Email',
            passwordField: 'Password',
            confirmPasswordField: 'Confirm Password'
        }
    }    

    signupButtonPressed = async () => {
        if(!util.validateName(this.state.nameField)) {
            Alert.alert(
                'Invalid Name',
                'Minimum name length is 3',
                [
                    {text: 'OK'}                                                    
                ],
                {cancelable: false},
            );
        }
        else if(this.state.passwordField !== this.state.confirmPasswordField) {
            Alert.alert(
                'Password match error',
                'password and confirm password must be same',
                [
                    {text: 'OK'}                                                    
                ],
                {cancelable: false},
            );
        }
        else if(util.validatePassword(this.state.passwordField)) {
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
                let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/signup', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: this.state.nameField,
                        email: this.state.emailField,
                        password: this.state.passwordField,                    
                    })
                });                
                let jsonData = await res.json();
                let data = JSON.parse(jsonData);
                console.log(data);
                Alert.alert(
                    'Account created',
                    'Please log in to app to proceed',
                    [
                        {text: 'OK'}                                                    
                    ],
                    {cancelable: false},
                );
                this.props.navigation.navigate('LoginScreen');            
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
                <KeyboardAvoidingView behavior = "padding" enabled>
                <ImageBackground source = {require('../assets/bgi.png')} style = {styles.backgroundImage}>
                
                <View style = {{alignItems: 'flex-end'}}>
                    <View style = {styles.loginButtonContainer}>
                        <TouchableOpacity
                            style = {styles.loginButton}
                            onPress = {() => {
                                this.props.navigation.navigate("LoginScreen");
                            }}
                            >
                            <Text style = {styles.loginText}> Login </Text>
                        </TouchableOpacity>                
                    </View>
                </View>

                <View>
                    <View style = {styles.signupTextContainer}>
                        <Text style = {styles.signupText}>Signup</Text>
                    </View>
                </View>

                <View style = {styles.signupFieldsContainer}>

                    <TextInput
                        style = {styles.signupField}
                        placeholder = 'Name'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({nameField: text})}}
                        >
                    </TextInput>

                    <TextInput
                        style = {styles.signupField}
                        placeholder = 'Email'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({emailField: text})}}
                        >                        
                    </TextInput>

                    <TextInput
                        style = {styles.signupField}
                        secureTextEntry = {true}
                        placeholder = 'Password'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({passwordField: text})}}
                        >
                    </TextInput>

                    <TextInput
                        style = {styles.signupField}
                        secureTextEntry = {true}
                        placeholder = 'Confirm Password'
                        placeholderTextColor = 'rgba(255,255,255,0.7)'
                        onChangeText = {(text) => {this.setState({confirmPasswordField: text})}}                        
                        >
                    </TextInput>

                </View>

                <View style ={styles.signupButtonContainer}>
                    <TouchableOpacity
                        style = {styles.signupButton}
                        onPress = {this.signupButtonPressed}
                        >
                        <Text style = {styles.signupTextButton}>Signup</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
            </KeyboardAvoidingView>         
        );
    }
}

let styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    loginButton: {
        backgroundColor: 'rgba(52, 52, 52, 0.0)'
    },
    loginButtonContainer: {
        paddingTop: 30,
        paddingRight: 10,
        width: '23%',        
    },
    loginText: {
        color: '#ffffff',
        fontSize: 18
    },
    signupTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50        
    },
    signupText: {
        fontSize: 60,
        color: '#ffffff'
    },
    signupField: {
        color: '#ffffff',
        borderRadius: 4,
        marginTop: 15,
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 13,
    },
    signupFieldsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 30
    },
    signupButtonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        marginTop: 0
    },
    signupButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '80%',
        backgroundColor: '#ffffff',
    },
    signupTextButton: {
        color: '#84356a',
        fontSize: 25,
    }
});