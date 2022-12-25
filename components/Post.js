import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext } from "react";
// import { AuthContext } from '../lib/swr-hooks'
import { HeartIcon, MapPinIcon } from "react-native-heroicons/outline";
import {
  ChatBubbleOvalLeftIcon,
  ShareIcon,
} from "react-native-heroicons/outline";
import CommentEntry from "./CommentEntry";
import PostMedia from "./PostMedia";
import { locationList } from "../lib/swr-hooks";
import moment from "moment";
const Post = ({ user, post, comments }) => {
  let postLocation = {
    name:
      post.location !== ""
        ? locationList.filter((e) => e.id == post.location)[0].name
        : "",
    campus:
      post.location !== ""
        ? locationList.filter((e) => e.id == post.location)[0].campus
        : "",
  };
  return (
    <View
      className="flex-row bg-white p-3 mb-10 self-center rounded-lg"
      style={{ width: "100%" }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0">
          <Image
            source={{ uri: user?.img }}
            resizeMode="cover"
            style={{
              width: 30,
              height: 30,
            }}
            className="rounded-full"
          />

          <View className="flex-row items-center justify-between flex-1 ml-3">
            <Text className="text-lg flex-1">
              {post?.fName + " " + post?.lName}{" "}
              <Text className=" text-xs">@{post.username}</Text>
            </Text>
            <Text className="">...</Text>
          </View>
        </View>

        {post.location !== '' ? (
          <View className='flex-row items-center ml-9 mb-1'>
          <MapPinIcon size={20} color={'red'} />
          <Text className="text-xs text-gray-500 ml-1">
            {postLocation.name}, {postLocation.campus}
          </Text>
        </View>
        ) : ''}

        

        <Text className="text-xs text-gray-500 mb-2 ml-10">{moment(post?.createdDate).fromNow()}</Text>
        <Text className=" text-sm" style={{ width: "100%" }}>
          {post.caption}
        </Text>

        {post.images.length > 0 ? (
          <PostMedia
            files={post.images}
            orientation={post.orientation}
            fileType={"images"}
          />
        ) : (
          ""
        )}

        {/* <PostMedia files={[
          // 'https://images.unsplash.com/photo-1647891938250-954addeb9c51?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          // 'https://images.unsplash.com/photo-1647891940243-77a6483a152e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',

          // 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          // 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          // 'https://images.unsplash.com/photo-1647891940243-77a6483a152e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          
          
          'https://images.unsplash.com/photo-1647891940243-77a6483a152e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          'https://images.unsplash.com/photo-1647891940243-77a6483a152e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',


          // 'https://images.unspl1ash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          // 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ]} orientation={['p', 'l', 'l', 'p']} /> */}
        <Text className="text-xs self-end text-gray-400 mt-2">
          {comments?.count} comments
        </Text>

        <View className="flex-row justify-between mt-5 mb-5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-md bg-gray-300"
            style={{ width: "30%", height: 30 }}
          >
            <HeartIcon color={"red"} />
            <Text className="ml-1 text-xs">Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-md bg-gray-300"
            style={{ width: "30%", height: 30 }}
          >
            <ChatBubbleOvalLeftIcon color={"red"} />
            <Text className="ml-1 text-xs">Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-md bg-gray-300"
            style={{ width: "30%", height: 30 }}
          >
            <ShareIcon color={"red"} />
            <Text className="ml-1 text-xs">Share</Text>
          </TouchableOpacity>
        </View>

        <CommentEntry user={user} />
      </View>
    </View>
  );
};

export default Post;
