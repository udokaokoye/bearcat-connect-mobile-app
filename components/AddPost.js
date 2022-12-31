import { View, Text, TextInput, TouchableNativeFeedback, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../lib/swr-hooks'
import {PhotoIcon} from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'

const AddPost = ({user}) => {
  const navigation = useNavigation()
    const {signedinUser} = useContext(AuthContext)
  return (
    <View style={{width: '90%', height: 80}} className=' = bg-white self-center flex-row items-center rounded-lg px-3'>
      <View style={{marginBottom: 'auto', marginTop: 10}}><Image source={{uri: signedinUser.img}} resizeMode='cover' style={{
        width: 50,
        height: 50,
        borderRadius: 60/2
      }} /></View>
      <View className='ml-4 flex-1 flex-row items-center justify-between'>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('newpost', {
          user: user
        })} className='bg-gray-200 h-10 px-5 rounded-md items-start justify-center py-3'>
          <View>
          <Text className='text-gray-600'>{`What's on your mind ${signedinUser.fName}?`}</Text>
          </View>
        </TouchableWithoutFeedback>
        {/* <View className='flex-row mt-5 justify-between'>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Photo</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Video</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Thread</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Schedule</Text></TouchableOpacity>
        </View> */}
        <PhotoIcon size={25} color='red' />
      </View>
    </View>
  )
}

export default AddPost