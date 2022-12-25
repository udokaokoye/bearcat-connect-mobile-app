import { View, Text, Image } from 'react-native'
import React from 'react'

const HeaderLeft = () => {
  return (
    <View className=' flex-row items-center'>
      <Image source={require('../assets/bcatslogo-black.png')} style= {{width: 50, height: 30, resizeMode: 'contain'}} />
      <Text className='text-3xl' style={{fontFamily: 'signpainter'}}>Connect</Text>
    </View>
  )
}

export default HeaderLeft