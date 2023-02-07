import { View, Text, Image } from 'react-native'
import React, {useEffect} from 'react'
import firebase from 'firebase/compat/app';
import moment from 'moment';

const ChatDisplay = ({chat, sender, sgUser}) => {
    // useEffect(() => {
    //   console.log()
    //   // console.log(moment(chat.timestamp.nanoseconds).format('LT'))
    // }, [])
    
    // console.log(sender)
  return (
    <View style={{width: '100%'}} className={` p-3 flex-row ${sender ? 'justify-end' : ' justify-start'}`}>
    <View className='flex-row' style={{maxWidth: '80%', minWidth: sender ? '30%' : '40%'}}>
    {!sender ? (
                <Image source={{uri: chat.profile_picture}} className='rounded-full self-end' style={{width: 30, height: 30}} />
            ) : ''}
        <View className='flex-1' style={{minHeight: 50}} >
          <View className={`flex-1 ml-2 p-5 ${sender ? 'ml-0 bg-red-600' : 'bg-gray-200'} justify-center items-center rounded-xl`} >
        <Text style={{color: sender? 'white' :'black'}}>{chat.message}</Text>
        </View>
        <Text className='ml-1 mt-1 text-gray-400'>{moment(chat?.timestamp?.toDate()).format("LT")}</Text>
        </View>
    </View>
    </View>
  )
}

export default ChatDisplay