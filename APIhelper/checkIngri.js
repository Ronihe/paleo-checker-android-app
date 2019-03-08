import { Alert } from 'react-native';

const FOOD_MODEL = 'bd367be194cf45149e75f01d59f77ba7';
import checkPaleo from './checkPaleo';

const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'a2838dafa2ab41f9aeb5325fa91bf40d'
});
process.nextTick = setImmediate;
async function checkIngri(base64) {
  const result = await app.models.predict(FOOD_MODEL, base64);

  const relations = result.outputs[0].data.concepts.filter(
    concept => concept.value > 0.9
  );

  const paleoListRes = await Promise.all(
    relations.map(obj => checkPaleo(obj.name))
  );
  const paleoList = paleoListRes.filter(o => o);
  let paleoObj = {};
  for (let obj of paleoList) {
    for (let key in obj) {
      paleoObj[key] = obj[key];
    }
  }

  if (paleoList.length === 0) {
    Alert.alert(
      'invalid pic',
      'can you take another one?',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );
  }
  return paleoObj;
}

module.exports = checkIngri;
