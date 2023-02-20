import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableHighlight,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, {
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { PencilSquareIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import ChatUserCard from "../components/ChatUserCard";
import { db } from "../firebase";
import { AuthContext, ChatContext, GetUser, server } from "../lib/swr-hooks";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import ProfileCard from "../components/ProfileCard";
import { SafeAreaView } from "react-native-safe-area-context";
const ChatList = () => {
  const navigation = useNavigation();
  const [chats, setchats] = useState([]);
  const [searchPhrase, setsearchPhrase] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const { signedinUser } = useContext(AuthContext);
  const activeUser = GetUser(signedinUser.userId).userData;
  const headerHeight = useHeaderHeight();
  const {latestChat} = useContext(ChatContext)
  const refRBSheet = useRef();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chat",
      headerTitleAlign: "center",
      headerRight: () => (
        <Pressable onPress={() => refRBSheet.current.open()}>
          <PlusCircleIcon color={"blue"} />
        </Pressable>
      ),
    });
  }, [refRBSheet]);
  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .orderBy('timestamp', 'desc')
      .where("chatMembers", "array-contains", signedinUser.userId) 
      .onSnapshot((snapshot) =>
        setchats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, []);
  useEffect(() => {
    fetch(`${server}/tagSearch.php?phrase=${searchPhrase}`)
      .then((res) => res.json())
      .then((data) => {
        setsearchResult(data);
        // console.log(data)
      });
  }, [searchPhrase]);

  useEffect(() => {
    // console.log(latestChat)
    const position = chats.map(e => e.id).indexOf(latestChat);
    const latestChatFiltered = chats.filter((cht) => cht.id == latestChat)
    // setchats((prevChats) => [latestChatFiltered[0], ...prevChats])
    // console.log(latestChatFiltered[0])
    // console.log(chats[0])


    // if (position == -1 || position == 0) return;
    // setchats(prevChats => {
    //   const newChats = [...prevChats];
    //   newChats.splice(position, 1);
    //   newChats.unshift(latestChatFiltered);
    //   return newChats
    // })

// console.log(latestChatFiltered[0])
// console.log(chats[0])
  }, [latestChat])
  

  const createChat = async (user) => {
    await db
      .collection("chats")
      .add({
        chatMembers: [signedinUser.userId, user.id],
        chatMemberInfo: [
          {
            name: signedinUser.fName + " " + signedinUser.lName,
            username: signedinUser.username,
            profile_picture: signedinUser.img,
            major: signedinUser.major,
            id: signedinUser.userId,
          },
          {
            name: user.firstName + " " + user.lastName,
            username: user.username,
            profile_picture: user.profile_picture,
            major: user.major,
            id: user.id,
          },
        ],
        chatName:
          signedinUser.fName +
          " " +
          signedinUser.lName +
          "->" +
          user.firstName +
          " " +
          user.lastName,
      })
      .then((docRef) => {
        refRBSheet.current.close();
        setsearchPhrase("");
        navigation.navigate("chat", {
          user: {
            name: user.firstName + " " + user.lastName,
            id: user.id,
            major: user.major,
            profile_picture: user.profile_picture,
            username: user.username,
          },
          chatId: docRef.id
        });
      })
      .catch((error) => console.log(error));
  };
  return (
    <View className="bg-white flex-1">
      <TextInput
        placeholder="search..."
        className="mt-5 mb-5 self-center bg-gray-100 rounded-lg px-5"
        style={{ width: "90%", height: 50 }}
        onFocus={() => refRBSheet.current.open()}
      />
      {chats.length
        > 0 ? (<Text className="text-2xl font-bold ml-5">All Chats</Text>)
        : ""}
      {chats.length > 0 ? (
        chats.map(({ data, id }) => (
          <React.Fragment key={id}>
            <TouchableHighlight
              underlayColor={"#e9e9e9"}
              onPress={() => {
                // createChat(u)
                navigation.navigate("chat", {
                  user: data?.chatMemberInfo[1]?.id == signedinUser.userId
                  ? data?.chatMemberInfo[0]
                  : data?.chatMemberInfo[1],
                  chatId: id,
                  otherUser: data?.chatMemberInfo[1]?.id == signedinUser.userId
                  ? data?.chatMemberInfo[1]
                  : data?.chatMemberInfo[0]
                });
              }}
              className=" border-gray-300"
              style={{ borderBottomWidth: 0.5 }}
            >
              <ChatUserCard
                user={
                  data?.chatMemberInfo[1].id == signedinUser.userId
                    ? data?.chatMemberInfo[0]
                    : data?.chatMemberInfo[1]
                }
                id={id}
                signedinuser={signedinUser}
              />
              {/* <Pressable onPress={() => createChat(u)}><Text>New chat</Text></Pressable> */}
            </TouchableHighlight>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <Text className="text-2xl font-bold text-center mt-20">
            No Messages At The Moment
          </Text>
          <Text className='text-center'>use the add button to start a new chat!</Text>
        </React.Fragment>
      )}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get("screen").height - 300}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#aab8b9",
          },
        }}
      >
        <TextInput
          style={{ width: "90%", height: 50 }}
          returnKeyType="search"
          className="bg-gray-200 self-center rounded-xl px-3"
          placeholderTextColor={"#5d5d5c"}
          placeholder="search username, name, email..."
          onChangeText={(txt) => setsearchPhrase(txt)}
        />

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            className="flex-1 mt-5 self-center"
            style={{ width: "90%" }}
          >
            {searchResult.length > 0
              ? searchResult
                  .filter((rs) => rs.id !== signedinUser.userId)
                  .map((res) => (
                    <Pressable onPress={() => createChat(res)} key={res.id}>
                      <ProfileCard user={res} />
                    </Pressable>
                  ))
              : ""}
          </ScrollView>
        </TouchableWithoutFeedback>
      </RBSheet>
    </View>
  );
};

export default ChatList;
