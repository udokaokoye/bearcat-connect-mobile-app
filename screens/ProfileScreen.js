import { View, Text, Image, Pressable, ScrollView } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext, getPost, getPosts, GetUser } from "../lib/swr-hooks";
import { useNavigation } from "@react-navigation/native";
import { ChatBubbleLeftRightIcon } from "react-native-heroicons/outline";
import Post from "../components/Post";
import AppLoading from "../components/AppLoading";
import NoPostFound from "../components/NoPostFound";
const ProfileScreen = ({ route }) => {
  const { uid } = route.params;
  const { posts, isValidating } = getPosts("userId", uid);
  const [optionBarSelector, setoptionBarSelector] = useState(1)
  const userProfile = GetUser(route.params.uid).userData;
  const navigation = useNavigation();
  const {setsignedinUser, signedinUser} = useContext(AuthContext)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${userProfile?.firstName ? userProfile?.firstName : ""}`,
    });
  }, [userProfile]);
  

  return (
    <ScrollView style={{flex: 1}}>
        <View 
        style={{shadowColor: '#0000007b',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 2,  
      elevation: 15,}}
      >
        <View className="bg-white rounded-xl overflow-hidden self-center mb-5 mt-5"
      style={{ width: "95%", }}>
      <View style={{ height: 340 }}>
        <Image
          className="h-52"
          source={{ uri: userProfile?.cover_picture }}
          style={{ width: "100%" }}
        />
        <View
          className="px-3 flex-row mt-5"
        >
          <Image
            source={{ uri: userProfile?.profile_picture }}
            className="rounded-full border-gray-200"
            style={{ width: 100, height: 100, borderWidth: 1 }}
          />
          <View style={{ marginLeft: 10, marginTop: 0, width: "55%" }}>
            <Text className="text-xl font-bold">
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            <Text className='my-2'>@{userProfile?.username}</Text>
            <View className="flex-row">
              <Text className="text-sm font-bold">1 Follower</Text>
              <Text className="mx-2 text-sm font-bold">|</Text>
              <Text className="text-sm font-bold">2 Following</Text>
            </View>
            <Pressable
              onPress={() => alert("run follow function")}
              style={{ height: 50, width: 150, marginTop: 10 }}
              className="bg-red-500 rounded-lg justify-center"
            >
              <Text className="text-white font-bold text-center">Follow +</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => alert("navigate to chat screen")}
            className="bg-red-600 rounded-full justify-center items-center"
            style={{ width: 50, height: 50, marginTop: 30 }}
          >
            <ChatBubbleLeftRightIcon color={"white"} size={25} />
          </Pressable>
        </View>
      </View>

      <View className='flex-row mt-10 mb-5' style={{width: '100%'}}>
        <Pressable onPress={() =>  setoptionBarSelector(1)} className={`justify-center items-center ${optionBarSelector == 1 && 'border-red-600'}`} style={{width: '25%', height: 50, borderBottomWidth: optionBarSelector == 1 ? 2 : 0}}><Text className={`text-black text-md ${optionBarSelector == 1 && 'font-bold'}`}>Posts</Text></Pressable>
        <Pressable onPress={() =>  setoptionBarSelector(2)} className={`justify-center items-center ${optionBarSelector == 2 && 'border-red-600'}`} style={{width: '25%', height: 50, borderBottomWidth: optionBarSelector == 2 ? 2 : 0}}><Text className={`text-black text-md ${optionBarSelector == 2 && 'font-bold'}`}>About</Text></Pressable>
        <Pressable onPress={() =>  setoptionBarSelector(3)} className={`justify-center items-center ${optionBarSelector == 3 && 'border-red-600'}`} style={{width: '25%', height: 50, borderBottomWidth: optionBarSelector == 3 ? 2 : 0}}><Text className={`text-black text-md ${optionBarSelector == 3 && 'font-bold'}`}>Photos</Text></Pressable>
        <Pressable onPress={() =>  setoptionBarSelector(4)} className={`justify-center items-center ${optionBarSelector == 4 && 'border-red-600'}`} style={{width: '25%', height: 50, borderBottomWidth: optionBarSelector == 4 ? 2 : 0}}><Text className={`text-black text-md ${optionBarSelector == 4 && 'font-bold'}`}>Videos</Text></Pressable>
       
        
      </View>
      </View>

      
      </View>

      <View className=' bg-gray-100 self-center' style={{ width: "95%" }}>
      {isValidating ? (
                            <Text>Loading</Text>
                    ) : posts?.length > 0 ? posts?.map((post, index) => (
                    
                            <Post key={post.post.id} user={signedinUser} post={post.post} tags={post.tags} comments={post.comments} />
                      
                    ))
                    :<Text> No Post Found </Text>
                  }
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
