import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        Image,
        View,
        Button,
        ScrollView,
        Alert
        }
from 'react-native';
import SearchBox from '../SearchBox';

export default class ProductsBuyScreen extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            quantity: 3
        }
    }

    static navigationOptions = {
        header: null,        
    };

    addProductToCart = async () => {
        let constants = require('./../Constants');

        try {
            let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/add_product_to_cart', {
                method: 'POST',
                body: JSON.stringify({
                    productID: this.props.navigation.state.params.product.pk,
                    quantity: this.state.quantity,
                    userID: this.props.navigation.state.params.user.pk
                })
            });
            Alert.alert(
                'Product added to cart',
                'Please view your cart to checkout',
                [
                    {text: 'OK'}                                                    
                ],
                {cancelable: false},
            );
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
    render() {
        return(
            <ScrollView style = {styles.container}>

                <SearchBox></SearchBox>

                <View>

                    <View style = {{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                        <Text
                            style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                                {this.props.navigation.state.params.product.fields.name}
                        </Text>
                    </View>

                    <View>
                        <View>
                            <Image
                                source = {{uri: this.props.navigation.state.params.product.fields.img}}
                                style = {{width: '100%', height: 300}}
                            />
                        </View>                        
                        <View style = {{marginTop: 12, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                                Description
                            </Text>
                            <Text style = {{fontSize: 16}}>
                                {this.props.navigation.state.params.product.fields.description}
                            </Text>
                        </View>
                        <View style = {{marginTop: 12, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                                How to Use
                            </Text>
                            <Text style = {{fontSize: 16}}>
                                {this.props.navigation.state.params.product.fields.usage}
                            </Text>
                        </View>
                    </View>
                
                    <View style = {{marginTop: 20, marginBottom: 40}}>
                        <Button
                            title = "Add To Cart"
                            color = "#d519a5"
                            onPress = {() => {
                                this.addProductToCart();
                            }}
                        >
                        </Button>
                    </View>
                </View>                                                    

            </ScrollView>
        );
    }

}


let styles = StyleSheet.create({
    container: {
        padding: 15,
        marginTop: 20,
    }    
});