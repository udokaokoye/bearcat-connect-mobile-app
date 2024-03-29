import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext, server } from "../lib/swr-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import jwtDecode from "jwt-decode";
import { auth } from "../firebase";
import { openBrowserAsync } from "expo-web-browser";
const AuthScreen = () => {
  const [signinemail, setsigninemail] = useState("");
  const [signinpassword, setsigninpassword] = useState("");
  const navigation = useNavigation();
  const { setsignedinUser } = useContext(AuthContext);
  const headerHeight = useHeaderHeight();

  const handelSignIn = async () => {
    // return;
    const formData = new FormData();
    if (signinemail == "" || signinpassword == "") {
      alert("Please Fill In All Fields");
    } else {
      formData.append("user", signinemail);
      formData.append("password", signinpassword);
      const url = signinemail.includes("@mail.uc.edu")
        ? `${server}/login.php`
        : `${server}/login.php?withUsername=1`;

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(async (data) => {
          // console.log(data[3]);
          // return;
          if (data[0] == "SUCCESS") {
            AsyncStorage.setItem("user-token", data[2]).then((tk) => {
              alert("SUCCESS");
              setsignedinUser(jwtDecode(data[2]).data);
              data[3] == "true"
                ? navigation.navigate("continueSignup")
                : navigation.navigate("home");
            });
          } else if (data == "wrong") {
            alert("Wrong username or password");
          }
        });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    // <View >
    <View
      className="flex-1 text-white align-baseline items-center"
      style={{ backgroundColor: "#02212F", width: "100%", flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <Image
        source={require("../assets/bcatslogo.png")}
        style={{ width: 100, height: 100, marginTop: 50 }}
      />
      <Text
        className="text-white text-center mt-10"
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
          onChangeText={(e) => setsigninemail(e)}
          autoCapitalize={false}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="password"
          className="p-3 overflow-hidden bg-white h-18 mt-10"
          style={{ width: "70%", borderRadius: 5 }}
          placeholderTextColor="#000"
          secureTextEntry
          onChangeText={(e) => setsigninpassword(e)}
          autoCapitalize={false}
        />
        <TouchableOpacity
          style={{ width: "70%" }}
          onPress={() => handelSignIn()}
        >
          <View
            className="bg-red-600 h-16 mt-10 justify-center items-center"
            style={{ borderRadius: 5 }}
          >
            <Text className="text-white text-xl font-bold">Sign In</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center mt-8" style={{ width: "70%" }}>
          <Text className="text-white">Don't have an account</Text>
          <Pressable onPress={() => openBrowserAsync("http://localhost:3001/")}>
            <Text className="text-red-500 font-bold ml-1">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;
