import React from 'react';
import { StyleSheet, Text, View, Image, Button, FlatList } from 'react-native';

import { ImagePicker, Permissions } from 'expo';
import checkIngri from './APIhelper/checkIngri';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: null, paleoFacts: {} };
  }

  _launchCamera = async () => {
    await this.checkPermissions();

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    });

    await this.diaplayPaleoFacts(result);
  };

  _launchLib = async () => {
    //ask for permissons
    await this.checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    });
    await this.diaplayPaleoFacts(result);
  };

  async checkPermissions() {
    await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);
  }

  async diaplayPaleoFacts(result) {
    if (!result.cancelled) {
      this.setState(currSt => ({ ...currSt, image: result.uri }));
    }

    const paleoFactsObj = await checkIngri(result.base64);
    //console.warn(result.base64, paleoFactsObj);
    this.setState(currSt => ({ ...currSt, paleoFacts: paleoFactsObj }));
  }

  render() {
    let dataList = [];
    console.warn(this.state);
    for (let ingr in this.state.paleoFacts) {
      dataList.push({ key: ingr });
    }
    const paleoUI = (
      <FlatList
        data={dataList}
        renderItem={({ item }) => (
          <Text>
            {item.key} {this.state.paleoFacts[item.key]}
          </Text>
        )}
      />
    );

    return (
      <View style={styles.container}>
        <Text>Take a food pic and check if your dish is paleo </Text>
        {/* post your pic here */}
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <Button onPress={this._launchCamera} title="Camera" />
          <Button onPress={this._launchLib} title="Photos" />
        </View>
        {/* <Button onPress={this._handlePaleoChecking} title="picButton">
          Check Paleo
        </Button> */}
        <Image
          source={{ uri: this.state.image }}
          style={{ width: 400, height: 300 }}
        />

        <Text>This is Paleo Facts</Text>
        {paleoUI}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
