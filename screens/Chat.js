import { View, Text, Image, Dimensions, Pressable, KeyboardAvoidingView, Platform, StatusBar, Keyboard, TouchableNativeFeedback } from "react-native";
import React, {useContext, useLayoutEffect, useState} from "react";
import {
  Bars3BottomRightIcon,
  ChevronLeftIcon,
  PaperAirplaneIcon
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { db } from "../firebase";
import firebase from 'firebase/compat/app';
import ChatDisplay from "../components/ChatDisplay";
import { AuthContext } from "../lib/swr-hooks";

const Chat = ({ route }) => {
  const headerHeight = useHeaderHeight();
  const { user, chatId } = route.params;
  const [inputMessage, setinputMessage] = useState('')
  const { signedinUser } = useContext(AuthContext);
  const [messages, setmessages] = useState([])
  const navigation = useNavigation();
useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false,
  });
  const unsubscribe = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => setmessages(snapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }))))
  return unsubscribe;
}, [route])




const sendMessage = () => {
  Keyboard.dismiss()
  console.log(inputMessage)
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  db.collection('chats').doc(chatId).collection('messages').add({
    timestamp: timestamp,
    message: inputMessage,
    displayName: signedinUser.username,
    profile_picture: signedinUser.img
  })


  setinputMessage('')
}
  return (
<>
  {/* <StatusBar style='light' /> */}
<SafeAreaView>
      <View
        className="flex-row items-center p-3 "
        style={{
          width: Dimensions.get("window").width,
          
        }}
      >
        <Pressable onPress={() => navigation.navigate('chatlist')}>
        <ChevronLeftIcon />
        </Pressable>
        <View className="flex-row items-center ml-3">
          <Image
            className="rounded-full"
            source={{ uri: user.profile_picture }}
            style={{ width: 30, height: 30 }}
          />
          <View className="ml-2">
            <Text style={{ fontSize: 12 }}>{user.name}</Text>
            <Text className="text-gray-400" style={{ fontSize: 8 }}>
              Active 3h ago
            </Text>
          </View>
        </View>
        <Bars3BottomRightIcon style={{ marginLeft: "auto" }} />
      </View>

    </SafeAreaView>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : "height"} keyboardVerticalOffset={headerHeight - 10}
      className='flex-1'>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{height: '100%'}}>


<ScrollView >
  {
    messages.map(({id, data}) => (
      <React.Fragment key={id}>
        <ChatDisplay chat={data} sgUser={signedinUser} sender={data.displayName === signedinUser.username} />
        </React.Fragment>
    ))
  }
</ScrollView>
<View style={{height: 80}}></View>


      </TouchableWithoutFeedback>
      <View style={{marginTop: 'auto', paddingBottom: 40}} className='flex-row justify-between items-center px-3'>
        <TextInput value={inputMessage} onSubmitEditing={sendMessage} onChangeText={(txt) => setinputMessage(txt)} placeholder="Enter message" className='bg-gray-300 rounded-xl px-4' style={{width: '90%', height: 40}} />
        <Pressable className='p-2' onPress={() => sendMessage()}><><PaperAirplaneIcon /></></Pressable>
      </View>
      </KeyboardAvoidingView>
</>
  );
};

export default Chat;
