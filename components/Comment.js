import { View, Text, Image, Pressable, KeyboardAvoidingView, TextInput } from "react-native";
import React, {useState, useEffect, useContext, useRef} from "react";
import moment from "moment";
import {useHeaderHeight} from '@react-navigation/elements'
import CommentEntry from "./CommentEntry";
import { CommentReply, getComments } from "../lib/swr-hooks";

const Comment = ({ comment, reply, user, postAuthorId }) => {
  const [showCommentInput, setshowCommentInput] = useState(false)
  const [viewReply, setviewReply] = useState(false)
  const {allComment, isValidating} = getComments(comment?.post_id)
  const { replyComment, setreplyComment } = useContext(CommentReply);
  const headerHeight = useHeaderHeight()
  const invisibleInputRef = useRef()
  // useEffect(() => {
  //   if (replyComment[1] !== undefined) {
  //     if (replyComment[1].replyId == comment.id) {
  //       console.log("id matched")
  //       invisibleInputRef.current.focus()
  //     } else {
  //       invisibleInputRef.current.blur()
  //     }
  //   }
  // }, [replyComment])
  return (
    <View className="flex-row mb-0">
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

        <View className='flex-row space-x-5 mt-2 mb-2'>
            <Text>{moment(comment?.date).fromNow()}</Text>
            <Text>Like</Text>
            <Pressable onPress={async () => {
            await invisibleInputRef.current.focus()

              setreplyComment([true, {
                pid: comment?.post_id,
                replyId: comment?.id,
                name: comment?.firstName
              }])
            }}><Text>Reply</Text></Pressable>
        </View>
        <Pressable onPress={() => setviewReply(!viewReply)}><Text className='text-red-400 font-bold mb-2'>{reply?.length <=0 || reply == undefined? "" : viewReply ? "Hide Reply" : "View Reply"}</Text></Pressable>

        <TextInput ref={invisibleInputRef} style={{opacity: 1, height: 1}} />

        {reply?.length <=0 || !viewReply ? ("") : (
          <View>
            {
              reply?.map((rp) => (
                <Comment key={rp.id + rp.firstName} comment={rp} reply={allComment?.filter(
                  (e) => e.reply_id !== "null" && e.reply_id == rp.id
                )} user={user} postAuthorId={postAuthorId} />
              ))
            }
          </View>
        ) }
      </View>
    </View>
  );
};

export default Comment;
