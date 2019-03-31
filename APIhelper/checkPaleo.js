const FOOD_APP_ID = 'fa1364b9';
const FOOD_API = '39a0541e963b1bfc79b69ea14ad158ba';
import axios from 'axios';

async function checkPaleo(Ingr) {
  // get ingr from clarifai

  // get the food ID
  const foodUrl = `https://api.edamam.com/api/food-database/parser?ingr=${Ingr}&app_id=${FOOD_APP_ID}&app_key=${FOOD_API}`;
  const foodRes = await axios.get(foodUrl);
  //const measureURI = foodRes.data.hints[0].measures[0].uri;
  const foodId = foodRes.data.hints[0].food.foodId;
  // get the nutrient
  const nutrientUrl = `https://api.edamam.com/api/food-database/nutrients?app_id=${FOOD_APP_ID}&app_key=${FOOD_API}`;
  const nutrientRes = await axios.post(nutrientUrl, {
    yield: 1,
    ingredients: [
      {
        quantity: 1,
        measureURI:
          'http://www.edamam.com/ontologies/edamam.owl#Measure_serving',
        foodId: foodId
      }
    ]
  });
  const healthLabels = nutrientRes.data.healthLabels;
  console.warn(healthLabels);
  const message = healthLabels.includes('PALEO') ? 'Is Paleo' : 'Is not Paleo';
  return { [Ingr]: message || "cannot find this ingr's paleo fact" };
}

module.exports = checkPaleo;
