import { View, Text, ScrollView , Image, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform} from 'react-native'
import React, {useLayoutEffect, useState, useEffect, useContext} from 'react'
import { useNavigation } from '@react-navigation/native';
import { CommentReply, getPost } from '../lib/swr-hooks';
import {useHeaderHeight} from '@react-navigation/elements'
import moment from 'moment';
import PostMedia from '../components/PostMedia';
import { HeartIcon, ChatBubbleBottomCenterIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import Comment from '../components/Comment';
import CommentEntry from '../components/CommentEntry';
// import  from 'react-native-heroicons/solid';
const CommentsViewScreen = ({route}) => {
  const navigation = useNavigation()
  const { pid, user, authorsFirstName } = route.params;
  const { post, postValidating } = getPost(pid);
  const { replyComment } = useContext(CommentReply);

    const postData = post?.post;
    const headerHeight = useHeaderHeight()
    const comments = post?.comments.comments.filter((e) => e.reply_id == "null")


    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: `${authorsFirstName + "'s Post"}`,
        //   headerTintColor: 'red',
        //   titleStyle:{color:'black'},
        });
    
      }, [navigation]);


      
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}
    keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : headerHeight}
    >
    <ScrollView>
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





      {postData?.images.length > 0 ? (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('postdetails', {
            pid: postData.id,
            user: user,
            authorsFirstName: postData.fName
          })}>
            <View>
          <PostMedia
            files={postData.images}
            orientation={postData.orientation}
            fileType={postData?.type}
            fromCommentViewScreen={true}
          />
          </View>
          </TouchableWithoutFeedback>
        ) : (
          <Text>Hello</Text>
        )}




      <View className="mt-5 flex-row justify-between">
        <Text className="">
          <HeartIcon color={"red"} size="15" /> 200
        </Text>
        <Text className="text-gray-500">{post?.comments?.count} comments</Text>
      </View>

      <View className='flex-row justify-between mt-4 border-t border-b p-3' style={{borderColor: '#464646ac'}}>
        <View className='flex-row items-center space-x-1'>
          <HeartIcon color={'red'} /> 
          <Text>Like</Text>
        </View>
        <TouchableOpacity className='flex-row items-center space-x-1'>
          <ChatBubbleBottomCenterIcon color={'red'} /> 
          <Text>Comment</Text>
        </TouchableOpacity>
      </View>

      <View className='flex-row items-center justify-between mt-5'>
        <Text className=' text-xl font-bold'>Comments</Text>
        <TouchableOpacity className='text-xl flex-row items-center space-x-1'>
        <ChevronDownIcon color={'red'} size='18' /> 
        <Text>sort by</Text>
        </TouchableOpacity>
    </View>
    </View>



    <View className='p-3'>

        { comments?.length > 0 ? comments.map((commentData, index) => (
            <Comment key={index} allComment={post?.comments.comments} user={user} comment={commentData} postAuthorId={postData.user_id}
            reply={
              post?.comments.comments.filter((e) => e.reply_id !== 'null' && e.reply_id == commentData.id)
            }
             />
        )) : (<View className='mt-5 mb-5'>
            <Text className='text-center text-xl font-bold'>No Comment</Text>
            <Text className='text-center'>Be the first to comment!</Text>
        </View>)}
    </View>

</ScrollView>

<View className='h-20 bg-white pt-5 px-3'>
    <CommentEntry user={user} pid={pid} replying={replyComment !== null ? replyComment[0] : false} replydeets={replyComment} />
</View>

</KeyboardAvoidingView>
  )
}

export default CommentsViewScreen