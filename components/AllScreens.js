import { View, Text } from 'react-native'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'

const AllScreens = () => {
    const Stack = createNativeStackNavigator();
  return (
    <>
    <Stack.Screen name="home" component={HomeScreen} />
                      <Stack.Screen name="newpost" component={NewPostScreen} />
                      <Stack.Screen
                        name="postdetails"
                        component={PostDetailsScreen}
                      />
                      <Stack.Screen
                        name="imageFullView"
                        component={PostImageFullView}
                      />
                      <Stack.Screen name="stories" component={StoriesScreen} />
                      <Stack.Screen
                        name="commentview"
                        component={CommentsViewScreen}
                      />
                      <Stack.Screen name="profile" component={ProfileScreen} />
                      <Stack.Screen name="search" component={SearchScreen} />
                      <Stack.Screen name="chat" component={Chat} />
                      <Stack.Screen name="chatlist" component={ChatList} />
                      <Stack.Screen name="fullVideo" component={FullVideoScreen} />
    </>
  )
}

export default AllScreens