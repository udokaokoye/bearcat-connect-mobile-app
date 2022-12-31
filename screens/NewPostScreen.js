import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Button,
  Dimensions,
  Animated,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  MapIcon,
  MapPinIcon,
  PhotoIcon,
  UserPlusIcon,
} from "react-native-heroicons/outline";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostMedia from "../components/PostMedia";
const NewPostScreen = ({ route }) => {
  const [images, setimages] = useState([]);
  const [orientation, setorientation] = useState([])
  const [caption, setcaption] = useState("");
  const [token, settoken] = useState(null)
  const navigation = useNavigation();
  const [readyFire, setreadyFire] = useState(false)
  const headerHeight = useHeaderHeight();
  const { user } = route.params;

  const [openTagUserTab, setopenTagUserTab] = useState(false)



  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Post",
      headerRight: () => (
        <Button title="Post" onPress={() => {
            addPost()
        }} />
      ),
    });
  }, [navigation, caption, images, orientation]);


  const tagUserListen = (e) => {
    if (e.nativeEvent.key === '@') {
      console.log("@ pressed")
      setopenTagUserTab(true)
      // _showBottomView("HIDE")
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    result.assets.forEach((ass) => {
      // console.log(ass.height + " " + ass.width);
      setimages(images => [...images, ass.uri]);
      if (ass.width > ass.height) {
        console.log("l")
        setorientation((current) => [...current, 'l'])
    } else if(ass.width < ass.height) {
        console.log("p")
        setorientation((current) => [...current, 'p'])
    } else {
        // console.log("l")
        setorientation((current) => [...current, 'l'])
    }
    });
  };




  const addPost = async () => {
    const formData = new FormData();
    if (caption === '') {
        alert("Enter Caption")
        return false;
      }
  formData.append("userId", user.userId)
  formData.append("caption", caption)
  formData.append("location", '')
  formData.append("orientation[]", orientation)
  console.log(images.length)
//   return;

  for (let i = 0; i < images.length; i++) {
    let filename = images[i].split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Assume "photo" is the name of the form field the server expects
    formData.append("files[]", { uri: images[i], name: filename, type });
  }

  fetch('http://192.168.1.51/bearcats_connect/posts.php', {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
     },
  }).then((res) => res.json()).then((data) => {
      setcaption('')
      console.log(data)
  })
}
   

  




  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? headerHeight : headerHeight + 15
        }
      >
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <View className="flex-row items-center">
            <Image
              className="rounded-full"
              source={{ uri: user.img }}
              style={{ width: 40, height: 40 }}
            />
            <Text className="ml-2 text-lg">
              {user.fName + " " + user.lName}
            </Text>
          </View>
          <TextInput
            onChangeText={e => setcaption(e)}
            // value={caption}
            className="mt-5"
            placeholderTextColor={"gray"}
            placeholder={`What's happening ${user.fName}?`}
            style={{ width: "100%" }}
            onKeyPress={(e) => {
              tagUserListen(e)
            }}
            multiline
          />

          {images.length > 0 &&
            <PostMedia fileType={'image'} files={images} orientation={orientation} />
            }
            {/* <Text>{orientation[4]}</Text> */}
          {/* <Button title="click me" onPress={() => addPost()} /> */}
        </ScrollView>

        <View
          className="rounded-xl items-center p-3"
          // style={{
          //   position: 'absolute',
          //   bottom: 0,
          //   width: width,
          //   height: height * 0.3,
          //   borderWidth: 1,
          //   borderColor: "#9797976b",
          // }}
        >
          <View className="w-12 h-2 bg-gray-200 mt-1 mb-3 rounded-xl"></View>
          <View className="flex-row space-x-20 items-center justify-center justify-self-center mb-3">
            <TouchableOpacity onPress={() => pickImage()}>
              <PhotoIcon color={"green"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <UserPlusIcon color={"blue"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MapPinIcon color={"red"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewPostScreen;
