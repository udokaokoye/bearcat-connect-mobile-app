import { View, Text, Image, ImageBackground, TouchableOpacity, Pressable } from 'react-native'
import { Video } from 'expo-av';
import { SpeakerXMarkIcon, SpeakerWaveIcon } from "react-native-heroicons/outline";
import React, { useRef, useState, useEffect, useContext } from 'react'
import { VideoMuted, ViewableItem } from '../lib/swr-hooks';

const PostMedia = ({fileType, files, orientation, pid}) => {
  const videoRef = useRef(null)
    const [videoStatus, setvideoStatus] = useState({})
    const {viewableItem} = useContext(ViewableItem)
    const {videosMuted, setvideosMuted} = useContext(VideoMuted)
    // const [isMuted, setisMuted] = useState(misc.videosMuted)
    useEffect(() => {
      if (viewableItem?.key == pid && fileType == 'video' && videoRef !== null) {
        async function  stt() {
          await videoRef.current.playFromPositionAsync(0)
          await videoRef.current.playAsync()
          await videoRef.current.setIsMutedAsync(videosMuted)
        }
        stt()
      } else {
        if (fileType == 'video') {
          async function  spp() {
            await videoRef.current.pauseAsync()
          // await videoRef.current.setIsMutedAsync(true)
          }
          spp()
        }
      }
    
    }, [viewableItem])

    const toggleSound = async () => {
        await videoRef.current.setIsMutedAsync(!videosMuted)
        setvideosMuted(!videosMuted)


    }

    {
      if (fileType == 'video') {
        return (
          
<View className='relative mt-5'>
<Video
          ref={videoRef}
          style={{width: '100%', height: orientation[0] == 'l' ? 300 : 600}}
          source={{
            uri: files[0],
          }}
          useNativeControls={false}
          resizeMode="cover"
          isLooping
          // isMuted
          // shouldPlay
          onPlaybackStatusUpdate={status => setvideoStatus(() => status)}
        //   onLoad={handleLoad}
        // onUnload={handleUnload}
        />

        {/* <View>
          <TouchableOpacity onPress={() => videoRef.current.playAsync()}><Text>Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => videoRef.current.pauseAsync()}><Text>Pause</Text></TouchableOpacity>
        </View> */}

        <Pressable onPress={() => toggleSound()} className='absolute rounded-full justify-center items-center m-2' style={{top: 0, left: 0, width: 40, height: 40, backgroundColor: '#6e6d6d66'}}>
          {videosMuted ? (<SpeakerXMarkIcon color={'white'} />) : (<SpeakerWaveIcon color={'white'} />)}
        </Pressable>
</View>
          
        )
      } else {
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
    }
}

export default PostMedia