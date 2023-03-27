import { View, Text } from 'react-native'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from 'react'
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NewPostScreen from '../screens/NewPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { AuthContext } from '../lib/swr-hooks';
const NotificationStackScreen = createNativeStackNavigator()

const NotificationStack = () => {
    const { signedinUser } = useContext(AuthContext);
  return (
    <NotificationStackScreen.Navigator>
      <NotificationStackScreen.Screen name="notifications" component={NotificationsScreen} />
      <NotificationStackScreen.Screen name="Search" component={SearchScreen} />
    </NotificationStackScreen.Navigator>
  )
}

export default NotificationStack