import { View, Text, Image, TouchableNativeFeedback, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext, logUserOut } from '../lib/swr-hooks'
import {MagnifyingGlassIcon, ChatBubbleBottomCenterIcon} from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'

const HeaderRight = ({profliePopupRef=null}) => {
    const {signedinUser, setsignedinUser} = useContext(AuthContext)
    const navigation = useNavigation();
  return (
    <View className='flex-row items-center relative'>
      <Pressable onPress={() => navigation.navigate('chatlist')} style={{width: 30, height: 30}} className='bg-gray-200 rounded-full items-center justify-center mr-3'>
        <ChatBubbleBottomCenterIcon />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('search', {
        user: signedinUser
      })} style={{width: 30, height: 30}} className='bg-gray-200 rounded-full items-center justify-center mr-3'>
        <MagnifyingGlassIcon color={'#000'} size={15} />
      </Pressable>
        <TouchableNativeFeedback onPress={() => {
          profliePopupRef!==null && profliePopupRef.current.open()
          // logUserOut(signedinUser.userId)
          // setsignedinUser(null)
        }}>
        <View style={{position: 'relative', width: 30, height: 30}}>
        <Image resizeMethod='resize' source={{uri: signedinUser.img }} className=' rounded-full border-solid' 
        style={{
            flex: 1,
            width: '100%',
            height: '100%',
            aspectRatio: 0.9,
            resizeMode: 'contain',
            borderWidth: 1,
            borderColor: 'grey',
            }} />
            </View>
            </TouchableNativeFeedback>

            <View className='w-40 h-60 bg-red-700 absolute top-20  z-10'>
              <Text>Hello</Text>
            </View>
  
    </View>
  )
}

export default HeaderRight