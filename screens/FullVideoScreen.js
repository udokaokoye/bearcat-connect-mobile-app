import { View, Text, SafeAreaView, Image, Pressable } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState, } from "react";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { Video } from "expo-av";
import { CameraIcon, ChatBubbleBottomCenterIcon, HeartIcon, PaperAirplaneIcon } from "react-native-heroicons/outline";
import { LinearGradient } from 'expo-linear-gradient';
const FullVideoScreen = ({ route }) => {
  const { post, user, authorsFirstName } = route.params;
  const videoRef = useRef(null);
  const [videoStatus, setvideoStatus] = useState({});
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //   useEffect(() => {
  //     console.log(post?.profile_picture);
  //   }, []);

  return (
    <View className=" bg-black flex-1 relative ">

        <View
          style={{ width: "100%" }}
          className="flex-row justify-between items-center p-3 absolute top-16 z-10"
        >
          <Pressable onPress={() => navigation.goBack()} className=" w-10 h-10 rounded-full justify-center items-center">
            <ChevronLeftIcon color={"#fff"} />
          </Pressable>

          <Text className="text-white text-lg font-bold">Reels</Text>

          <CameraIcon color={"#fff"} />
        </View>

        <View>
          <Video
            ref={videoRef}
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: post?.images[0],
            }}
            useNativeControls={false}
            resizeMode="cover"
            isLooping
            // isMuted
            shouldPlay
            onPlaybackStatusUpdate={(status) => setvideoStatus(() => status)}
            //   onLoad={handleLoad}
            // onUnload={handleUnload}
          />
        </View>


        <View className=" absolute z-10 bottom-0" style={{width: '100%', height: 290}}>
        <LinearGradient
        colors={["#00000000", "#000000"]}
        className='p-3 flex-row justify-between'
        style={{height: '100%'}}
      >
          <View className='mb-5' style={{height: "auto", marginTop: 'auto', width: '80%'}}>
            <View className="flex-row items-center">
              <Image
                source={{ uri: post?.profile_picture }}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
                className=" rounded-full"
              />
              <Text className="text-white font-bold ml-2">
                {post?.username}
              </Text>
            </View>
            <Text className="text-white mt-2">{post?.caption}</Text>
          </View>
          <View style={{width: '10%', height: 500}} className='items-center'>
            <View className='mb-5'>
                <HeartIcon color={'#fff'} />
                <Text className='text-white'>300k</Text>
            </View>
            <View className='mb-5'>
                <ChatBubbleBottomCenterIcon color={'#fff'} />
                <Text className='text-white'>512</Text>
            </View>
            <View className='mb-5'>
                <PaperAirplaneIcon color={'#fff'} />
            </View>
            <Text className='mb-5 text-white'>...</Text>
          </View>
      </LinearGradient>
        </View>
    </View>
  );
};

export default FullVideoScreen;
