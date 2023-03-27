import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  AuthContext,
  followUser,
  getPost,
  getPosts,
  GetUser,
} from "../lib/swr-hooks";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowUpOnSquareStackIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  PencilIcon,
  ShareIcon,
  StarIcon
} from "react-native-heroicons/outline";
import Post from "../components/Post";
import {
  AdjustmentsHorizontalIcon,
  WindowIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "react-native-heroicons/outline";
import AppLoading from "../components/AppLoading";
import NoPostFound from "../components/NoPostFound";
import { db } from "../firebase";
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import { getStatusBarHeight } from 'react-native-status-bar-height';
const ProfileScreen = ({ route }) => {
  const { uid } = route.params;
  const { posts, isValidating } = getPosts("userId", uid);
  const [optionBarSelector, setoptionBarSelector] = useState(1);
  const userProfile = GetUser(route.params.uid).userData;
  const navigation = useNavigation();
  const { setsignedinUser, signedinUser } = useContext(AuthContext);
  const statusBarHeight = Constants.statusBarHeight || getStatusBarHeight() * 3;
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerTitle: `${userProfile?.firstName ? userProfile?.firstName : ""}`,
      headerShown: false,
    });
    // console.log(statusBarHeight)
  }, [userProfile]);

  const followUserHandler = () => {
    followUser(
      signedinUser?.userId,
      userProfile?.followers.followers,
      userProfile?.id
    );
  };

  const createChat = async (user) => {
    await db
      .collection("chats")
      .add({
        chatMembers: [signedinUser.userId, user.id],
        chatMemberInfo: [
          {
            name: signedinUser.fName + " " + signedinUser.lName,
            username: signedinUser.username,
            profile_picture: signedinUser.img,
            major: signedinUser.major,
            id: signedinUser.userId,
          },
          {
            name: user.firstName + " " + user.lastName,
            username: user.username,
            profile_picture: user.profile_picture,
            major: user.major,
            id: user.id,
          },
        ],
        chatName:
          signedinUser.fName +
          " " +
          signedinUser.lName +
          "->" +
          user.firstName +
          " " +
          user.lastName,
      })
      .then((docRef) => {
        navigation.navigate("chat", {
          user: {
            name: user.firstName + " " + user.lastName,
            id: user.id,
            major: user.major,
            profile_picture: user.profile_picture,
            username: user.username,
          },
          chatId: docRef.id,
        });
      })
      .catch((error) => console.log(error));
  };

  const navigateToChat = async () => {
    const possibleSituation = [
      [userProfile.id, signedinUser.userId],
      [signedinUser.userId, userProfile.id],
    ];
    const snapshot = await db
      .collection("chats")
      .where("chatMembers", "in", possibleSituation)
      .get();

    if (snapshot.docs.length > 0) {
      navigation.navigate("chat", {
        user: {
          name: userProfile.firstName + " " + userProfile.lastName,
          ...userProfile,
        },
        chatId: snapshot.docs[0].id,
      });
    } else {
      createChat(userProfile);
    }
  };

  const shadow = {
    shadowColor: "black",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
  }
  const shadow2 = {
    shadowColor: "black",
                shadowOffset: {
                  width: 1,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5,
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={"blue"}
        barStyle={"dark-content"}
        hidden
        // translucent={false}
      />

      <View
        style={{ height: statusBarHeight, backgroundColor: "white" }}
      ></View>

      <Pressable
        onPress={() => alert("logout popup")}
        className="bg-white flex-row items-center pl-5 border-gray-400 rounded-xl flex-wrap"
      >
        <ArrowLeftOnRectangleIcon color={"black"} />
        <Text className="ml-2">leviokoye</Text>
      </Pressable>
      <View className="flex-row pt-10 px-5 bg-white">
        <Image
          source={{ uri: userProfile?.profile_picture }}
          style={{ width: 90, height: 90 }}
          className="rounded-full"
        />

        <View className="flex-1 mt-2">
          <View className="flex-row justify-evenly">
            <View className=" justify-center items-center">
              <Text className="font-bold">0</Text>
              <Text className="mt-3">Posts</Text>
            </View>

            <View className=" justify-center items-center">
              <Text className="font-bold">{userProfile?.followers?.count}</Text>
              <Text className="mt-3">
                Follower{userProfile?.followers?.count > 1 ? "s" : ""}
              </Text>
            </View>

            <View className=" justify-center items-center">
              <Text className="font-bold">{userProfile?.following?.count}</Text>
              <Text className="mt-3">Following</Text>
            </View>
          </View>

          <View
            className="flex-row justify-evenly mt-3 pb-2"
            style={{ width: "100%" }}
          >
            <TouchableHighlight
              onPress={() => followUserHandler()}
              className="bg-red-600 justify-center items-center rounded-xl px-10 py-3"
              style={{
                ...shadow
              }}
            >
              <Text className="text-white font-bold">
                {userProfile?.followers?.followers
                  .map((fl) => fl.id)
                  .includes(signedinUser?.userId)
                  ? "Unfollow"
                  : "Follow +"}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                ...shadow
              }}
              className="bg-red-600 justify-center items-center rounded-xl px-10 py-3"
            >
              <Text className="text-white font-bold">Message</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>

      <View
        style={{ borderBottomWidth: 1 }}
        className="pt-5 border-gray-300 p-5 bg-white"
      >
        <Text className="text-2xl font-bold">
          {userProfile?.firstName} {userProfile?.lastName}
        </Text>
        <View className="flex-row mt-2">
          <Text className=" text-gray-500">{userProfile?.campus} | </Text>
          <Text className=" text-gray-500">{userProfile?.major}</Text>
        </View>
        <Text className="mt-2 text-gray-600">{userProfile?.bio}</Text>

        <View className="flex-row justify-between mt-5">
          {/* <TouchableHighlight onPress={() => followUserHandler()} className=' flex-auto bg-red-600 px-32 py-4 rounded-3xl'><Text className='text-white text-lg font-bold'>{userProfile?.followers?.followers
                        .map((fl) => fl.id)
                        .includes(signedinUser?.userId)
                        ? "Unfollow"
                        : "Follow +"}</Text></TouchableHighlight> */}
          <View className="flex-row justify-between" style={{ width: "80%" }}>
            <TouchableHighlight
              style={{ width: 145, height: 45, ...shadow2 }}
              className="bg-red-100 justify-center items-center rounded-xl"
            >
              <View className="flex-row items-center">
                <Text className=" font-bold text-red-500 mr-2">{userProfile?.id !== signedinUser?.userId ? 'Favorite' : 'Edit Profile'}</Text>
                {userProfile?.id == signedinUser?.id ? (<StarIcon />) : (<PencilIcon color={"red"} />)}
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ width: 145, height: 45, ...shadow2 }}
              className="bg-red-100 justify-center items-center rounded-xl"
            >
              <View className="flex-row items-center">
                <Text className=" font-bold text-red-500 mr-2">Share profile</Text>
                <ArrowUpOnSquareStackIcon color={"red"} />
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={{ borderWidth: 1, ...shadow }}
            className="w-16 h-15 rounded-full justify-center items-center border-gray-300"
            
          >
            <Text className="mb-2 text-red-600 font-bold">...</Text>
          </View>
        </View>
      </View>
      <View className="flex-row flex-1 justify-between p-5 bg-white">
        <View className="flex-row">
          <Pressable
            onPress={() => setoptionBarSelector(1)}
            className="flex-row items-center"
          >
            <WindowIcon color={optionBarSelector == 1 ? "red" : "grey"} />
            <Text
              className={`ml-2 ${
                optionBarSelector == 1 ? "font-bold" : " text-gray-400"
              }`}
            >
              Activity
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setoptionBarSelector(2)}
            className="flex-row items-center ml-10"
          >
            <UserIcon color={optionBarSelector == 2 ? "red" : "grey"} />
            <Text
              className={`ml-2 ${
                optionBarSelector == 2 ? "font-bold" : " text-gray-400"
              }`}
            >
              About
            </Text>
          </Pressable>
        </View>

        <View className=" ">
          <AdjustmentsHorizontalIcon color={"red"} />
        </View>
      </View>

      {optionBarSelector == 1 ? (
        <View
          className=" bg-gray-100 self-center mt-5"
          style={{ width: "100%" }}
        >
          {isValidating ? (
            <Text>Loading</Text>
          ) : posts?.length > 0 ? (
            posts?.map((post, index) => (
              <Post
                key={post.post.id}
                user={signedinUser}
                post={post.post}
                tags={post.tags}
                comments={post.comments}
                reactions={post.reactions}
              />
            ))
          ) : (
            <Text> No Post Found </Text>
          )}
        </View>
      ) : optionBarSelector == 2 ? (
        <View
          className=" bg-white self-center p-3 rounded-lg"
          style={{ width: "95%" }}
        >
          <Text
            className=" font-bold text-2xl"
            style={{ textTransform: "capitalize" }}
          >
            {userProfile.firstName + " " + userProfile.lastName}
          </Text>
          <Text className="mt-3 text-xl font-bold">Bio</Text>
          <Text className="mt-1">{userProfile.bio}</Text>
          <View className="flex-row items-center mt-3">
            <Text className="text-xl font-bold mr-1">Campus</Text>
            {/* <BuildingLibraryIcon color={'red'} /> */}
          </View>
          <Text className="mt-1">
            {userProfile?.campus !== ""
              ? userProfile.campus == "UCBA"
                ? "Blue Ash"
                : userProfile.campus == "CLE"
                ? "Cleremont"
                : "Uptown"
              : "NONE"}
          </Text>
          <View className="flex-row items-center mt-3">
            <Text className="text-xl font-bold mr-1">Major</Text>
            {/* <AcademicCapIcon color={'red'} /> */}
          </View>
          <Text className="mt-1">{userProfile?.major}</Text>

          <Text className="mt-3 text-xl font-bold">Contact Info</Text>
          <Text>{userProfile.email}</Text>
        </View>
      ) : (
        ""
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
