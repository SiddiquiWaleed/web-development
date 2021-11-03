import React, {Component} from 'react';
import { Text, TouchableOpacity }
from 'react-native';

export default class CategoryListComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity
                style = {{padding: 6}}
                onPress = { () => {
                    this.props.navigation.navigate('ProductsListScreen', {category: this.props.name});
                }}
                >
                <Text style = {{fontSize: 18, fontWeight: 'bold', color: '#d519a5'}}>{this.props.name}</Text>
            </TouchableOpacity>
        );
    }
}