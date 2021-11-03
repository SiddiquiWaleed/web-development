import React, {Component} from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CategoryListScreen from './screens/CategoryListScreen';
import ProductsListScreen from './screens/ProductsListScreen';
import ProductBuyScreen from './screens/ProductBuyScreen';
import Cart from './screens/Cart';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

export default class App extends Component {

  render() {
    const Navigator = createStackNavigator({
      LoginScreen: LoginScreen,
      SignupScreen: SignupScreen,
      HomeScreen: HomeScreen,
      CategoryListScreen: CategoryListScreen,
      ProductsListScreen: ProductsListScreen,
      ProductBuyScreen: ProductBuyScreen,
      Cart: Cart
    });    
    
    const App = createAppContainer(Navigator);
    return(
      <App></App>            
    );
  }
}






