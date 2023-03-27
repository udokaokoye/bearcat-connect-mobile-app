import { View, Text } from 'react-native'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from 'react'
import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';
import { AuthContext } from '../lib/swr-hooks';
import ProfileScreen from '../screens/ProfileScreen';

const SearchSTack = () => {
    const SearchStackScreen = createNativeStackNavigator()

  const { signedinUser } = useContext(AuthContext);
  return (
    <SearchStackScreen.Navigator>
      <SearchStackScreen.Screen name="Search" component={SearchScreen} initialParams={{user: signedinUser}} />
      <SearchStackScreen.Screen name="profile" component={ProfileScreen} />
    </SearchStackScreen.Navigator>
  )
}

export default SearchSTack