import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import Comment from "./Comment";
import { useNavigation } from "@react-navigation/native";
import reactStringReplace from 'react-string-replace';
const Post = ({ user, post, comments, tags }) => {
  const [caption, setcaption] = useState(post?.caption)
  const [tgcounter, settgcounter] = useState(0)
  const navigation = useNavigation()
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
  // setcaption(post.caption)
  const [replacedtext, setreplacedtext] = useState(post?.caption)
// let replacedText = '1111';
var rtext = post?.caption

useEffect(() => {
  if (tags.length > 0) {
    // console.log("hipp")
    tags.forEach(tag => {
      // console.log(tag)
      rtext = reactStringReplace(rtext, `@${tag.tagged_userid}`, (match, i) => (
        <Pressable key={match + i} onPress={() => navigation.navigate('profile', {uid: tag.tagged_userid})}><Text style={{fontSize: 12}} className='text-red-700 font-bold' >{tag.firstName} {tag.lastName}</Text></Pressable> 
      )
  )
      setreplacedtext(rtext)


    });
  }
}, [])

  
  return (
    <View
      className="flex-row bg-white p-3 mb-10 self-center rounded-lg"
      style={{ width: "100%", shadowColor: '#0000007b',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 2,  
      elevation: 10, }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0">
          <Pressable onPress={() => navigation.navigate("profile", {
            uid: post.user_id
          })}>
          <Image
            source={{ uri: post?.profile_picture }}
            resizeMode="cover"
            style={{
              width: 30,
              height: 30,
            }}
            className="rounded-full"
          />
          </Pressable>

          <View className="flex-row items-center justify-between flex-1 ml-3">
            <Text className="text-lg flex-1">
              {post?.fName + " " + post?.lName}{" "}
              <Text className=" text-xs">@{post.username}</Text>
              {/* <Text>{tags.length}</Text> */}
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
          {replacedtext}
        </Text>

        {post.images.length > 0 ? (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('postdetails', {
            pid: post.id,
            user: user,
            authorsFirstName: post.fName
          })}>
            <View>
          <PostMedia
            files={post.images}
            orientation={post.orientation}
            fileType={"images"}
          />
          </View>
          </TouchableWithoutFeedback>
        ) : (
          ""
        )}
        <TouchableOpacity onPress={() => navigation.navigate('commentview', {
            user: user,
            pid: post.id,
            authorsFirstName: post?.fName
        })} className="text-xs self-end text-gray-400 mt-5">
          <Text>{comments?.count} comments</Text>
        </TouchableOpacity>

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

        {comments?.count > 0 ? (
          <Comment user={user} comment={comments.comments[0]} postAuthorId={post.user_id} reply={comments.comments.filter((e) => e.reply_id !== 'null' && e.reply_id == comments.comments[0].id)} />
        ) : ''}

        <CommentEntry user={user} pid={post?.id} />
      </View>
    </View>
  );
};

export default Post;
