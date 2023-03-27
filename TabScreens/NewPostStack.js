import { View, Text } from 'react-native'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from 'react'
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NewPostScreen from '../screens/NewPostScreen';
import { AuthContext } from '../lib/swr-hooks';
const NewPostScreenStack = createNativeStackNavigator()
const NewPostStack = () => {
    const { signedinUser } = useContext(AuthContext);
  
  return (
    <NewPostScreenStack.Navigator>
      <NewPostScreenStack.Screen name="newPost" component={NewPostScreen} initialParams={{user: signedinUser}} />
      <NewPostScreenStack.Screen name="Search" component={SearchScreen} />
    </NewPostScreenStack.Navigator>
  )
}

export default NewPostStack
