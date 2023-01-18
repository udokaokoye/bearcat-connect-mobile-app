import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import React, {useEffect, useState} from "react";
import ProfileCard from "../components/ProfileCard";
import { GetUser } from "../lib/swr-hooks";

const SearchScreen = ({route}) => {
    const [userProfile, setuserProfile] = useState({})
    const [searchPhrase, setsearchPhrase] = useState('')

  const { user } = route.params;
  const {isValidating, userData} = GetUser(route.params.user.userId);

  useEffect(() => {
    setuserProfile(userData)
  }, [isValidating])
  
  return (
    <ScrollView className="p-5 flex-1">
      <TextInput onChangeText={(txt) => setsearchPhrase(txt)} className='bg-gray-300 p-5 rounded-2xl' placeholderTextColor={'#62696b'} placeholder="start searching..." />


      <View className='mt-16'>
        <Text className='text-2xl font-bold mb-5'>Recent Search</Text>
        {userProfile?.followers?.followers?.map((us) => (
            
            <ProfileCard key={us.id} user={us} />
        ))}
      </View>

      <View className="mt-16">
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
