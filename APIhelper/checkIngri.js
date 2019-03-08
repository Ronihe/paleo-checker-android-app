const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const Clarifai = require('clarifai');
const FOOD_MODEL = 'bd367be194cf45149e75f01d59f77ba7';
import checkPaleo from './checkPaleo';

const clarifai = new Clarifai.App({
  apiKey: CLARIFAI_API_KEY
});

async function checkIngri(base64) {
  try {
    const result = await clarifai.models.predict(FOOD_MODEL, base64);
    //console.log(result);
    // clean up data from clarifai into nice output
    const relations = result.outputs[0].data.concepts.filter(
      concept => concept.value > 0.9
    );
    console.warn(relations.map(obj => obj.name));
    // const paleoList = [];
    // for (let ingr of relations.map(obj => obj.name)) {
    //   const isPaleo = await checkPaleo(ingr);
    //   if (isPaleo) {
    //     paleoList.push(isPaleo);
    //   }
    // }

    const paleoListRes = await Promise.all(
      relations.map(obj => checkPaleo(obj.name))
    );
    const paleoList = paleoListRes.filter(o => o);

    if (paleoList.length === 0) {
      throw new Error('invalid pic, can you take another one?');
    }
    return paleoList;
  } catch (error) {
    console.warn(error);
  }
}

module.exports = checkIngri;
