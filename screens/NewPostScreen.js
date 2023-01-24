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
  TouchableHighlight,
  Pressable,
  TouchableNativeFeedback,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
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
import RBSheet from "react-native-raw-bottom-sheet";
import { GetUser, server } from "../lib/swr-hooks";
import ProfileCard from "../components/ProfileCard";
import { MentionInput, replaceMentionValues } from 'react-native-controlled-mentions'
import { setStatusBarBackgroundColor } from "expo-status-bar";
import {mutate} from 'swr'
import numeral from "numeral";
const NewPostScreen = ({ route }) => {
  // var numeral = require('numeral');

  const [images, setimages] = useState([]);
  const [orientation, setorientation] = useState([])
  const [caption, setcaption] = useState("");
  const [suggestions, setsuggestions] = useState([])
  const [hashtagsSuggestions, sethashtagsSuggestions] = useState([])
  // const [tggdUsers, settggdUsers] = useState([])
  const [token, settoken] = useState(null)
  const navigation = useNavigation();
  const [readyFire, setreadyFire] = useState(false)
  const headerHeight = useHeaderHeight();
  const { user } = route.params;

  const [openTagUserTab, setopenTagUserTab] = useState(false)

  const refRBSheet = useRef();
  const captionRef = useRef();
  const {userData, isValidating} = GetUser(user.userId);

  const [searchPhrase, setsearchPhrase] = useState('')
  const [searchResult, setsearchResult] = useState([])
  useEffect(() => {
    // console.log(searchPhrase)
    fetch(`${server}/tagSearch.php?phrase=${searchPhrase}`).then((res) => res.json()).then((data) => {
    setsearchResult(data)
    // console.log(data)
    })
  }, [searchPhrase])
  

  useLayoutEffect(() => {
    // console.log(userData.following.following[1])
    navigation.setOptions({
      headerTitle: "Add Post",
      headerRight: () => (
        <Button title="Post" onPress={() => {
            addPost()
        }} />
      ),
    });
  }, [navigation, caption, images, orientation, isValidating]);

  const tagUserListen = (e) => {
    if (e.nativeEvent.key === '@') {
      setopenTagUserTab(true)
      // console.log("@ pressed")
      refRBSheet.current.open()
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
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


 const tagSelected = (taggedUserInfo) => {
  setcaption([caption , (<Text className='bg-gray-400 text-xs'>{taggedUserInfo.username}</Text>), ' '])
  // setcaption(caption + `<Text className='text-red-500'>${taggedUserInfo.username}</Text>`)
  setsearchResult([])
  setsearchPhrase('')
  refRBSheet.current.close()
 }

  const addPost = async () => {
    // console.log(replaceMentionValues(caption, ({id}) => `@${id}`));
    // alert('check vs code console')
    var taggedUsers = []
    replaceMentionValues(caption, ({id}) => {
      taggedUsers.push(id)
    })
    // return;
    const formData = new FormData();
    if (caption === '') {
        alert("Enter Caption")
        return false;
      }
      // console.log(taggedUsers)
      // return;
  formData.append("userId", user.userId)
  formData.append("caption", replaceMentionValues(caption, ({id}) => `@${id}`))
  formData.append("location", '')
  formData.append("orientation", orientation)
  formData.append("taggedUsers", taggedUsers)
  // console.log(images.length)
//   return;

  for (let i = 0; i < images.length; i++) {
    let filename = images[i].split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Assume "photo" is the name of the form field the server expects
    formData.append("files[]", { uri: images[i], name: filename, type });
  }

  fetch(`${server}/posts.php`, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
     },
  }).then((res) => res.json()).then((data) => {
      setcaption('')
      mutate(`${server}/getFeed.php?portion=all`)
      console.log(data)
      navigation.navigate('home')
  })
}
   
const renderSuggestions = ({keyword, onSuggestionPress}) => {
  
  if (keyword == null) {
    return null;
  }
  fetch(`${server}/tagSearch.php?phrase=${keyword}`).then((res) => res.json()).then((data) => {
    setsuggestions(data)
    // console.log(data)
    })

  return (
    <View style={{width: '100%', height: '100%'}}>
    <ScrollView nestedScrollEnabled={true} className='bg-white rounded-2xl mt-5' style={{width: 300, height:300}}>
      {suggestions.length >  0 ? suggestions.map(sugg => (
        <View key={sugg.id}>
          <Pressable
            
            onPress={() => onSuggestionPress({...sugg, name: sugg.username})}

            style={{padding: 12, borderBottomWidth: 1}}
            className='flex-row border-gray-200'
          >
            <Image 
            source={{uri: sugg.profile_picture}} 
            style={{width: 40, height: 40}} 
            className='rounded-full' />
            <View className='flex-col ml-3'>
            <Text className='font-bold'>{sugg.firstName} {sugg.lastName}</Text>
            <Text className=' font-semibold'><MapPinIcon color='red' size={15} /> {sugg.campus}</Text>
            </View>
          </Pressable>

          </View>
        )) : (
          <View>
            <Text className='text-center mt-5 font-bold'>Start searching...</Text>
          </View>
        )
      }
    </ScrollView>
    </View>
  );
};


const renderHashTags = ({keyword, onSuggestionPress}) => {
  
  if (keyword == null) {
    return null;
  }
  fetch(`${server}/hashTagSearch.php?phrase=${keyword}`).then((res) => res.json()).then((data) => {
    sethashtagsSuggestions(data)
    // console.log(data)
    })

  return(
    <View className='mt-5'>
      {hashtagsSuggestions.length > 0 ? hashtagsSuggestions.map((hashtagSugg) => (

          <Pressable
            key={hashtagSugg.id}
            onPress={() => onSuggestionPress({...hashtagSugg, name: `${hashtagSugg.tag}`})}

            style={{padding: 12, borderBottomWidth: 1}}
            className='flex-row border-gray-200'
          >
            <View className='flex-col'>
            <Text className='font-bold'>#{hashtagSugg.tag}</Text>
            <Text className=' font-semibold italic'>{numeral(hashtagSugg.count).format('0a')} posts</Text>
            </View>
          </Pressable>
      )) : (
        <View>
          <Text>Trending Now</Text>
        </View>
      )}
    </View>
  )

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

          <MentionInput
          value={caption}
          onChange={(txt) => setcaption(txt)}

          partTypes={[
            {
              trigger: '@', // Should be a single character like '@' or '#'
              renderSuggestions,
              textStyle: {fontWeight: 'bold', color: 'black', backgroundColor: '#bcbbbb', fontSize: 10}, // The mention style in the input
              isBottomMentionSuggestionsRender: true
            },
            {
              trigger: '#',
              renderSuggestions: renderHashTags,
              textStyle: {fontWeight: 'bold', color: 'red'}, // The mention style in the input
              isBottomMentionSuggestionsRender: true
            }
          ]}
          // style={{height: 300,}}
          placeholder={`What's happening ${user.fName}?`}
          className='mt-5 py-5'
          style={{height: 'auto'}}
          />
          {/* <TextInput
            onChangeText={e => setcaption(e)}
            // value={caption}
            
            autoComplete={false}
            autoCorrect={false}
            className="mt-5"
            placeholderTextColor={"gray"}
            placeholder={`What's happening ${user.fName}?`}
            style={{ width: "100%" }}
            onKeyPress={(e) => {
              tagUserListen(e)
            }}
            multiline
          >
            
                <Text>{caption}</Text>
            </TextInput> */}

          {images.length > 0 &&
            <PostMedia fileType={'image'} files={images} orientation={orientation} />
            }
            {/* <Text>{orientation[4]}</Text> */}
          {/* <Button title="click me" onPress={() => addPost()} /> */}
        </ScrollView>

    <View style={{ width: '100%', height: 120, bottom: 0, shadowColor: '#0000007b',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 20,  
      elevation: 10, backgroundColor: 'white'}} className='rounded-xl'>
      <Pressable onPress={() => refRBSheet.current.open()} className="w-12 h-2 bg-gray-200 mt-2 mb-3 rounded-3xl self-center"></Pressable>
    <View  className="flex-row space-x-20 items-center justify-center justify-self-center mt-6 mb-6">
                <TouchableOpacity onPress={() => pickImage()}>
                  <PhotoIcon color={"green"} />
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomWidth: openTagUserTab ? 1 : 0, paddingBottom: 5}}>
                  <UserPlusIcon color={"blue"} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MapPinIcon color={"red"} />
                </TouchableOpacity>
              </View>
    </View>


          {/* <View className="w-12 h-2 bg-gray-200 mt-1 mb-3 rounded-xl"></View> */}
          <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={Dimensions.get('window').height - headerHeight}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent"
            },
            draggableIcon: {
              backgroundColor: "#aab8b9"
            },
          }}
        >
          <View style={{position: 'absolute', width: '100%'}} className="flex-row space-x-20 items-center justify-center justify-self-center mt-10 mb-10">
            <TouchableOpacity onPress={() => pickImage()}>
              <PhotoIcon color={"green"} />
            </TouchableOpacity>
            <TouchableOpacity style={{borderBottomWidth: openTagUserTab ? 1 : 0, paddingBottom: 5}}>
              <UserPlusIcon color={"blue"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MapPinIcon color={"red"} />
            </TouchableOpacity>
          </View>

          { openTagUserTab ? (
          <View className='mt-10 p-5'>
            <Text className='text-xl'>Mention Person</Text>

            <TextInput onChangeText={(txt) => setsearchPhrase(txt)} className='mt-3 rounded-md p-2 mb-5' placeholder="start searching..." style={{width: '100%', borderWidth: 1, borderColor: 'silver'}} />
            {searchPhrase == '' ? 
            userData?.following?.following.length > 0 ? userData?.following?.following.slice(0, 15).map((followingUser, index) => (
              <TouchableNativeFeedback onPress={() => tagSelected(followingUser)}>
                <View><ProfileCard key={index} user={followingUser}/></View>
              </TouchableNativeFeedback>
          )) : ""
            : searchResult.map((res) => (
              <TouchableNativeFeedback onPress={() => tagSelected(res)}>
                <View><ProfileCard user={res} /></View>
              </TouchableNativeFeedback>
            ))}
            {/* {userData?.following?.following.length > 0 ? userData?.following?.following.slice(0, 15).map((followingUser, index) => (
                <ProfileCard key={index} user={followingUser}/>
            )) : "" } */}
          </View>
          ) : ''}
        </RBSheet>

      </KeyboardAvoidingView>
    </View>
  );
};

export default NewPostScreen;
