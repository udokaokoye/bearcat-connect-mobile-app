
import { View, Text, Image, TextInput } from 'react-native'
import React, {useState} from 'react'
import { mutate } from 'swr'

const CommentEntry = ({user, pid, replyId=null}) => {
  const [comment, setcomment] = useState('')

  const handleSubmmitComment = (e) => {

    // alert("Comment");
    // return

        const formData = new FormData();
        formData.append('comment', comment)
        formData.append('user_id', user.userId)
        formData.append("post_id", pid)
        formData.append('reply_id', replyId)

        if (comment !== '' || comment !== null || comment !== ' ') {
            fetch('http://192.168.1.51/bearcats_connect/comment.php', {
                method: "POST",
                body: formData
            }).then((res) => res.json()).then((data) => {
                console.log(data)
                setcomment('')
                mutate('http://192.168.1.51/bearcats_connect/getFeed.php?portion=all')
                mutate(`http://192.168.1.51/bearcats_connect/getPost.php?postId=${pid}`)
                // console.log("Comment added")

            })
        } else {
            console.log("NO COMMENT")
        }

    }

  return (
    <View className='flex-row justify-between'>
      <Image className='rounded-full' source={{uri: user?.img}} resizeMode='cover' style={{width: 30, height: 30}} />
      <TextInput onChangeText={(e) => setcomment(e)} className='flex-1 ml-5 bg-gray-200 rounded-md h-9 px-3' placeholder='Write a comment...' returnKeyType='send' onSubmitEditing={handleSubmmitComment} value={comment} />
    </View>
  )
}

export default CommentEntry