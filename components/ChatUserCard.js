import { View, Text, Image, Pressable } from "react-native";
import React, {useContext, useEffect, useState} from "react";
import { CameraIcon } from "react-native-heroicons/solid";
import { db } from "../firebase";
import { ChatContext } from "../lib/swr-hooks";
const ChatUserCard = ({ user, id, signedinuser }) => {
 const {latestChat, setlatestChat} = useContext(ChatContext)
 const [messageread, setmessageread] = useState(true)
 const [unreadCount, setunreadCount] = useState(0)

  const [chatMessage, setchatMessage] = useState()
  useEffect(() => {
    const unsubscribe= db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc').limit(50).onSnapshot((snapshot) => {
      setchatMessage(snapshot.docs.map((doc) => doc.data())[0])

    // setunreadCount(0)
      snapshot.docs.map((doc) => {
        if (doc.data().read == false && doc.data().displayName !== signedinuser.username) {
          setunreadCount(unreadCount + 1)
        }
      })
      setlatestChat(id)
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    if(chatMessage?.read !== undefined && chatMessage?.displayName !== signedinuser.username) {
      setmessageread(chatMessage?.read)
    }
  }, [chatMessage])
  
  
  return (
    <View
      className="self-center rounded-lg my-3 p-2"
      style={{ width: "90%", height: "auto" }}
      key={id}
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: user?.profile_picture }}
          className="rounded-full"
          style={{ width: 50, height: 50 }}
        />
        <View style={{width: '80%'}} className="ml-3 justify-self-start items-center flex-row justify-between">
          <View>
            <Text className=" text-base font-semibold">{user?.name}</Text>
            <Text className="text-sm text-gray-400">Active 3h ago</Text>
            <Text>{chatMessage?.message}</Text>
          </View>
          <Pressable onPress={() => alert('launch camera')} className='p-2'>
            <CameraIcon color={'black'} size={25} />
          </Pressable>
        </View>
        {chatMessage?.displayName !== signedinuser.username && !messageread ? (
          <View className='rounded-full bg-red-600 items-center justify-center' style={{width: 20, height: 20}}><Text className=' text-white'>{unreadCount}</Text></View>
        ) : ("")}
      </View>
    </View>
  );
};

export default ChatUserCard;
