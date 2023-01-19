import { Button, Text, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView, Platform, RefreshControl, TouchableHighlight, Pressable } from 'react-native'
import React, { useContext, useState, useLayoutEffect, useRef, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/elements'
import { AuthContext, getFeed, getLoggedInUser, server } from '../lib/swr-hooks'
import {
  BookmarkIcon,
  LinkIcon,
  ShareIcon,
  FlagIcon,
  TrashIcon,PencilSquareIcon
} from "react-native-heroicons/solid";
import RBSheet from "react-native-raw-bottom-sheet";
import HeaderLeft from '../components/HeaderLeft'
import HeaderRight from '../components/HeaderRight'
import AddPost from '../components/AddPost'
import Post from '../components/Post'
import { mutate } from 'swr'
const HomeScreen = () => {
  const {feed, feedValidating} = getFeed("all")
  const [menuActive, setmenuActive] = useState([false, '000', '000'])
  const [layoutMounted, setlayoutMounted] = useState(false)
  const headerHeight = useHeaderHeight()
  const {setsignedinUser, signedinUser} = useContext(AuthContext)
  const navigation = useNavigation()
  const [refreshing, setrefreshing] = useState(false)
  
  const refRBSheet = useRef();

  useEffect(() => {
    menuActive[0] ? refRBSheet.current.open() : ''
  }, [menuActive[0]])
  
  

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
setTimeout(() => {
  setlayoutMounted(true)
}, 2000);}, [])
  
  const handleLogout = () => {
    AsyncStorage.removeItem('user-token').then((e) => {
      alert("logged Out")
      setsignedinUser(null)
      navigation.navigate('auth')
    })
  }

const deletePost = async (pid) => {
  // alert(pid);
  // return
  fetch(`http://${server}/bearcats_connect/deletePost.php?pid=${pid}`, {headers: {
    'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
 }})
  mutate(`http://${server}/bearcats_connect/getFeed.php?portion=all`)
  refRBSheet.current.close()
  setmenuActive([false, '', ''])
}
  const refreshData = async () => {
    setrefreshing(true)
    await mutate(`http://${server}/bearcats_connect/getFeed.php?portion=all`)
    setrefreshing(false)
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}
    keyboardVerticalOffset={layoutMounted ? headerHeight : 0}
    >
       
    <ScrollView className='' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />} >
      <View className='mt-10 mb-10'>

      <AddPost user={signedinUser} />
      </View>

      {feed?.length > 0 ? feed?.map((post) => (
        <View key={post.post.id} className="self-center" style={{width: '95%'}}>
        <Post user={signedinUser} post={post.post} tags={post.tags} comments={post.comments} reactions={post.reactions} setmenuActive={setmenuActive} menuActive={menuActive} />
        {/* <Pressable onPress={() => {
          console.log(post.post.user_id == signedinUser.userId)
        }}><Text>Press ME</Text></Pressable> */}
        
        </View>
      )) : <Text>No Post Available</Text>}


<RBSheet
          ref={refRBSheet}
          height={450}
          closeOnDragDown={true}
          closeOnPressMask={true}
          openDuration={250}
          onClose={() => setmenuActive([false, '000'])}
          customStyles={{
            container: {
              borderRadius: 20,
              backgroundColor: '#e7e7e7'
            },
            draggableIcon: {
              backgroundColor: "#aab8b9"
            },
          }}
        >
         <View className='bg-white self-center p-2' style={{width: '90%', height: '100%', borderRadius: 20}}>
          <TouchableHighlight underlayColor={'#ececec'} onPress={() => console.log(menuActive[1])}>
            <View className='flex-row items-center p-4'>
            <BookmarkIcon color={'red'} />
            <View className='ml-2'>
            <Text className='font-bold' >Save Post</Text>
            <Text className='text-xs text-gray-500'>add this to saved posts</Text>
            </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ececec'} onPress={() => alert("copy link function")}>
            <View className='flex-row items-center p-4'>
              <LinkIcon color={'red'} />
            <View className='ml-2'>
            <Text className='font-bold ml-2'>Copy Link</Text>
            <Text className='text-xs text-gray-500'>copy post link to clipboard</Text>
            </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ececec'} onPress={() => alert("share post function")}>
            <View className='flex-row items-center p-4'>
              <ShareIcon color={'red'} />
            <View className='ml-2'>
            <Text className='font-bold'>Share Post</Text>
            <Text className='text-xs text-gray-500'>share posts to other apps</Text>
            </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ececec'} onPress={() => alert("Run report post function")}>
            <View className='flex-row items-center p-4'>
              <FlagIcon color={'red'} />
            <View className='ml-2'>
            <Text className='font-bold'>Report Post</Text>
            <Text className='text-xs text-gray-500'>i am disturbed about this post</Text>
            </View>
            </View>
          </TouchableHighlight>
          {menuActive[1] == signedinUser.userId ? (
                      <TouchableHighlight underlayColor={'#ececec'} 
                      onPress={() => {
                        deletePost(menuActive[2])
                      }}>
                      <View className='flex-row items-center p-4'>
                        <TrashIcon color={'red'}  />
                        <View className='ml-2'>
                        <Text className='font-bold'>Delete Post</Text>
                        <Text className='text-xs text-gray-500'>this action cannot be undone</Text>
                        </View>
                        </View>
          
                    </TouchableHighlight>
          ) : ''}
         </View>
        </RBSheet>
    </ScrollView>
    </KeyboardAvoidingView>
    
  )
}

export default HomeScreen

