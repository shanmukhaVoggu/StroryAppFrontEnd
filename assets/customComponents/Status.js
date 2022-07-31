import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ImageBackground, Dimensions} from 'react-native';

import * as Progress from 'react-native-progress';

const Status = ({route, navigation}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    route.params.vis(1);
    setInterval(() => {
      setProgress(prog => {
        return prog + 0.01;
      });
    }, 50);
    setTimeout(() => {
      navigation.navigate('Home', {vis: 0});
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={Dimensions.get('window').width}
      />
      <ImageBackground
        source={{uri: route.params.uri}}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});

export default Status;
