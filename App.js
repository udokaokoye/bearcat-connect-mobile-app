
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { CommentReply, LoggedIn } from "./lib/swr-hooks";
import { AuthContext } from "./lib/swr-hooks";
import AppLoading from "./components/AppLoading";
import jwtDecode from "jwt-decode";
import PostDetailsScreen from "./screens/PostDetailsScreen";
import CommentsViewScreen from "./screens/CommentsViewScreen";
import NewPostScreen from "./screens/NewPostScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
export default function App() {
  const Stack = createNativeStackNavigator();
  const [signedinUser, setsignedinUser] = useState(null)
  const [replyComment, setreplyComment] = useState([false, {
    pid: '',
    replyId: '',
    name: ''
  }])


  useEffect( () => {
    async function setauth() {
      const tk = await AsyncStorage.getItem('user-token');
      tk == null ? setsignedinUser(null) : setsignedinUser(jwtDecode(tk).data)
    }

    setauth()
  }, [])
  

  
  const [fontsLoaded] = useFonts({
    'signpainter': require('./assets/fonts/SignPainter.ttf'),
  });

  if (!fontsLoaded) {
    return (<AppLoading />)
  }

  return (
    <AuthContext.Provider value={{ signedinUser, setsignedinUser }}>
      <CommentReply.Provider value={{replyComment, setreplyComment}}>
    <NavigationContainer>
      <TailwindProvider>
        <Stack.Navigator>
        {
           signedinUser !== null ? (
            <>
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="newpost" component={NewPostScreen} />
            <Stack.Screen name="postdetails" component={PostDetailsScreen} />
            <Stack.Screen name="commentview" component={CommentsViewScreen} />
            <Stack.Screen name="profile" component={ProfileScreen} />
            <Stack.Screen name="search" component={SearchScreen} />
            </>
          ) : (
            <Stack.Screen name="auth" component={AuthScreen} />
          )
        }
        </Stack.Navigator>
      </TailwindProvider>
    </NavigationContainer>
    </CommentReply.Provider>
    </AuthContext.Provider>
  );
}
