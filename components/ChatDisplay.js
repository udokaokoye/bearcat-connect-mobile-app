import { View, Text, Image } from 'react-native'
import React, {useEffect} from 'react'

const ChatDisplay = ({chat, sender, sgUser}) => {
    useEffect(() => {
    //   console.log(sender)
    }, [])
    
    // console.log(sender)
  return (
    <View style={{width: '100%'}} className={` p-3 flex-row ${sender ? 'justify-end' : ' justify-start'}`}>
    <View className='flex-row' style={{maxWidth: '80%', minWidth: sender ? '30%' : '40%'}}>
    {!sender ? (
                <Image source={{uri: chat.profile_picture}} className='rounded-full self-end' style={{width: 30, height: 30}} />
            ) : ''}
        <View className={`flex-1 ml-2 p-5 ${sender ? 'ml-0 bg-red-600' : 'bg-gray-200'} justify-center items-center rounded-xl`} style={{minHeight: 50}}>
        <Text style={{color: sender? 'white' :'black'}}>{chat.message}</Text>
        </View>
    </View>
    </View>
  )
}

export default ChatDisplay