import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'

const CommentEntry = ({user}) => {
  return (
    <View className='flex-row justify-between'>
      <Image className='rounded-full' source={{uri: user?.img}} resizeMode='cover' style={{width: 30, height: 30}} />
      <TextInput className='flex-1 ml-5 bg-gray-200 rounded-md h-9 px-3' placeholder='Write a comment...' />
    </View>
  )
}

export default CommentEntry