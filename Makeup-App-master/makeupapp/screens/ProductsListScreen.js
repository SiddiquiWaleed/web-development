import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        Image,
        View,
        Button,
        ScrollView,
        TouchableOpacity,
        TextInput,
        }
from 'react-native';
import SearchBox from '../SearchBox';

export default class ProductsListScreen extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }


    async componentDidMount() {
        this.fetchResults();
    }

    fetchResults = async () => {
        let constants = require('./../Constants');
        
        try {
            let res = await fetch('http://'+constants.IP+':'+constants.PORT+'/makeupapp/fetch_products', {
                method: 'POST',
                body: JSON.stringify({
                    category: this.props.navigation.state.params.category
                })
            });

            let jsonData = await res.json();
            let data = JSON.parse(jsonData);

            this.setState({data: data});
            
            if(data.length > 0) {
                console.log('Fetched all data');
            }
            else {
                console.log('Fetched Nothing');
            }

        }
        catch(err) {
            console.log(err);
        }
        
    }

    static navigationOptions = {
        header: null,        
    };

    render() {        
        return(
            <ScrollView style = {styles.container}>

                <SearchBox></SearchBox>                

                <View style = {{marginBottom: 20}}>
                    {this.state.data.map( (product, i) => {
                        return(
                            <View key = {i} style = {{marginTop: 25}}>

                                <View>
                                    <Text
                                        style = {{marginBottom: 10, color: '#d519a5', fontSize: 20}}>
                                            {product.fields.name}
                                    </Text>
                                </View>                                

                                <View>
                                    <View>
                                        <Image
                                            source = {{uri: product.fields.img}}
                                            style = {{width: 150, height: 150}}
                                        />
                                    </View>                        
                                    <View style = {{marginTop: 7}}>
                                        <Text>{product.fields.description}</Text>
                                    </View>
                                </View>

                                <View style = {{marginTop: 7}}>
                                    <Text
                                        style = {{color: '#d519a5', fontSize: 20}}>
                                            Price {product.fields.price} $
                                    </Text>
                                </View>
                                
                                <View style = {{marginTop: 7}}>
                                    <Button
                                        title = 'Buy Now'
                                        color = '#d519a5'
                                        onPress = { () => {
                                            this.props.navigation.navigate('ProductBuyScreen',
                                            {
                                                product: product,
                                                user: this.props.navigation.state.params.user
                                            });
                                        }}
                                    >

                                    </Button>
                                </View>                                
                                
                            </View>
                        );
                    })} 
                </View>                               

            </ScrollView>
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
        marginBottom: 15
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
    }
});