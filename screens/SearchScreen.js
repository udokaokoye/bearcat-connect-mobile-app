import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import React, {useEffect, useState} from "react";
import ProfileCard from "../components/ProfileCard";
import { GetUser, server } from "../lib/swr-hooks";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = ({route}) => {
    const [userProfile, setuserProfile] = useState({})
    const [searchPhrase, setsearchPhrase] = useState('')
    const [searchResult, setsearchResult] = useState([])
    const navigation = useNavigation()

  const { user } = route.params;
  const {isValidating, userData} = GetUser(route.params.user.userId);

  useEffect(() => {
    setuserProfile(userData)
  }, [isValidating])

  useEffect(() => {
    fetch(`${server}/tagSearch.php?phrase=${searchPhrase}`).then((res) => res.json()).then((data) => {
    setsearchResult(data)
    // console.log(data)
    })
  }, [searchPhrase])
  
  
  return (
    <ScrollView className="p-5 flex-1">
      <TextInput onChangeText={(txt) => setsearchPhrase(txt)} className='bg-gray-300 p-5 rounded-2xl' placeholderTextColor={'#62696b'} placeholder="start searching..." />


      <View className='mt-16'>
        <Text className='text-2xl font-bold mb-5'>{searchResult.length > 0 ? "Search Result" : "Recent Search"}</Text>
        { searchPhrase.length > 0 ? searchResult.map((us) => (
            
            <Pressable key={us.id} onPress={() => navigation.navigate("profile", {
              uid: us.id
            })}><ProfileCard user={us} /></Pressable>
        )) : userProfile?.following?.following.map((uss) => (
          <Pressable key={uss.id} onPress={() => navigation.navigate("profile", {
            uid: uss.id
          })} ><ProfileCard  user={uss} /></Pressable>
        ))}
      </View>

      <View className="mt-10">
        <Text className="text-2xl font-bold">Trending Now</Text>

        <Pressable className="mt-4 flex-row bg-gray-300 h-14 rounded-xl p-5">
          <Text className="font-bold">#Bearcats</Text>
          <Text className='italic text-xs ml-2'>22k posts</Text>
        </Pressable>
        <Pressable className="mt-4 flex-row bg-gray-300 h-14 rounded-xl p-5">
          <Text className="font-bold">#Bearcats</Text>
          <Text className='italic text-xs ml-2'>22k posts</Text>
        </Pressable>
        <Pressable className="mt-4 flex-row bg-gray-300 h-14 rounded-xl p-5">
          <Text className="font-bold">#Bearcats</Text>
          <Text className='italic text-xs ml-2'>22k posts</Text>
        </Pressable>
      </View>
      <View className='mt-16'>
        <Text className='text-2xl font-bold'>Suggessted Posts</Text>
      </View>
    </ScrollView>
  );
};

export default SearchScreen;
