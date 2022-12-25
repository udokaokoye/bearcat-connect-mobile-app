
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { LoggedIn } from "./lib/swr-hooks";
import { AuthContext } from "./lib/swr-hooks";
import AppLoading from "./components/AppLoading";
import jwtDecode from "jwt-decode";
export default function App() {
  const Stack = createNativeStackNavigator();
  const [signedinUser, setsignedinUser] = useState(null)
  //  AsyncStorage.getItem('user-token').then((token) => {
  //   setsignedinUser(token == null ? false : true)
  // })

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
    <NavigationContainer>
      <TailwindProvider>
        <Stack.Navigator>
        {
           signedinUser !== null ? (
            <Stack.Screen name="home" component={HomeScreen} />
          ) : (
            <Stack.Screen name="auth" component={AuthScreen} />
          )
        }
        </Stack.Navigator>
      </TailwindProvider>
    </NavigationContainer>
    </AuthContext.Provider>
  );
}
