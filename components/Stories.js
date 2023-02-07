import { View, Text, FlatList, Image, Pressable } from "react-native";
import { PlusIcon } from "react-native-heroicons/solid";
import {LinearGradient} from "expo-linear-gradient";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Stories = () => {
    const navigation = useNavigation();
  const data = [
    {
      image: "https://example.com/image1.jpg",
      name: "John Doe",
      profile_picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "New York, NY",
      caption: "Exploring the city with friends #NYC #travel",
      user: true,
    },
    {
      image: "https://example.com/image2.jpg",
      name: "Jane Smith",
      profile_picture:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "Los Angeles, CA",
      caption: "Sunset at the beach #LA #sunset",
    },
    {
      image: "https://example.com/image3.jpg",
      name: "Bob Johnson",
      profile_picture:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "Chicago, IL",
      caption: "View from the Willis Tower #Chicago #skyscraper",
    },
    {
      image: "https://example.com/image4.jpg",
      name: "Emily Davis",
      profile_picture:
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "Houston, TX",
      caption: "Space Center Houston #NASA #space",
    },
    {
      image: "https://example.com/image5.jpg",
      name: "Michael Brown",
      profile_picture:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "Phoenix, AZ",
      caption: "Hiking Camelback Mountain #hiking #nature",
    },
    {
      image: "https://example.com/image6.jpg",
      name: "Sarah Miller",
      profile_picture:
        "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "Philadelphia, PA",
      caption: "Liberty Bell #history #Philadelphia",
    },
    {
      image: "https://example.com/image7.jpg",
      name: "Matthew Garcia",
      profile_picture:
        "https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      location: "San Antonio, TX",
      caption: "The Alamo #Texas #history",
    },
    {
      image: "https://example.com/image8.jpg",
      name: "Jessica Martinez",
      profile_picture:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      location: "San Diego, CA",
      caption: "La Jolla Cove #beach #ocean",
    },
    {
      image: "https://example.com/image9.jpg",
      name: "Kevin Rodriguez",
      profile_picture:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      location: "Dallas, TX",
      caption: "Reunion Tower #skyline #Dallas",
    },
  ];

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Pressable
          onPress={() => navigation.navigate('stories')}
            style={{
              width: 70,
              height: 70,
              borderRadius: 70 / 2,
              marginRight: 10,
              position: "relative",
            }}
          >
            <LinearGradient
              colors={[
                "#F70000",
                "#D11628",
                "#973663",
                "#5D569F",
                "#2178DD",
              ]}
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 1.0, y: 1.0 }}
              style={{
                height: 70,
                width: 70,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 70/2
              }}
            >
              <Image
                source={{ uri: item.profile_picture }}
                style={{
                  width: 65,
                  height: 65,
                  position: "absolute",
                  borderRadius: 65 / 2,
                  marginLeft: 1,
                  marginRight: 1,
                }}
              />
            </LinearGradient>
            {item.user ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "red",
                  position: "absolute",
                  bottom: 5,
                  right: 0,
                  borderRadius: 50 / 2,
                  zIndex: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "white",
                }}
              >
                <PlusIcon size={15} color={"white"} />
              </View>
            ) : (
              ""
            )}
          </Pressable>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Stories;
