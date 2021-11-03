import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        Image,
        View,
        Button,
        TextInput,
        ScrollView,
        Alert
        }
from 'react-native';
import SearchBox from '../SearchBox';

export default class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tempProductsList: [],
            productsList: [],
            addressField: '',
            phoneNumberField: '',            
            totalPrice: 0,
            arrayOfProducts: []
        }
    }

    updateTotalPrice = (plurOrMinus, p) => {
        let currentPrice = this.state.totalPrice;
        if(currentPrice >= 0) {
            if(plurOrMinus === 'plus') {
                let newPrice = currentPrice + p.product.fields.price;
                this.setState({totalPrice: newPrice});
            }
            else {
                let newPrice = currentPrice - p.product.fields.price;
                this.setState({totalPrice: newPrice});
            }                
        }        
    }

    plusQuantity = (p) => {
        let dupli = [];
        for(let i = 0; i < this.state.arrayOfProducts.length; i++) {
            if(! (p.product.pk === this.state.arrayOfProducts[i].product.pk)) {
                dupli.push(this.state.arrayOfProducts[i]);
            }
            else {
                dupli.push(this.state.arrayOfProducts[i]);
                dupli[i].quantity += 1;
            }
        }
        this.setState({arrayOfProducts: dupli});
        this.updateTotalPrice('plus', p);
    }

    minusQuantity = (p) => {
        let dupli = [];
        for(let i = 0; i < this.state.arrayOfProducts.length; i++) {
            if(! (p.product.pk === this.state.arrayOfProducts[i].product.pk)) {
                dupli.push(this.state.arrayOfProducts[i]);
            }
            else {
                dupli.push(this.state.arrayOfProducts[i]);
                if(dupli[i].quantity > 0) {
                    dupli[i].quantity -= 1;
                }                
            }
        }
        this.setState({arrayOfProducts: dupli});
        this.updateTotalPrice('minus', p);
    }

    async componentDidMount() {
        this.getCart();
    }    

    checkCart = () => {
        if(this.state.arrayOfProducts.length == 0) {
            return(
                <View style = {{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                    <Text style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                        Your cart is empty
                    </Text>
                </View>
            );
        }        
    }

    getCart = async () => {
        let constants = require('./../Constants');

        try {
            let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/get_cart', {
                method: 'POST',
                body: JSON.stringify({                                    
                    userID: this.props.navigation.state.params.user.pk
                })
            });

            let jsonData = await res.json();            
            let data = JSON.parse(jsonData);

            if(data.length > 0) {
                let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/get_cart_products', {
                    method: 'POST',
                    body: JSON.stringify({                                    
                        cartProductsList: data[0].fields.product
                    })
                });

                let jsonData = await res.json();
                
                this.setState({tempProductsList: jsonData});

                let cartData = [];
                for(let i = 0; i < this.state.tempProductsList.length; i++) {
                    let foo = JSON.parse(this.state.tempProductsList[i]);
                    cartData.push(foo[0]);
                }              

                this.setState({productsList: cartData});
                
                let dupli = [];
                for(let i = 0; i < this.state.productsList.length; i++) {
                    dupli.push({product: this.state.productsList[i], quantity: 0});
                }
                
                this.setState({arrayOfProducts: dupli});

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

    sendEmail = async () => {
        if(this.state.arrayOfProducts.length == 0) {
            Alert.alert(
                'Cannot Order',
                'Your cart is empty. Please add products first to order',
                [
                    {text: 'OK',
                    onPress: () => {
                        return;
                    }}                                                    
                ],
                {cancelable: false},
            );
        }
        else if(this.state.addressField.length < 3) {
            Alert.alert(
                'Invalid address',
                'Please enter a valid address',
                [
                    {text: 'OK',
                    onPress: () => {
                        return;
                    }}                                                    
                ],
                {cancelable: false},
            );
        }
        else if(this.state.phoneNumberField.length < 13) {
            Alert.alert(
                'Invalid phone number',
                'Please follow the following pattern \n +92XXXXXXXXXX',
                [
                    {text: 'OK',
                    onPress: () => {
                        return;
                    }}                                                    
                ],
                {cancelable: false},
            );
        }
        else {
            let constants = require('./../Constants');
            try {
                let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/send_email', {
                    method: 'POST',
                    body: JSON.stringify({
                        to: this.props.navigation.state.params.user.fields.email,
                        subject: 'Purple Pubbles',
                        msg: this.props.navigation.state.params.user.fields.name 
                        + ' your order is being is processed'
                    })
                });
                Alert.alert(
                    'Ordered',
                    this.props.navigation.state.params.user.fields.name + ' your order is being ' + 
                    'is processed. A mail has been sent to you',
                    [
                        {text: 'OK'}                                                    
                    ],
                    {cancelable: false},
                );
                
                this.clearCart();

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

    clearCart = async () => {
        let dupli = [];
        this.setState({arrayOfProducts: dupli});
        let constants = require('./../Constants');
            try {
                let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/clear_cart', {
                    method: 'POST',
                    body: JSON.stringify({
                        userID : this.props.navigation.state.params.user.pk
                    })
                });
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

    deleteProduct = async (p) => {
        let constants = require('./../Constants');
        try {
            let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/remove_product_from_cart', {
                method: 'POST',
                body: JSON.stringify({
                    productID: p.product.pk,
                    userID : this.props.navigation.state.params.user.pk
                })
            });
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
        let dupli = [];
        for(let i = 0; i < this.state.arrayOfProducts.length; i++) {
            if(! (p.product.pk === this.state.arrayOfProducts[i].product.pk)) {
                dupli.push(this.state.arrayOfProducts[i]);
            }
        }
        this.setState({arrayOfProducts: dupli});
    }

    static navigationOptions = {
        header: null,
    };

    render() {
        return(
            <ScrollView style = {styles.container}>

                <SearchBox></SearchBox>        

                <View style = {{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                        {this.props.navigation.state.params.user.fields.name}'s Cart
                    </Text>
                </View>

                {this.checkCart()}

                <View>
                    {this.state.arrayOfProducts.map( (p, i) => {
                        return(
                            <View key = {i}>

                                <View>

                                    <View>
                                        <Text
                                            style = {{marginBottom: 8, color: '#d519a5', fontSize: 16}}>
                                                {p.product.fields.name}
                                        </Text>
                                    </View>

                                    <View>
                                        <View>
                                            <Image
                                                source = {{uri: p.product.fields.img}}
                                                style = {{width: 100, height: 100}}
                                            />
                                        </View>                        
                                    </View>

                                    <View style = {{marginTop: 6}}>
                                        <Text
                                            style = {{color: '#d519a5', fontSize: 16}}>
                        
                                                Price: {p.product.fields.price} $
                                        </Text>
                                    </View>

                                    <View style = {{flexDirection: 'row', marginBottom: 12, marginTop: 12}}>
                                        <View style = {{width: '30%', paddingHorizontal: 8}}>
                                            <Button
                                                title = '-'
                                                color = '#d519a5'
                                                onPress = { () => {
                                                    this.minusQuantity(p);
                                                }}
                                            >
                                            </Button>
                                        </View>
                                        
                                        <View style = {{paddingHorizontal: 8}}>
                                            <Text
                                                style = {
                                                    {
                                                        marginBottom: 10,
                                                        color: '#d519a5',
                                                        fontSize: 18,
                                                    }
                                                }
                                            >
                                                {p.quantity}
                                            </Text>
                                        </View>
                                        
                                        <View style = {{width: '30%', paddingHorizontal: 8}}>
                                            <Button
                                                title = '+'
                                                color = '#d519a5'
                                                onPress = { () => {
                                                    this.plusQuantity(p);
                                                }}
                                            >
                                            </Button>
                                        </View>
                                        
                                        <View style = {{width: '30%', paddingHorizontal: 8}}>
                                            <Button
                                                title = 'Delete'
                                                color = '#d519a5'
                                                onPress = { () => {
                                                    this.deleteProduct(p);
                                                }}
                                            >
                                            </Button>
                                        </View>

                                    </View>


                                </View>

                            </View>
                        );
                    })}
                </View>
                <View>                    
                    

                </View>

                <View style = {{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style = {{marginBottom: 10, color: '#d519a5', fontSize: 25, fontWeight: 'bold'}}>
                        Enter Order Details
                    </Text>
                </View>

                <View style = {styles.orderContainer}>
                    <TextInput
                        style = {styles.orderField}                        
                        defaultValue = 'Usama'
                        placeholderTextColor = '#222'
                        >
                    </TextInput>
                </View>

                <View style = {styles.orderContainer}>
                    <TextInput
                        style = {styles.orderField}
                        placeholder = 'Address'
                        defaultValue = ''                        
                        placeholderTextColor = '#222'
                        onChangeText = {(text) => {this.setState({addressField: text})}}
                        >
                    </TextInput>
                </View>

                <View style = {styles.orderContainer}>
                    <TextInput
                        style = {styles.orderField}
                        placeholder = 'Phone Number'
                        defaultValue = ''
                        placeholderTextColor = '#222'
                        onChangeText = {(text) => {this.setState({phoneNumberField: text})}}
                        >
                    </TextInput>
                </View>

                <View style = {{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                        style = {
                            {
                                marginBottom: 10,
                                color: '#d519a5',
                                fontSize: 25,
                                fontWeight: 'bold'
                            }
                        }
                    >
                        Total Price: {this.state.totalPrice} $
                    </Text>
                </View>

                <View style = {
                    {
                        marginTop: 10,
                        marginBottom: 15,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                }>
                    <Button
                        title = "Order Now"
                        color = "#d519a5"
                        onPress = {() => {
                            this.sendEmail();
                        }}
                    >
                    </Button>
                </View>

            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({    
    container: {
        padding: 15,
        marginTop: 20,
        marginBottom: 15
    },
    enterQuantityContainer: {
        width: '50%',
    },
    enterQuantityField: {
        color: '#222',
        borderRadius: 4,
        marginTop: 12,
        height: 30,
        borderColor: '#222',
        borderWidth: 1,
        width: '60%',
        paddingHorizontal: 10,
    },
    orderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    orderField: {        
        color: '#222',
        borderRadius: 4,
        marginTop: 15,
        height: 40,
        borderColor: '#222',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 13,
    }
});