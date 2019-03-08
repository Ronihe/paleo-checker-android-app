import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
// import ImagePicker from 'react-native-image-picker';

import { ImagePicker, Permissions } from 'expo';

// const options = {
//   title: 'Select Avatar',
//   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images'
//   }
// };

// Launch Camera:

// Open Image Library:
// function launchLib() {
//   ImagePicker.launchImageLibrary(options, response => {
//     // Same code as in above section!
//   });
// }
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: undefined };
    // this.method = this.method.bind(this);
    // bind method here if necessary
  }

  _launchCamera = async () => {
    //ask for permissons
    const res = await Promise.all([
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

    // ImagePicker.launchCamera(options, response => {
    //   // Same code as in above section!

    //   console.log('Response = ', response);

    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     const source = { uri: response.uri };

    //     // You can also display the image using data:
    //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    //     this.setState({
    //       avatarSource: source
    //     });
    //   }
    // });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Take a food pic and check if your dish is paleo </Text>
        {/* post your pic here */}
        <Button onPress={this._launchCamera} title="picButton">
          {' '}
          Take a Pic{' '}
        </Button>
        {/* <Image source={require(`./${this.state.image}`)} /> */}
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
