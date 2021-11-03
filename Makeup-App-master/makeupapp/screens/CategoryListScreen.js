import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        View,
        ScrollView,
        TouchableOpacity,
        }
from 'react-native';
import SearchBox from '../SearchBox';

const CategoryListComponent = (props) => {
    return(
        <TouchableOpacity
            style = {{padding: 6}}
            onPress = { () => {
                props.navigate('ProductsListScreen',
                {
                    category: props.name,
                    user: props.user
                });
            }}
            >
            <Text style = {{fontSize: 18, fontWeight: 'bold', color: '#d519a5'}}>{props.name}</Text>
        </TouchableOpacity>
    );
}

export default class CategoryListScreen extends Component {
    

    constructor(props) {
        super(props);
    }    

    static navigationOptions = {
        header: null
    };

    getCategories = () => {

        if(this.props.navigation.state.params.bodypart === 'Eyes') {
            return(
                <View style = {styles.categoryListContainer}>
                    <CategoryListComponent
                        name = "Shadow"
                        navigate = {this.props.navigation.navigate}
                        user = {this.props.navigation.state.params.user}
                    />
                    <CategoryListComponent
                        name = "Brow"
                        navigate = {this.props.navigation.navigate}
                        user = {this.props.navigation.state.params.user}
                    />
                    <CategoryListComponent
                        name = "Eyeliner"
                        navigate = {this.props.navigation.navigate}
                        user = {this.props.navigation.state.params.user}
                    />
                    <CategoryListComponent
                        name = "Mascara"
                        navigate = {this.props.navigation.navigate}
                        user = {this.props.navigation.state.params.user}
                    />                    
                </View>
            );
        }
        else if(this.props.navigation.state.params.bodypart === 'Face') {
            return(
                <View style = {styles.categoryListContainer}>
                    <CategoryListComponent
                        name = "Foundation"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Highlighter"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Concealer"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Powder"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Primer"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Blush"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Contour"
                        navigate = {this.props.navigation.navigate}
                    />  
                </View>
            );
        }
        else if(this.props.navigation.state.params.bodypart === 'Lips') {
            return(
                <View style = {styles.categoryListContainer}>
                    <CategoryListComponent
                        name = "Lipstick"
                        navigate = {this.props.navigation.navigate}
                    />  
                    <CategoryListComponent
                        name = "Lipgloss"
                        navigate = {this.props.navigation.navigate}
                    />
                    <CategoryListComponent
                        name = "Matte Liquid Lipstick"
                        navigate = {this.props.navigation.navigate}
                    />
                    <CategoryListComponent
                        name = "Metallic Liquid Lipstick"
                        navigate = {this.props.navigation.navigate}
                    />
                </View>
            );
        }
        else {
            return(
                <View style = {styles.categoryListContainer}>
                    <CategoryListComponent
                        name = "Nail Polish"
                        navigate = {this.props.navigation.navigate}
                    />
                    <CategoryListComponent
                        name = "Polish Remover"
                        navigate = {this.props.navigation.navigate}
                    />
                    <CategoryListComponent
                        name = "Cutter's"
                        navigate = {this.props.navigation.navigate}
                    />
                </View>
            );
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        return(            
            <ScrollView style = {styles.container}>
                
                <SearchBox></SearchBox>

                <View style = {{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {{fontSize: 24, fontWeight: '600', color: '#d519a5'}}>
                        {this.props.navigation.state.params.bodypart}
                    </Text>
                </View>

                <View style = {styles.categoryListContainer}>
                    {this.getCategories()}
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