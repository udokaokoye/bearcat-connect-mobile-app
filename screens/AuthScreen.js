import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsynStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "../lib/swr-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthScreen = () => {
  const [signinemail, setsigninemail] = useState('')
  const [signinpassword, setsigninpassword] = useState('')
  const navigation = useNavigation();
  const {setisSignedIn} = useContext(AuthContext)

  const handelSignIn = async () => {
    // await SecureStore.deleteItemAsync('user-token')
    // setisSignedIn('true')
    // navigation.navigate('home')
    // const token =  AsynStorage.getItem('user-token').then((tk) => {
    //   // console.log(tk)
    //   return tk
    // })
    // console.log( await token)
    // console.log(await SecureStore.getItemAsync('user-token'));
    // SecureStore.setItemAsync('user-token', '1111')
    // AsynStorage.removeItem("user-token");
    // console.log(AsynStorage.getItem('hello').then((token) => {
    //   return token
    // }))
    // AsynStorage.getItem('user-token').then((token) => {
    //   console.log(token)
    // })
    // return;
    const formData = new FormData()
    if (signinemail == '' || signinpassword == "") {
      alert("Please Fill In All Fields")
    } else {
        formData.append('user', signinemail)
        formData.append('password', signinpassword)
        const url = signinemail.includes("@mail.uc.edu") ? "http://192.168.1.51/bearcats_connect/login.php" : "http://192.168.1.51/bearcats_connect/login.php?withUsername=1"

        fetch(url, {
          method: "POST",
          body: formData
        }).then((res) => res.json()).then(async (data) => {
          if (data[0] == "SUCCESS") {
            const token =  AsyncStorage.getItem('user-token').then((tk) => {
              return tk
            })
            AsyncStorage.setItem('user-token', data[2]).then((tk) => {
              alert("SUCCESS")
              setisSignedIn('true')
              navigation.navigate('home')
            })


          } else if (data == "wrong") {
            alert("Wrong username or password")
          }
        })
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView
      className="flex-1 text-white align-baseline items-center"
      style={{ backgroundColor: "#02212F", width: "100%" }}
    >
      <Image
        className=""
        source={require("../assets/bcatslogo.png")}
        style={{ width: 100, height: 100, marginTop: 50 }}
      />
      <Text
        className="text-white font-bold text-center mt-10"
        style={{ fontFamily: "signpainter", fontSize: 50 }}
      >
        Bearcats Connect
      </Text>

      <View className="items-center mt-10" style={{ width: "100%" }}>
        <TextInput
          placeholder="username/email"
          className="p-3 overflow-hidden bg-white h-18"
          style={{ width: "70%", borderRadius: 5 }}
          placeholderTextColor="#000"
          onChangeText={e => setsigninemail(e)}
          autoCapitalize={false}
          keyboardType='email-address'
        />
        <TextInput
          placeholder="password"
          className="p-3 overflow-hidden bg-white h-18 mt-10"
          style={{ width: "70%", borderRadius: 5 }}
          placeholderTextColor="#000"
          secureTextEntry
          onChangeText={e => setsigninpassword(e)}
          autoCapitalize={false}
        />
        <TouchableOpacity style={{ width: "70%" }} onPress={() => handelSignIn()}>
          <View
            className="bg-red-600 h-16 mt-10 justify-center items-center"
            style={{borderRadius: 5}}
          >
            <Text className='text-white text-xl font-bold'>Sign In</Text>
          </View>
        </TouchableOpacity>

        <Text className='text-white mt-8' style={{width: "70%"}}>Don't have an account <Text className='text-red-500 font-bold'>Sign Up</Text></Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;