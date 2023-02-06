import { View, Text, Image, Pressable } from "react-native";
import React, {useContext, useEffect, useState} from "react";
import { CameraIcon } from "react-native-heroicons/solid";
import { db } from "../firebase";
import { ChatContext } from "../lib/swr-hooks";
const ChatUserCard = ({ user, id,  }) => {
 const {latestChat, setlatestChat} = useContext(ChatContext)

  const [chatMessage, setchatMessage] = useState([])
  useEffect(() => {
    const unsubscribe= db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setchatMessage(snapshot.docs.map((doc) => doc.data()))
      setlatestChat(id)
    })
    return unsubscribe;
  }, [])

  // useEffect(() => {
  //   setlatestChat(chatMessage)
  // }, [chatMessage])
  
  
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
            <Text>{chatMessage?.[0]?.message}</Text>
          </View>
          <Pressable onPress={() => alert('launch camera')} className='p-2'>
            <CameraIcon color={'black'} size={25} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ChatUserCard;
