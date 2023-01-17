import { View, Text, Image, ScrollView, TouchableOpacity, TouchableNativeFeedback } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { getPost } from "../lib/swr-hooks";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
// import { HeartIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { ChatBubbleBottomCenterIcon } from "react-native-heroicons/outline";

const PostDetailsScreen = ({ route }) => {
  const { pid, user, authorsFirstName } = route.params;
  const navigation = useNavigation();
  const { post, postValidating } = getPost(pid);
  const postData = post?.post;
  const comments = post?.comments.comments.filter((e) => e.reply_id == "null");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${authorsFirstName + "'s Post"}`,
    //   headerTintColor: 'red',
    //   titleStyle:{color:'black'},
    });

  }, [navigation]);


  return (
    <ScrollView style={{flex:1}}>
    <View className="bg-white mt-2 p-3">
      <View className="flex-row">
        <Image
          className=" rounded-full"
          source={{ uri: postData?.profile_picture }}
          style={{ width: 50, height: 50 }}
        />

        <View className="ml-5">
          <Text className="text-lg font-semibold">
            {postData?.fName} {postData?.lName}
          </Text>
          <Text className="text-gray-500 text-xs">
            {moment(postData?.createdDate).fromNow()}
          </Text>
        </View>
      </View>

      <Text className=" mt-2 text-gray-900">{postData?.caption}</Text>







      <View className="mt-3 flex-row justify-between">
        <Text className="">
          <HeartIcon color={"red"} size="15" /> 200
        </Text>
        <TouchableOpacity 
        onPress={() => navigation.navigate('commentview', {
            user: user,
            pid: pid,
            authorsFirstName: authorsFirstName
        })} className="text-gray-500">
        <Text>{post?.comments?.count} comments</Text>
        </TouchableOpacity>
      </View>

      <View className='flex-row justify-between mt-4 border-t border-b p-3' style={{borderColor: '#464646ac'}}>
        <View className='flex-row items-center space-x-1'>
          <HeartIcon color={'red'} /> 
          <Text>Like</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('commentview', {
            user: user,
            pid: pid,
            authorsFirstName: authorsFirstName
        })} className='flex-row items-center space-x-1'>
          <ChatBubbleBottomCenterIcon color={'red'} /> 
          <Text>Comment</Text>
        </TouchableOpacity>
      </View>

      
    </View>

{postData?.images.map((img, index) => (
<View key={index} className=' mt-2 mb-3 bg-white'>
    <Image resizeMode="contain" source={{uri: img}} style={{width: "100%", height: postData?.orientation[index] == 'p' ? 600 : 300}}/>
</View>
))}
</ScrollView>
  );
};

export default PostDetailsScreen;
