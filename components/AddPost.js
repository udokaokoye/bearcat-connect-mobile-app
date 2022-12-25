import { View, Text, TextInput, TouchableNativeFeedback, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../lib/swr-hooks'

const AddPost = () => {
    const {signedinUser} = useContext(AuthContext)
  return (
    <View style={{width: '90%', height: 120}} className=' = bg-white self-center flex-row items-center rounded-lg px-3'>
      <View style={{marginBottom: 'auto', marginTop: 10}}><Image source={{uri: signedinUser.img}} resizeMode='cover' style={{
        width: 50,
        height: 50,
        borderRadius: 60/2
      }} /></View>
      <View className='ml-3 flex-1'>
        <TextInput placeholder="What's on your mind user?" className='bg-gray-200 h-10 px-5 rounded-md' placeholderTextColor={'#91999d'} />
        <View className='flex-row mt-5 justify-between'>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Photo</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Video</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Thread</Text></TouchableOpacity>
            <TouchableOpacity className='bg-red-500 rounded-lg items-center justify-center' style={{width: '20%', height: 30}}><Text className='text-white text-xs'>Schedule</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AddPost