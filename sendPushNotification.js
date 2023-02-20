import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import useSWR, { mutate } from "swr";
import { AuthContext, fetcher, server } from "./lib/swr-hooks";
async function sendPushNotification(userId, notificationType, userInfo, messageContent, chatId, sendinguserInfo) {

   const res = await fetch(
    `${server}/getuserNotificationToken.php?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
     },
    }
  )
  var notificationData = await res.json()

  // console.log(notificationData);
if (notificationData?.notificationToken !== null) {
  var message;
  if (notificationType == 'message') {
    // console.log(sendinguserInfo.fName + sendinguserInfo.lName)
    // return
    message = {
      to: notificationData?.notificationToken,
      sound: 'default',
      title: sendinguserInfo.fName + " " + sendinguserInfo.lName,
      body: messageContent,
      data: {type: 'new_message', id: chatId, chatInfo: userInfo},
    };
  }

  message == undefined && console.log("NO NOTIFICATION TYPE SENT!")

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  }).then((dat) => dat.json()).then((res) => {
    // console.log(res)
  })
}
}
export default sendPushNotification;
