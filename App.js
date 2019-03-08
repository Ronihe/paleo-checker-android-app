import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import { ImagePicker, Permissions } from 'expo';
import checkIngri from './APIhelper/checkIngri';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: undefined };
  }

  _launchCamera = async () => {
    //ask for permissons
    await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);

    // console.warn(ImagePicker);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });
    console.warn(result);
    if (!result.cancelled) {
      this.setState({ image: result.base64 });
    }
  };

  _handlePaleoChecking = async () => {
    await checkIngri(this.state.image);
  };

  render() {
    let base64Image = `data:image/png;base64,${this.state.image}`;
    return (
      <View style={styles.container}>
        <Text>Take a food pic and check if your dish is paleo </Text>
        {/* post your pic here */}
        <Button onPress={this._launchCamera} title="picButton">
          {' '}
          Take a Pic{' '}
        </Button>
        <Button onPress={this._handlePaleoChecking} title="picButton">
          {' '}
          Check Paleo{' '}
        </Button>

        <Image source={{ uri: base64Image }} />
        {/* ingredient and paleo fact table */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
