import { View, Text, Image, ImageBackground } from 'react-native'
import React from 'react'

const PostMedia = ({fileType, files, orientation}) => {
    // console.log(Image.getSize(files[0]))
  if (files.length == 1) {
    return (
      <View className='mt-5'>
        <Image resizeMethod='resize' resizeMode={orientation[0] == 'p' ? 'cover' : 'cover'} source={{uri: files[0]}} style={{width: '100%', height: orientation[0] == 'p' ? 500 : 300}} />
      </View>
    )
  } else if (files.length == 2) {
    return (
        <View className={`${orientation[0] == 'p' && orientation[1] == 'p' ? 'flex-row justify-between mt-5' : 'flex-col justify-between items-center mt-5 '} ${orientation[0] == 'p' || orientation[1] == 'p' ? 'flex-row justify-between' : ''} `}>
          <Image resizeMethod='resize' resizeMode={orientation[0] == 'p' ? 'cover' : 'cover'} source={{uri: files[0]}} style={{width: orientation[0] == 'p' ? '50%' : '100%', height: orientation[0] == 'p' ? 300 : 300}} />
          <Image className={`${orientation[0] == 'l' && orientation[1] == 'l' ? ' mt-2' : ''}`} resizeMethod='resize' resizeMode={orientation[1] == 'p' ? 'cover' : 'cover'} source={{uri: files[1]}} style={{width: orientation[0] == 'p' ? '49%' : '100%', height: orientation[1] == 'p' ? 300 : 300}} />
        </View>
      )
  } else if (files.length == 3) {
    return (
        <View className={`flex-row justify-between mt-5`}>
          <Image resizeMethod='resize' resizeMode={orientation[0] == 'p' ? 'cover' : 'cover'} source={{uri: files[0]}} style={{width: '59%', height: 505}} />
          
          <View className='' style={{width: '40%', height: 500}}>
          <Image resizeMethod='resize' resizeMode={orientation[1] == 'p' ? 'cover' : 'cover'} source={{uri: files[1]}} style={{width: '100%', height: '50%'}} />
          <Image resizeMethod='resize' resizeMode={orientation[2] == 'p' ? 'cover' : 'cover'} source={{uri: files[2]}} style={{width: '100%', height: '50%' }} className='mt-1' />
          </View>
        </View>
      )
  } else if (files.length == 4) {
    return (
        <View className={`flex-col justify-between mt-5`} style={{height: 400}}>
          <View className='flex-row' style={{width: '100%', height: '50%'}}>
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[0]}} style={{width: '50%', height: '100%'}} />
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[1]}} style={{width: '50%', height: '100%'}} className='ml-1' />
          </View>
          
          <View className='flex-row mt-1' style={{width: '100%', height: '50%'}}>
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[2]}} style={{width: '50%', height: '100%'}} />
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[3]}} style={{width: '50%', height: '100%'}} className='ml-1' />
          </View>
        </View>
      )
  } else if (files.length > 4) {
    return (
        <View className={`flex-col justify-between mt-5`} style={{height: 400}}>
          <View className='flex-row' style={{width: '100%', height: '50%'}}>
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[0]}} style={{width: '50%', height: '100%'}} />
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[1]}} style={{width: '50%', height: '100%'}} className='ml-1' />
          </View>
          
          <View className='flex-row mt-1' style={{width: '100%', height: '50%'}}>
          <Image resizeMethod='resize' resizeMode={'cover'} source={{uri: files[2]}} style={{width: '50%', height: '100%'}} />
          <View className='ml-1' style={{width: '50%', height: '100%', position: 'relative'}}>
            <ImageBackground source={{uri: files[3]}} style={{width: '100%', height: '100%'}} />
            <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000091'}} className='items-center justify-center' >
                <Text className='text-white text-3xl font-bold'>+{files.length - 4}</Text>
            </View>
          </View>
          </View>
        </View>
      )
  }
}

export default PostMedia