
import { View, Text, Image, TextInput } from 'react-native'
import React, {useContext, useState, useEffect, useRef} from 'react'
import { mutate } from 'swr'
import { CommentReply, server } from '../lib/swr-hooks'

const CommentEntry = ({user, pid, replyId=null}) => {
  const { replyComment, setreplyComment } = useContext(CommentReply);
  const [comment, setcomment] = useState("")
  const refInput = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (replyComment[0] == true) {
        setcomment(`@${replyComment[1].name} `)
        refInput.current.focus()
      } else {
        setreplyComment("")
      }
    }, 500);
  }, [replyComment])

  const handleSubmmitComment = (e) => {
        const formData = new FormData();
        formData.append('comment', comment)
        formData.append('user_id', user.userId)
        formData.append("post_id", replyComment[0] ? replyComment[1].pid : pid)
        formData.append('reply_id', replyComment[0] ? replyComment[1].replyId : replyId)

        if (comment !== '' || comment !== null || comment !== ' ') {
            fetch(`${server}/comment.php`, {
                method: "POST",
                body: formData
            }).then((res) => res.json()).then((data) => {
                // console.log(data)
                setcomment('')
                setreplyComment([false, {
                  pid: '',
                  replyId: '',
                  name: ''
                }])
                mutate(`${server}/getFeed.php?portion=all`)
                mutate(`${server}/getPost.php?postId=${pid}`)
                // console.log("Comment added")

            })
        } else {
            console.log("NO COMMENT")
        }

    }

  return (
    <View className='flex-row justify-between'>
      <Image className='rounded-full' source={{uri: user?.img}} resizeMode='cover' style={{width: 30, height: 30}} />
      <TextInput ref={refInput} onChangeText={(e) => setcomment(e)} className='flex-1 ml-5 bg-gray-200 rounded-md h-9 px-3' placeholder='Write a comment...' returnKeyType='send' onSubmitEditing={handleSubmmitComment} value={comment} />
    </View>
  )
}

export default CommentEntry