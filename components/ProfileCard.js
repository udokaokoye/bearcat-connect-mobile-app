import { View, Text, Image } from 'react-native'
import React from 'react'

const ProfileCard = ({user}) => {
  return (
    <View className='mb-6 flex-row'>
      <Image className='rounded-full' source={{uri: user.profile_picture}} style={{width: 50, height: 50}} />
      <View className='ml-3'>
        <Text className='font-bold'>{user.firstName} {user.lastName}</Text>
        <Text className=' text-xs text-gray-600 '>@{user.username}</Text>
        <Text>{user.major}</Text>
      </View>
    </View>
  )
}

export default ProfileCard