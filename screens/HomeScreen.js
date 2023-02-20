import {
  Button,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableHighlight,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  AuthContext,
  getFeed,
  getLoggedInUser,
  logUserOut,
  server,
  ViewableItem,
} from "../lib/swr-hooks";
import * as Progress from "react-native-progress";
import {
  BookmarkIcon,
  LinkIcon,
  ShareIcon,
  FlagIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowLeftCircleIcon,
  Cog6ToothIcon
} from "react-native-heroicons/solid";
import RBSheet from "react-native-raw-bottom-sheet";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import AddPost from "../components/AddPost";
import Post from "../components/Post";
import { mutate } from "swr";
import Stories from "../components/Stories";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import sendPushNotification from "../sendPushNotification";
const HomeScreen = ({ route }) => {
  const { feed, feedValidating } = getFeed("all");
  // const { uploadPost, postDetails } = route.params;
  const [menuActive, setmenuActive] = useState([false, "000", "000"]);
  const [layoutMounted, setlayoutMounted] = useState(false);
  const { viewableItem, setviewableItem } = useContext(ViewableItem);
  const headerHeight = useHeaderHeight();
  const { setsignedinUser, signedinUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [refreshing, setrefreshing] = useState(false);
  const [showUploadPostLoader, setshowUploadPostLoader] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const refRBSheet = useRef();
  const refRBSheet2 = useRef();

  
  const updateNotificationTokenInDB = (token) => {
    // console.log(signedinUser.userId)
    const  formData = new FormData();
    formData.append('uid', signedinUser.userId)
    formData.append('notificationToken', token)
    formData.append('logout', 'false')
    fetch(`${server}/updateNotificationToken.php`, {
      method: 'POST',
      body: formData
    })
  }


  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      updateNotificationTokenInDB(token);

    } else {
      // alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data
      if(data.type === 'new_message') {
        navigation.navigate("chat", {
          user: data.chatInfo,
          chatId: data.id,
        });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  

  useEffect(() => {
    menuActive[0] ? refRBSheet.current.open() : "";
  }, [menuActive[0]]);

  useEffect(() => {
    if (route.params !== undefined && route.params?.uploadPost !== false) {
      setshowUploadPostLoader(true);
      console.log(route.params.uploadPost);
      const continuePostUpload = async () => {
        fetch(`${server}/posts.php`, {
          method: "POST",
          body: route.params?.postDetails,
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("user-token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            mutate(`${server}/getFeed.php?portion=all`);
            console.log(data);
            route.params = undefined;
            setshowUploadPostLoader(false);
          });
      };
      continuePostUpload();
    }
  }, [route.params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Feed",
      headerTitleAlign: "center",
      headerLeft: () => <HeaderLeft />,
      headerRight: () => <HeaderRight profliePopupRef={refRBSheet2} />,
    });
    setTimeout(() => {
      setlayoutMounted(true);
    }, 2000);
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem("user-token").then((e) => {
      alert("logged Out");
      setsignedinUser(null);
      navigation.navigate("auth");
    });
  };

  const deletePost = async (pid) => {
    // alert(pid);
    // return
    fetch(`${server}/deletePost.php?pid=${pid}`, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("user-token")}`,
      },
    });
    mutate(`${server}/getFeed.php?portion=all`);
    refRBSheet.current.close();
    setmenuActive([false, "", ""]);
  };
  const refreshData = async () => {
    setrefreshing(true);
    await mutate(`${server}/getFeed.php?portion=all`);
    setrefreshing(false);
  };

  const onViewableItemsChanged = (vitem) => {
    setviewableItem(vitem.viewableItems[0]);
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged,
    },
  ]);

  const renderItem = ({ item }) => (
    <View key={item?.post?.id} className="self-center" style={{ width: "95%" }}>
      <Post
        user={signedinUser}
        post={item?.post}
        tags={item?.tags}
        comments={item?.comments}
        reactions={item?.reactions}
        setmenuActive={setmenuActive}
        menuActive={menuActive}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={layoutMounted ? headerHeight : 0}
    >
      {/* <ScrollView className='' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />} >
      

    </ScrollView> */}

      {feed?.length > 0 ? (
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={(item) => item?.post?.id}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          initialNumToRender={1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
          ListHeaderComponent={
            <>
              <View className="mt-10 mb-5">
                <AddPost user={signedinUser} />
              </View>

              <View className="mb-10 self-center" style={{ width: "90%" }}>
                <Text className="pb-2 text-xl">Stories</Text>
                <Stories />
              </View>
{/* 
              <Button onPress={()=> {
                sendPushNotification(signedinUser.userId, 'message')
              }} title="Push" /> */}

              {showUploadPostLoader ? (
                <View>
                  <Text style={{ width: "90%" }} className="self-center mb-2">
                    posting...
                  </Text>
                  <View
                    className="flex-row self-center bg-white mb-10 rounded-lg overflow-hidden p-2"
                    style={{ width: "90%" }}
                  >
                    <Image
                      source={{ uri: signedinUser.img }}
                      style={{ width: 30, height: 30 }}
                    />
                    <Progress.Bar
                      progress={0.3}
                      width={Dimensions.get("window").width}
                      borderRadius={0}
                      borderWidth={0}
                      color="#ccc"
                      height={30}
                      indeterminate
                    />
                  </View>
                </View>
              ) : (
                ""
              )}
            </>
          }
        />
      ) : (
        <Text>No Post Available</Text>
      )}

      <RBSheet
        ref={refRBSheet}
        height={450}
        closeOnDragDown={true}
        closeOnPressMask={true}
        openDuration={250}
        onClose={() => setmenuActive([false, "000"])}
        customStyles={{
          container: {
            borderRadius: 20,
            backgroundColor: "#e7e7e7",
          },
          draggableIcon: {
            backgroundColor: "#aab8b9",
          },
        }}
      >
        <View
          className="bg-white self-center p-2"
          style={{ width: "90%", height: "100%", borderRadius: 20 }}
        >
          <TouchableHighlight
            underlayColor={"#ececec"}
            onPress={() => console.log(menuActive[1])}
          >
            <View className="flex-row items-center p-4">
              <BookmarkIcon color={"red"} />
              <View className="ml-2">
                <Text className="font-bold">Save Post</Text>
                <Text className="text-xs text-gray-500">
                  add this to saved posts
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#ececec"}
            onPress={() => alert("copy link function")}
          >
            <View className="flex-row items-center p-4">
              <LinkIcon color={"red"} />
              <View className="ml-2">
                <Text className="font-bold ml-2">Copy Link</Text>
                <Text className="text-xs text-gray-500">
                  copy post link to clipboard
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#ececec"}
            onPress={() => alert("share post function")}
          >
            <View className="flex-row items-center p-4">
              <ShareIcon color={"red"} />
              <View className="ml-2">
                <Text className="font-bold">Share Post</Text>
                <Text className="text-xs text-gray-500">
                  share posts to other apps
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#ececec"}
            onPress={() => alert("Run report post function")}
          >
            <View className="flex-row items-center p-4">
              <FlagIcon color={"red"} />
              <View className="ml-2">
                <Text className="font-bold">Report Post</Text>
                <Text className="text-xs text-gray-500">
                  i am disturbed about this post
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          {menuActive[1] == signedinUser.userId ? (
            <TouchableHighlight
              underlayColor={"#ececec"}
              onPress={() => {
                deletePost(menuActive[2]);
              }}
            >
              <View className="flex-row items-center p-4">
                <TrashIcon color={"red"} />
                <View className="ml-2">
                  <Text className="font-bold">Delete Post</Text>
                  <Text className="text-xs text-gray-500">
                    this action cannot be undone
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          ) : (
            ""
          )}
        </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheet2}
        height={450}
        closeOnDragDown={true}
        closeOnPressMask={true}
        openDuration={250}
        onClose={() => setmenuActive([false, "000"])}
        customStyles={{
          container: {
            borderRadius: 20,
            backgroundColor: "#EBEEEC",
          },
          draggableIcon: {
            backgroundColor: "#aab8b9",
          },
        }}
      >

        <View className='flex-row items-center bg-white p-3 rounded-lg self-center' style={{width: '95%'}}>
          <Image style={{width: 50, height: 50}} className='rounded-full' source={{uri: signedinUser?.img}} />
          <View className='ml-3'>
            <Text className='font-bold text-lg'>{signedinUser.fName + " " + signedinUser.lName}</Text>
          </View>
        </View>

        <View>
          <Pressable onPress={() => {
            logUserOut(signedinUser.userId)
            setsignedinUser(null)
          }} className='flex-row items-center bg-white mt-3 self-center rounded-lg p-3 justify-center' style={{width: '95%'}}>
            <Text className='mr-2 text-base'>Logout</Text>
            <ArrowLeftCircleIcon color={'red'} />
          </Pressable>

          <Pressable onPress={() => {
            alert('navigate to settings sceen')
          }} className='flex-row items-center bg-white mt-3 self-center rounded-lg p-3 justify-center' style={{width: '95%'}}>
            <Text className='mr-2 text-base'>Setings</Text>
            <Cog6ToothIcon color={'red'} />
          </Pressable>
        </View>

        </RBSheet>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
