import { View, Text, Image, TouchableNativeFeedback } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext, logUserOut } from '../lib/swr-hooks'
import {MagnifyingGlassIcon} from 'react-native-heroicons/solid'

const HeaderRight = () => {
    const {signedinUser} = useContext(AuthContext)
  return (
    <View className='flex-row items-center'>
      <View style={{width: 30, height: 30}} className='bg-gray-200 rounded-full items-center justify-center mr-3'>
        <MagnifyingGlassIcon color={'#000'} size={15} />
      </View>
        <TouchableNativeFeedback onPress={() => logUserOut()}>
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
  
    </View>
  )
}

export default HeaderRight