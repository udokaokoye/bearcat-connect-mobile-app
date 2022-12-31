import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";

const Comment = ({ comment, reply, user, postAuthorId }) => {
  return (
    <View className="flex-row mb-3">
      {/* <Text>COmment</Text> */}
      <Image
        className="rounded-full"
        source={{ uri: comment?.profile_picture }}
        style={{ width: 40, height: 40 }}
      />

      <View className="ml-3">
        <View className='bg-gray-200 rounded-xl px-3 py-2 '>
        <View className="flex-row justify-between items-center space-x-3">
          <Text className=' font-semibold'>
            {comment?.firstName} {comment?.lastName}
          </Text>
          <Text className="mb-1">...</Text>
        </View>

        <Text className='mt-2'>{comment?.comment}</Text>
        </View>

        <View className='flex-row space-x-5 mt-2'>
            <Text>{moment(comment?.date).fromNow()}</Text>
            <Text>Like</Text>
            <Text>Reply</Text>
        </View>
      </View>
    </View>
  );
};

export default Comment;
