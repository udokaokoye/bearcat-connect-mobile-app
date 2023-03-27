import { View, Text } from 'react-native'
import React from 'react'
import {
    HomeIcon
  } from "react-native-heroicons/solid";

const BottomTab = ({ state, descriptors, navigation }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
    
            const isFocused = state.index === index;
    
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });
    
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
    
            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
    
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
              >
                <HomeIcon color={'red'} />
              </TouchableOpacity>
            );
          })}
        </View>
      );
}

export default BottomTab