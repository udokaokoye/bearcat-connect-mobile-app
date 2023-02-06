import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
const PostImageFullView = ({ route }) => {
  const navigation = useNavigation();
  const [activeIndex, setactiveIndex] = useState(0);
  useLayoutEffect(() => {
    // console.log(userData.following.following[1])
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const postData = route.params.data;



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        {/* <Animated.View> */}
      <View className="flex-row justify-between px-5">
        <Pressable
          className="bg-white rounded-full justify-center items-center"
          style={{ width: 20, height: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Text>x</Text>
        </Pressable>
        <Text className="text-white">{activeIndex} of {postData?.images.length}</Text>
        <Pressable>
          <Text className="text-white">...</Text>
        </Pressable>
      </View>

      <FlatList
        data={postData.images}
        renderItem={({ item, index }) => (
          <View style={{ width: Dimensions.get("screen").width }}>
            <Image
              resizeMode="contain"
              source={{ uri: item }}
              style={{
                width: "100%",
                height: '100%',
                // opacity: activeIndex == index ? 1 : 0,
              }}
              onLoadEnd={() => setactiveIndex(index)}
            />
          </View>
        )}
        keyExtractor={(item) => item}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={{height: '100%'}}
      />


    </SafeAreaView>
  );
};

export default PostImageFullView;
