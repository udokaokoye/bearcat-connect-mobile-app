import { View, Text } from 'react-native'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from 'react'
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NewPostScreen from '../screens/NewPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../lib/swr-hooks';
const ProfileStackScreen = createNativeStackNavigator()
const ProfileStack = () => {
    const { signedinUser } = useContext(AuthContext);
  return (
    <ProfileStackScreen.Navigator>
      <ProfileStackScreen.Screen name="profile" component={ProfileScreen} initialParams={{uid: signedinUser.userId}} />
      <ProfileStackScreen.Screen name="Search" component={SearchScreen} />
    </ProfileStackScreen.Navigator>
  )
}

export default ProfileStack