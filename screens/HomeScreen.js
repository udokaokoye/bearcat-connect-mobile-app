import { Button, Text, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native'
import React, { useContext, useState, useLayoutEffect, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/elements'
import { AuthContext, getFeed, getLoggedInUser } from '../lib/swr-hooks'
import HeaderLeft from '../components/HeaderLeft'
import HeaderRight from '../components/HeaderRight'
import AddPost from '../components/AddPost'
import Post from '../components/Post'
import { mutate } from 'swr'
const HomeScreen = () => {
  const {feed, feedValidating} = getFeed("all")
  const headerHeight = useHeaderHeight()
  const {setsignedinUser, signedinUser} = useContext(AuthContext)
  const navigation = useNavigation()
  const [refreshing, setrefreshing] = useState(false)
  

  // useEffect(() => {
  //   console.log(feed)
  // }, [feedValidating])
  

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: 'Feed',
    headerTitleAlign: 'center',
    headerLeft: () => (
      <HeaderLeft />
    ),
    headerRight: () => (
      <HeaderRight />
    ),
  })
}, [])
  
  const handleLogout = () => {
    AsyncStorage.removeItem('user-token').then((e) => {
      alert("logged Out")
      setsignedinUser(null)
      navigation.navigate('auth')
    })
  }

  const testVal = () => {
    console.log(signedinUser)
    // AsyncStorage.getItem('user-token').then((tk) => {
    //   console.log(tk)
    // })
  }
  const refreshData = async () => {
    setrefreshing(true)
    await mutate('http://192.168.1.51/bearcats_connect/getFeed.php?portion=all')
    setrefreshing(false)
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}
    keyboardVerticalOffset={headerHeight}
    >
       
    <ScrollView className='' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />} >
      <View className='mt-10 mb-10'>

      <AddPost user={signedinUser} />
      </View>

      {feed?.length > 0 ? feed?.map((post, index) => (
        <View key={post.post.id} className="self-center" style={{width: '95%'}}>
        <Post user={signedinUser} post={post.post} tags={post.tags} comments={post.comments} />
        </View>
      )) : <Text>No Post Available</Text>}
      {/* <Text className=' text-red-600 '>{signedinUser.fName} {signedinUser.lName}</Text> */}
      {/* <TouchableOpacity onPress={() => handleLogout()} className=' mt-11 '><Text>LOGOUT</Text></TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => testVal()} className=' mt-11 '><Text>TEST</Text></TouchableOpacity> */}
    </ScrollView>
    </KeyboardAvoidingView>
    
  )
}

export default HomeScreen

