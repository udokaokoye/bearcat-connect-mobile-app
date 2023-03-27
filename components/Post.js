import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Pressable,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from '../lib/swr-hooks'
import { HeartIcon, MapPinIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon } from "react-native-heroicons/solid";
import {
  ChatBubbleOvalLeftIcon,
  ShareIcon,
} from "react-native-heroicons/outline";
import CommentEntry from "./CommentEntry";
import PostMedia from "./PostMedia";
import { locationList, getPost, server, VideoMuted } from "../lib/swr-hooks";
import moment from "moment";
import Comment from "./Comment";
import { useNavigation } from "@react-navigation/native";
import reactStringReplace from "react-string-replace";
import { mutate } from "swr";
import numeral from "numeral";
import { Share } from "react-native";
const Post = ({
  user,
  post,
  comments,
  tags,
  reactions,
  setmenuActive,
  menuActive,
}) => {
  const [caption, setcaption] = useState(post?.caption);
  const [tgcounter, settgcounter] = useState(0);
  // !This state handels the trigger to update the like button and Value 0=clicked or not clicked 1=alreadyliked or not liked
  const [updateReactions, setupdateReactions] = useState([false, false]);

  const { setvideosMuted } = useContext(VideoMuted);
  const navigation = useNavigation();
  let postLocation = {
    name:
      post?.location !== ""
        ? locationList?.filter((e) => e.id == post?.location)[0].name
        : "",
    campus:
      post?.location !== ""
        ? locationList?.filter((e) => e.id == post?.location)[0].campus
        : "",
  };
  // setcaption(post.caption)
  const [replacedtext, setreplacedtext] = useState(post?.caption);
  // let replacedText = '1111';
  var rtext = post?.caption;
  // const reacData = getPost(post.id).post;
  var freshReactions = getPost(post.id).post;

  var alreadyLiked = freshReactions?.reactions.data.some((reaction) => {
    return reaction.userId == user.userId;
  });
  useEffect(() => {
    if (tags.length > 0) {
      // console.log("hipp")
      tags.forEach((tag) => {
        // console.log(tag)
        rtext = reactStringReplace(
          rtext,
          `@${tag.tagged_userid}`,
          (match, i) => (
            <Pressable
              key={match + i}
              onPress={() =>
                navigation.navigate("profile", { uid: tag.tagged_userid })
              }
            >
              <Text style={{ fontSize: 12 }} className="text-red-700 font-bold">
                {tag.firstName} {tag.lastName}
              </Text>
            </Pressable>
          )
        );
        setreplacedtext(rtext);
      });
    }

    // console.log(post.orientation)
  }, []);

  useEffect(() => {
    setupdateReactions([false, false])
  }, [freshReactions])
  

  const postReaction = () => {
    const formData = new FormData();
    setupdateReactions([true, alreadyLiked]);

    // console.log(alreadyLiked)
    // return;

    formData.append("userId", user.userId);
    formData.append("postId", post.id);
    // alreadyLiked = !alreadyLiked

    fetch(`${server}/reactions.php${alreadyLiked ? "?unlike=true" : ""}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        mutate(`${server}/getPost.php?postId=${post.id}`);
        // setTimeout(() => {
        //   setupdateReactions([false, false])
        // }, 500);
      });
  };

  return (
    <View
      className="flex-row bg-white p-3 mb-10 self-center rounded-lg"
      style={{
        width: "100%",
        shadowColor: "#0000007b",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 10,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0">
          <Pressable
            onPress={() =>
              navigation.navigate("profile", {
                uid: post.user_id,
              })
            }
          >
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
            <Text
              className={`${
                Platform.OS == "ios" ? "text-md" : "text-md"
              } flex-1`}
            >
              {post?.fName + " " + post?.lName}{" "}
              <Text className=" text-xs">@{post.username}</Text>
              {/* <Text>{tags.length}</Text> */}
            </Text>
            <Pressable
              className="p-2"
              onPress={() => setmenuActive([true, post.user_id, post.id])}
            >
              <Text className="">...</Text>
            </Pressable>
          </View>
        </View>

        {post?.location !== "" ? (
          <View className="flex-row items-center ml-9 mb-1">
            <MapPinIcon size={20} color={"red"} />
            <Text className="text-xs text-gray-500 ml-1">
              {postLocation.name}, {postLocation.campus}
            </Text>
          </View>
        ) : (
          ""
        )}

        <Text className="text-xs text-gray-500 mb-2 ml-10">
          {moment(post?.createdDate).fromNow()}
        </Text>
        <Text className=" text-sm" style={{ width: "100%" }}>
          {replacedtext}
        </Text>

        {post?.type !== null ? (
          <TouchableWithoutFeedback
            onPress={() => {
              setvideosMuted(true);
              post?.type == "image"
                ? navigation.navigate("postdetails", {
                    pid: post.id,
                    user: user,
                    authorsFirstName: post.fName,
                  })
                : navigation.navigate("fullVideo", {
                    post: post,
                    user: user,
                    authorsFirstName: post.fName,
                  });
            }}
          >
            <View>
              <PostMedia
                files={post.images}
                orientation={post?.orientation.toString().split(",")}
                fileType={post?.type}
                pid={post?.id}
                navigation={navigation}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          ""
        )}
        {/* <Text>{post?.type}</Text> */}
        <View className="flex-row items-center justify-between mt-5">
          <TouchableOpacity>
            <Text>
              {numeral(
                updateReactions[0] && updateReactions[1]
                ? freshReactions?.reactions.count - 1
                : updateReactions[0] && !updateReactions[1]
                ? freshReactions?.reactions.count + 1
                : freshReactions?.reactions.count
              ).format("0a")}{" "}
              likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("commentview", {
                user: user,
                pid: post.id,
                authorsFirstName: post?.fName,
              })
            }
            className="text-xs text-gray-400"
          >
            <Text>{numeral(comments?.count).format("0a")} comments</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-5 mb-5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-md bg-gray-300"
            style={{ width: "30%", height: 30 }}
            onPress={() => postReaction()}
          >
            {updateReactions[0] && updateReactions[1] ? (<HeartIcon color={'red'} />) : updateReactions[0] && !updateReactions[1] ? (<SolidHeartIcon color={'red'} />) : alreadyLiked ? (
              <SolidHeartIcon color={"red"} />
            ) : (
              <HeartIcon color={"red"} />
            )} 
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
            onPress={async () => {
              await Share.share({
                message:
                  "Hello World -> this should be a deeplink to the current post",
              });
            }}
          >
            <ShareIcon color={"red"} />
            <Text className="ml-1 text-xs">Share</Text>
          </TouchableOpacity>
        </View>

        {comments?.count > 0 ? (
          <Comment
            user={user}
            comment={comments.comments[0]}
            postAuthorId={post.user_id}
            reply={comments.comments.filter(
              (e) =>
                e.reply_id !== "null" && e.reply_id == comments.comments[0].id
            )}
          />
        ) : (
          ""
        )}

        <CommentEntry user={user} pid={post?.id} />
      </View>
    </View>
  );
};

export default Post;
