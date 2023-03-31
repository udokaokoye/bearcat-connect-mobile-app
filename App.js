import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import {
  ChatContext,
  CommentReply,
  LoggedIn,
  VideoMuted,
  ViewableItem,
  VideoPaused
} from "./lib/swr-hooks";
import { AuthContext } from "./lib/swr-hooks";
import AppLoading from "./components/AppLoading";
import jwtDecode from "jwt-decode";
import PostDetailsScreen from "./screens/PostDetailsScreen";
import CommentsViewScreen from "./screens/CommentsViewScreen";
import NewPostScreen from "./screens/NewPostScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import PostImageFullView from "./screens/PostImageFullView";
import StoriesScreen from "./screens/StoriesScreen";
import ChatList from "./screens/ChatList";
import Chat from "./screens/Chat";
import FullVideoScreen from "./screens/FullVideoScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { func } from "prop-types";
import AddPost from "./components/AddPost";
import HomeStack from "./TabScreens/HomeStack";
import SearchSTack from "./TabScreens/SearchSTack";
import NewPostStack from "./TabScreens/NewPostStack";
import ProfileStack from "./TabScreens/ProfileStack";
import NotificationStack from "./TabScreens/NotificationStack";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BellAlertIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { Image, Text, View } from "react-native";
import ContinueSignup from "./screens/ContinueSignup";
export default function App() {
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  const [signedinUser, setsignedinUser] = useState(null);
  const [replyComment, setreplyComment] = useState([
    false,
    {
      pid: "",
      replyId: "",
      name: "",
    },
  ]);
  const [viewableItem, setviewableItem] = useState([]);
  const [videosMuted, setvideosMuted] = useState(true);
  const [latestChat, setlatestChat] = useState([]);
  const [videoPaused, setvideoPaused] = useState(false)

  useEffect(() => {
    async function setauth() {
      const tk = await AsyncStorage.getItem("user-token");
      tk == null ? setsignedinUser(null) : setsignedinUser(jwtDecode(tk).data);
    }

    setauth();
  }, []);

  const [fontsLoaded] = useFonts({
    signpainter: require("./assets/fonts/SignPainter.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthContext.Provider value={{ signedinUser, setsignedinUser }}>
      <VideoMuted.Provider value={{ videosMuted, setvideosMuted }}>
      <VideoPaused.Provider value={{ videoPaused, setvideoPaused }}>
        <ViewableItem.Provider value={{ viewableItem, setviewableItem }}>
          <CommentReply.Provider value={{ replyComment, setreplyComment }}>
            <ChatContext.Provider value={{ latestChat, setlatestChat }}>
              <NavigationContainer>
                <TailwindProvider>
                  <Tab.Navigator
                    screenOptions={{
                      headerShown: false,
                      tabBarShowLabel: false,
                      tabBarStyle: {
                        borderRadius: 15,
                      },
                    }}
                  >
                    {signedinUser !== null ? (
                      <>
                        <Tab.Screen
                          options={{
                            tabBarIcon: ({ focused }) => (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <HomeIcon color={focused ? 'red' : 'black'} />
                              </View>
                            ),
                          }}
                          name="HomeTab"
                          component={HomeStack}
                        />
                        <Tab.Screen
                          options={{
                            tabBarIcon: ({ focused }) => (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <MagnifyingGlassIcon color={focused ? 'red' : 'black'} />
                              </View>
                            ),
                          }}
                          name="SearchTab"
                          component={SearchSTack}
                        />
                        <Tab.Screen
                          options={{
                            tabBarIcon: ({ focused }) => (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <PlusIcon color={focused ? 'red' : 'black'} />
                              </View>
                            ),
                          }}
                          name="NewTab"
                          component={NewPostStack}
                        />
                        <Tab.Screen
                          options={{
                            tabBarIcon: ({ focused }) => (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <BellAlertIcon color={focused ? 'red' : 'black'} />
                              </View>
                            ),
                          }}
                          name="NotificationStack"
                          component={NotificationStack}
                        />
                        <Tab.Screen
                          options={{
                            tabBarIcon: ({ focused }) => (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Image source={{uri: signedinUser.img}} style={{width: 30, height: 30, borderRadius: 30/2}} />
                              </View>
                            ),
                          }}
                          name="ProfileStack"
                          component={ProfileStack}
                        />

                      {/* <Tab.Screen name="continueSignup" component={ContinueSignup} options={{tabBarStyle: { display: "none" }}} /> */}
                      </>
                    ) : (
                      <>
                      <Tab.Screen name="auth" component={AuthScreen} options={{tabBarStyle: { display: "none" }}} />
                      </>
                    )}
                  </Tab.Navigator>
                </TailwindProvider>
              </NavigationContainer>
            </ChatContext.Provider>
          </CommentReply.Provider>
        </ViewableItem.Provider>
      </VideoPaused.Provider>
      </VideoMuted.Provider>
    </AuthContext.Provider>
  );
}
