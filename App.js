/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {useQuery, useMutation, gql} from '@apollo/client';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ImageBackground,
  Image,
} from 'react-native';

const GET_USER_DETAILS = gql`
  query abc {
    getUserDetails {
      name
      bio
    }
  }
`;

const ADD_PROFILE_PICTURE = gql`
  mutation AddProfilePicture($uri: String) {
    addProfilePicture(uri: $uri)
  }
`;

const App = ({route, navigation}) => {
  // Have to clear the doubt, why this is being called when using inside useStae(<>) for every react navigation
  // const ra = () =>{
  //   console.log("came in");
  //   console.log(route);
  //   console.log((route.params!==undefined? 1:0));
  //   return (route.params!==undefined? 1:0);
  // }

  const update = a => {
    setVis(a);
  };

  const [avatar, setAvatar] = useState(require('./assets/images/upload.png'));
  const [vis, setVis] = useState(0);
  const [status, setStatus] = useState(require('./assets/images/upload.png'));
  const [addProfilePicture, {data, loading, error}] =
    useMutation(ADD_PROFILE_PICTURE);

  const onPress = async () => {
    const result = await launchImageLibrary();
    setStatus({uri: result.assets[0].uri});
    setVis(0);
  };

  const onLongPress = async () => {
    const result = await launchImageLibrary();
    setAvatar({uri: result.assets[0].uri});
    addProfilePicture({variables: {uri: result.assets[0].uri}});
  };

  const DisplayData = () => {
    const {loading, error, data} = useQuery(GET_USER_DETAILS);

    if (loading) {
      return <Text style={styles.textColor}>Loading...</Text>;
    }
    if (error) {
      console.log(error);
      return <Text style={styles.textColor}>`Error + ${error.message}`</Text>;
    }
    if (data) {
      console.log(data);
      return (
        <View>
          <Text style={styles.textColor}>{data.getUserDetails.name}</Text>
          <Text style={styles.textColor}>{data.getUserDetails.bio}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.baseContainer}>
      <TouchableHighlight
        onLongPress={onLongPress}
        onPress={() => {
          navigation.navigate('Status', {uri: status.uri, vis: update});
        }}
        underlayColor="white">
        <View style={[styles.octagon, {borderColor: vis ? 'grey' : 'blue'}]}>
          <ImageBackground style={styles.image} source={avatar} />
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tinyLogo}
        onPress={onPress}
        underlayColor="white">
        <Image
          style={styles.tinyLogo}
          source={require('./assets/images/statusUpload.png')}
        />
      </TouchableHighlight>
      <View style={styles.detailsContainer}>
        <DisplayData />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  octagon: {
    width: 200,
    height: 200,
    borderWidth: 10,
    borderColor: 'grey',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  baseContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  detailsContainer: {
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColor: {
    color: 'green',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  tinyLogo: {
    top: 170,
    left: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
  },
});

export default App;
