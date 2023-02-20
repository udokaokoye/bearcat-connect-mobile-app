import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableNativeFeedback,
} from "react-native";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import {
  Bars3BottomRightIcon,
  ChevronLeftIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import ChatDisplay from "../components/ChatDisplay";
import { AuthContext } from "../lib/swr-hooks";
import sendPushNotification from "../sendPushNotification";

const Chat = ({ route }) => {
  const refScrollView = useRef();
  const headerHeight = useHeaderHeight();
  const { user, chatId, otherUser } = route.params;
  const [inputMessage, setinputMessage] = useState("");
  const { signedinUser } = useContext(AuthContext);
  const [messages, setmessages] = useState([]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    refScrollView.current.scrollToEnd({ animated: false });
    navigation.setOptions({
      headerShown: false,
    });
    const unsubscribe = db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
{
  const lastMessage = snapshot.docs[snapshot.docs.length - 1]
  if(lastMessage !== undefined) {
    if(lastMessage.data().displayName !== signedinUser.username) {
      lastMessage.ref.update({read: true})
    }
  }
  setmessages(
    snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))
  )
}
      );

    // console.log(messages[0]);
    return unsubscribe;
  }, [route]);

  const sendMessage = () => {

    Keyboard.dismiss();
    // console.log(inputMessage)
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    db.collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        timestamp: timestamp,
        message: inputMessage,
        displayName: signedinUser.username,
        profile_picture: signedinUser.img,
        read: false,
      })
      .catch((err) => console.log(err));

    db.collection("chats").doc(chatId).update({
      timestamp: timestamp,
    });

    // console.log(user)
    sendPushNotification(user.id, "message", otherUser, inputMessage, chatId, signedinUser);
    setinputMessage("");
  };
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
          <Pressable onPress={() => navigation.navigate("chatlist")}>
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight - 10}
        className="flex-1"
      >
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={{ height: "100%" }}
        >
          <ScrollView
            ref={refScrollView}
            onContentSizeChange={() =>
              refScrollView.current.scrollToEnd({ animated: false })
            }
          >
            {messages.map(({ id, data }) => (
              <React.Fragment key={id}>
                <ChatDisplay
                  chat={data}
                  sgUser={signedinUser}
                  sender={data.displayName === signedinUser.username}
                  user={user}
                />
              </React.Fragment>
            ))}
          </ScrollView>
          <View style={{ height: 80 }}></View>
        </TouchableWithoutFeedback>
        <View
          style={{ marginTop: "auto", paddingBottom: 40 }}
          className="flex-row justify-between items-center px-3"
        >
          <TextInput
            value={inputMessage}
            onSubmitEditing={sendMessage}
            onChangeText={(txt) => setinputMessage(txt)}
            placeholder="Enter message"
            className="bg-gray-300 rounded-xl px-4"
            style={{ width: "90%", height: 40 }}
          />
          <Pressable className="p-2" onPress={() => sendMessage()}>
            <>
              <PaperAirplaneIcon />
            </>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Chat;
