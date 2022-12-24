import useSWRImmutable, { mutate } from 'swr'
import useSWRImmutableImmutable from "swr/immutable"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import {createContext} from 'react'
// import jwtDecode from 'jwt-decode';
// import Cookies from 'js-cookie'
// require('')

// async function fetcher(url) {
//     return await fetch(url, {
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${Cookies.get('user-token')}`
//        }, 
//     }).then((res) => res.json())
//   }

//   export function GetUser(userId) {
//     // formData.append('userId', userId)
//     const {data, error, isValidating} = useSWRImmutable(`http://192.168.1.51/bearcats_connect/getUser.php?userId=${userId}`, fetcher )
//     return {
//       user: data,
//       isValidating,
//       error
//     };
//   }

//   export function getPosts(refname, refId) {
//     // ! refname means the route name or (either userId or postId) while refId means the id we are targeting for either postId or userId
//     const {data, error, isValidating} = useSWRImmutable(`http://192.168.1.51/bearcats_connect/getPost.php?${refname}=${refId}`, fetcher )
//     return {
//       posts: data,
//       isValidating,
//       error
//     };
//   }


//   export function getComments(id) {
//     const {data, error, isValidating} = useSWRImmutable(`http://localhost/bearcats_connect/getComments.php?pid=${id}`, fetcher )
    
//     return {
//       allComment: data,
//       error,
//       isValidating
//     }

//   }


  export async function LoggedIn() {
    // var i = ;

    return await AsyncStorage.getItem('user-token');
  }

//   export function getLoggedInUser() {
    
//     if (Cookies.get('user-token')) {
//         return jwtDecode(Cookies.get('user-token')).data
//     } else {
//         return "Logged Out"
//     }
//   }

//   export function getFeed (portion) {
//     // ! Portion is either 'following' or 'all'
//     const {data, error, isValidating} = useSWRImmutable(`http://192.168.1.51/bearcats_connect/getFeed.php?portion=${portion}`, fetcher )

//     return {
//       feed: data,
//       feedValidating: isValidating,
//       error
//     };
//   }

//   export function getPost (pid) {
//     // ! pid is post ID'
//     const {data, error, isValidating} = useSWRImmutable(`http://192.168.1.51/bearcats_connect/getPost.php?postId=${pid}`, fetcher )
//     return {
//       post: data,
//       postValidating: isValidating,
//       error
//     };
//   }

//   export function followUser (userId, followersList, followed_user_id) {
//     // ! Check if user is following already
//     followersList = followersList.map((fl) => fl.id).map(Number)
//     const alreadyFollowing = followersList.includes(parseInt(userId))
//     fetch(`http://192.168.1.51/bearcats_connect/follow.php?${alreadyFollowing ? 'unfollow=1' : 'follow=1'}&userId=${userId}&followedUserId=${followed_user_id}`, {
//       method: "POST",
//         headers: {
//           'Authorization': `Bearer ${Cookies.get('user-token')}`
//        },
//     }).then((res) => res.json()).then((data) => {
//       mutate(`http://192.168.1.51/bearcats_connect/getUser.php?userId=${followed_user_id}`)
//     })
   

//   }



//   export function logUserOut(userId) {
//     if (LoggedIn) {
//         Cookies.remove('user-token');
//         router.push('/auth')
//     }
//   }


//   export function verifyAuth(location, router) {
//     if (Cookies.get('user-token')) {
//      fetch(`http://192.168.1.51/bearcats_connect/useJwt.php`, {
//       headers: {
//         'Authorization': `Bearer ${Cookies.get('user-token')}`
//      }, 
//      }).then((res) => {
//       // console.log(res.status)
//       if (res.status !== 200) {
//         router.push("/auth")
//         Cookies.remove('user-token');
//         return;
//       }
//      })

//         router.push(location)
//     } else {
//         router.push("/auth")
//     }
//   }


export const AuthContext = createContext(null);

//   export const locationList = [
//     {
//       id: 1,
//       name: "Muntz Hall",
//       campus: "UCBA",
//     },

//     {
//         id: 2,
//       name: "Progress Hall",
//       campus: "UCBA",
//     },

//     {
//         id: 3,
//       name: "Walters Hall",
//       campus: "UCBA",
//     },

//     {
//         id: 4,
//       name: "Gators Hall",
//       campus: "Clifton",
//     },

//     {
//         id: 5,
//       name: "Flowry Hall",
//       campus: "Cleremount",
//     },

//     {
//         id: 6,
//       name: "Flowry Hall",
//       campus: "Cleremount",
//     },

//     {
//         id: 7,
//       name: "Flowry Hall",
//       campus: "Cleremount",
//     },

//     {
//         id: 8,
//       name: "Flowry Hall",
//       campus: "Cleremount",
//     },
//   ];