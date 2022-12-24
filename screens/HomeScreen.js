import { Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../lib/swr-hooks'
const HomeScreen = () => {
  const {setisSignedIn} = useContext(AuthContext)
  const navigation = useNavigation()
  const handleLogout = () => {
    AsyncStorage.removeItem('user-token').then((e) => {
      alert("logged Out")
      setisSignedIn(null)
      navigation.navigate('auth')
    })
  }

  const testVal = () => {
    AsyncStorage.getItem('user-token').then((tk) => {
      console.log(tk)
    })
  }
  return (
    <View>
      <Text className=' text-red-600 '>HomeScreens</Text>
      <TouchableOpacity onPress={() => handleLogout()} className=' mt-11 '><Text>LOGOUT</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => testVal()} className=' mt-11 '><Text>TEST</Text></TouchableOpacity>
    </View>
  )
}

export default HomeScreen

