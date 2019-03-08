import React from 'react';
import { StyleSheet, Text, View, Image, Button, FlatList } from 'react-native';

import { ImagePicker, Permissions } from 'expo';
import checkIngri from './APIhelper/checkIngri';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: null, paleoFacts: null };
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
      this.setState({ image: result.uri, paleoFacts: 'Loading' });
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
    let paleoUI =
      this.state.paleoFacts === 'Loading' ? (
        <Text style={{ fontSize: 30 }}>Loading...</Text>
      ) : (
        <FlatList
          data={dataList}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: 25,
                color:
                  this.state.paleoFacts[item.key] === 'Is Paleo'
                    ? 'green'
                    : 'red'
              }}
            >
              {item.key} {this.state.paleoFacts[item.key]}
            </Text>
          )}
        />
      );

    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 10 }}>
          Paleo Food Checker
        </Text>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <Button onPress={this._launchCamera} title="Camera" />
          <View style={{ width: 30 }} />
          <Button onPress={this._launchLib} title="Photos" />
        </View>
        {/* <Button onPress={this._handlePaleoChecking} title="picButton">
          Check Paleo
        </Button> */}
        <Image
          source={{ uri: this.state.image }}
          style={{ width: 400, height: 300, marginTop: 20, marginBottom: 20 }}
        />

        {paleoUI}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});
