import { View, Text } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import NewPostScreen from "../screens/NewPostScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import PostImageFullView from "../screens/PostImageFullView";
import StoriesScreen from "../screens/StoriesScreen";
import CommentsViewScreen from "../screens/CommentsViewScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Chat from "../screens/Chat";
import ChatList from "../screens/ChatList";
import FullVideoScreen from "../screens/FullVideoScreen";
const HomeStackScreen = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <HomeStackScreen.Navigator>
      <HomeStackScreen.Screen name="home" component={HomeScreen} />
      <HomeStackScreen.Screen name="newpost" component={NewPostScreen} />
      <HomeStackScreen.Screen name="postdetails" component={PostDetailsScreen} />
      <HomeStackScreen.Screen name="imageFullView" component={PostImageFullView} />
      <HomeStackScreen.Screen name="stories" component={StoriesScreen} />
      <HomeStackScreen.Screen name="commentview" component={CommentsViewScreen} />
      <HomeStackScreen.Screen name="profile" component={ProfileScreen} />
      <HomeStackScreen.Screen name="search" component={SearchScreen} />
      <HomeStackScreen.Screen name="chat" component={Chat} />
      <HomeStackScreen.Screen name="chatlist" component={ChatList} />
      <HomeStackScreen.Screen name="fullVideo" component={FullVideoScreen} />
    </HomeStackScreen.Navigator>
  );
};

export default HomeStack;
