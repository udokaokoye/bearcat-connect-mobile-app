import useSWR, { mutate } from 'swr'
import useSWRImmutable from "swr/immutable"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import {createContext} from 'react'
export const server = 'https://bc.udokaokoye.com';

export async function fetcher(url) {
    return await fetch(url, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
       }, 
    }).then((res) => res.json())
  }


  export function GetUser(userId) {
    // formData.append('userId', userId)
    const {data, error, isValidating} = useSWR(`${server}/getUser.php?userId=${userId}`, fetcher )
    return {
      userData: data,
      isValidating,
      error
    };
  }

  export function getPosts(refname, refId) {
    // ! refname means the route name or (either userId or postId) while refId means the id we are targeting for either postId or userId
    const {data, error, isValidating} = useSWR(`${server}/getPost.php?${refname}=${refId}`, fetcher )
    return {
      posts: data,
      isValidating,
      error
    };
  }


  export function getComments(id) {
    const {data, error, isValidating} = useSWR(`${server}/getComments.php?pid=${id}`, fetcher )
    
    return {
      allComment: data,
      error,
      isValidating
    }

  }


  export async function LoggedIn() {
    // var i = ;

    return await AsyncStorage.getItem('user-token');
  }

  export function getLoggedInUser() {
    
    async function gu() {
      const userdata = await AsyncStorage.getItem('user-token');
      // console.log("swr - " + userdata)
      return userdata
    }

    return gu()
  }

  export function getFeed (portion) {
    // ! Portion is either 'following' or 'all'
    const {data, error, isValidating} = useSWR(`${server}/getFeed.php?portion=${portion}`, fetcher )
    // console.log(data)
    return {
      feed: data,
      feedValidating: isValidating,
      error
    };
  }

  export function getPost (pid) {
    // ! pid is post ID'
    const {data, error, isValidating} = useSWR(`${server}/getPost.php?postId=${pid}`, fetcher )
    return {
      post: data,
      postValidating: isValidating,
      error
    };
  }

  export async function followUser (userId, followersList, followed_user_id) {
    // ! Check if user is following already
    followersList = followersList.map((fl) => fl.id).map(Number)
    const alreadyFollowing = followersList.includes(parseInt(userId))
    fetch(`${server}/follow.php?${alreadyFollowing ? 'unfollow=1' : 'follow=1'}&userId=${userId}&followedUserId=${followed_user_id}`, {
      method: "POST",
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('user-token')}`
       },
    }).then((res) => res.json()).then((data) => {
      mutate(`${server}/getUser.php?userId=${followed_user_id}`)
    })
   

  }



  export async function logUserOut(uid) {
    
        await AsyncStorage.removeItem('user-token')
        
        const  formData = new FormData();
        formData.append('uid', uid)
        formData.append('notificationToken', null)
        formData.append('logout', 'true')
        fetch(`${server}/updateNotificationToken.php`, {
          method: 'POST',
          body: formData
        })
    
  }




  export function verifyAuth(location, router) {
    if (Cookies.get('user-token')) {
     fetch(`${server}/useJwt.php`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('user-token')}`
     }, 
     }).then((res) => {
      // console.log(res.status)
      if (res.status !== 200) {
        router.push("/auth")
        Cookies.remove('user-token');
        return;
      }
     })

        router.push(location)
    } else {
        router.push("/auth")
    }
  }


export const AuthContext = createContext(null);
export const CommentReply = createContext(null)
export const ViewableItem = createContext(null)
export const VideoMuted = createContext(null)
export const ChatContext = createContext(null)

  export const locationList = [
    {
      id: 1,
      name: "Muntz Hall",
      campus: "UCBA",
    },

    {
        id: 2,
      name: "Progress Hall",
      campus: "UCBA",
    },

    {
        id: 3,
      name: "Walters Hall",
      campus: "UCBA",
    },

    {
        id: 4,
      name: "Gators Hall",
      campus: "Clifton",
    },

    {
        id: 5,
      name: "Flowry Hall",
      campus: "Cleremount",
    },

    {
        id: 6,
      name: "Flowry Hall",
      campus: "Cleremount",
    },

    {
        id: 7,
      name: "Flowry Hall",
      campus: "Cleremount",
    },

    {
        id: 8,
      name: "Flowry Hall",
      campus: "Cleremount",
    },
  ];