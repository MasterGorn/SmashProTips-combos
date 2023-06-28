<script setup>
import { inject, ref } from 'vue'

const axios = inject('axios') // inject axios
const combos = ref({})
const percentChoose = ref(0)
let attacksStepOne = ref([])
let attacksStepTwo = ref([])
let attacksStepThree = ref([])
let attacksStepFour = ref([])
let attacksStepFive = ref([])
let stepsActive = ref([false,false,false,false,false,false])
//@todo : remplir ce tableau contenant toutes les attaques précédentes (et le vider à chaque changement de %)
let prevAttacks = ref([])

const getList = () => {
  axios
    .get('https://smashpro.tips/wp-content/themes/smashpro/assets/js/data/combos/combos-2.json')
    .then((response) => {
      combos.value = response.data
      console.log(response.data)
    })
}

const getImageUrl = (character, name) => {
  return new URL(`./assets/images/combos/${character}/${name}.jpg`, import.meta.url).href
}

const getCombosChoosedArray = () => {
  // Get combos for choose percent and transform data into array
  const asArray = Object.entries(combos.value)
  let filtered = {}
  if (asArray.filter(([key]) => key == percentChoose.value).length != 0) {
    filtered = { ...asArray.filter(([key]) => key == percentChoose.value)[0][1] }
  }

  return filtered
}

const filterCombosByPercent = (event) => {
  attacksStepOne.value = []
  attacksStepTwo.value = [] 
  attacksStepThree.value = [] 
  attacksStepFour.value = [] 
  attacksStepFive.value = [] 

  // Get combos for choose percent and transform data into array
  const filtered = getCombosChoosedArray()

  // Keep attack name for step one
  for (const [key, value] of Object.entries(filtered)) {
    attacksStepOne.value.push(value.steps[0])
  }

  // Keep only one occurrence for each attack
  attacksStepOne.value = [...new Set(attacksStepOne.value)]

  // Show stepOneWrapper if percent had combos
  for (let i = 0 ; i < 6 ; i++) {
    if(i === 0) { // Show first step
      stepsActive.value[0] = attacksStepOne.value.length > 0 ? true : false
    } else { // Hide all steps
      stepsActive.value[i] = false
    }
  }
}

const nextStep = (step, prevAttack) => {
//@todo : vider l'étape en question et toutes les étapes (sur ce principe : attacksStepOne.value = [])
  const filtered = getCombosChoosedArray()

  let attacksNextStep = [attacksStepOne, attacksStepTwo, attacksStepThree, attacksStepFour, attacksStepFive]

  //@todo le filtered doit avoir tous ceux de la deuxième étape qui ont la première étape de l'image que l'on a cliqué
  // Keep attack name for step one
  for (const [key, value] of Object.entries(filtered)) {
    // Add attack only if previous attack is this clicked
    if(value.steps[step-1] == prevAttack)
    attacksNextStep[step].value.push(value.steps[step])
  }

  // Keep only one occurrence for each attack
  attacksNextStep[step].value = [...new Set(attacksNextStep[step].value)]
  console.log('attacksNextStep[step+1]', attacksNextStep[step+1].value)

  // Show nextStepWrapper @todo 4 : verif si fin combo auquel cas mettre à true div de la vidéo 
  stepsActive.value[step] = true;
  // else stepsActive.value[6] = true;
}

getList()

//@todo : garder l'image sélectionnée agrandi (surement avec une ref en classe de la div parent)
//@todo : au clic sur une image alors que le combo est affiché, on repart sur un nouveau combo.
//@todo : si pas d'attaque après : vidéo
</script>

<template>
  <main class="combosWrapper">
    <section class="step stepHeader">
      <h2 class="title">Jauge de dégat</h2>
      <p class="explain">
        Ceci est un outil de composition de combos. Il n'est pas exaustif et cherche à se
        perfectionner régulièrement.<br />
        Déplace la jauge de pourcentages pour découvrir quelles attaques permettent d'ouvrir un
        combo. Choisis ensuite l'attaque pour découvrir quels coups sont possibles par la suite.
      </p>
      <span class="rangeWrapper" data-range-min="0" data-range-max="150">
        <input
          v-model="percentChoose"
          @change="filterCombosByPercent($event)"
          class="range"
          type="range"
          step="1"
          min="0"
          max="150"
        />
      </span>
      <div class="percent">{{ percentChoose }} %</div>
    </section>
    <section :class="{'active': stepsActive[0]}" class="step stepOne">
      <h3 class="titleStep">Etape 1</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepOne" :key="attack" class="attackWrapper">
          <img @click="nextStep(1,attack)" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section> 
    <section :class="{'active': stepsActive[1]}" class="step stepTwo">
      <h3 class="titleStep">Etape 2</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepTwo" :key="attack" class="attackWrapper">
          <img @click="nextStep(2,attack)" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section :class="{'active': stepsActive[2]}" class="step stepThree">
      <h3 class="titleStep">Etape 3</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepThree" :key="attack" class="attackWrapper">
          <img @click="nextStep(3,attack)" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section :class="{'active': stepsActive[3]}" class="step stepFour">
      <h3 class="titleStep">Etape 4</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepFour" :key="attack" class="attackWrapper">
          <img @click="nextStep(4,attack)" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section :class="{'active': stepsActive[4]}" class="step stepFive">
      <h3 class="titleStep">Etape 5</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepFive" :key="attack" class="attackWrapper">
          <img @click="nextStep(5,attack)" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section :class="{'active': stepsActive[5]}" class="step stepVideo">
      <h3 class="titleStep">Exemple</h3>
      <p>La vidéo ICI</p>
    </section>
    <ul>
      <template v-for="combo of combos" :key="combo.link">
        <li v-if="combo.percent == percentChoose && combo.steps[0].step1">
          <strong>{{ combo.percent }}:</strong> {{ combo.link }}
          <br />
          <img
            @click="nextStep"
            :src="getImageUrl('mario', combo.steps[0].step1)"
            v-if="firstOccurrence"
          />

          {{ combo.steps[0].step1 }} {{ combo.steps[0].step2 }} {{ combo.steps[0].step3 }}
          {{ combo.steps[0].step4 }}
        </li>
      </template>
    </ul>
  </main>
</template>

<style scoped>
.combosWrapper {
  margin: auto;
}
.step {
  display: none;
  padding: 32px 0;
  text-align: center;
}

.stepHeader {
  display: block;
  background: #c7291a;
}

.stepOne {
  color: #c7291a;
  background: white;
}

.stepTwo {
  background: #eccbc6;
}

.stepThree {
  background: #e3a198;
}

.stepFour {
  background: #da776b;
}

.stepFive {
  background: #d04437;
}

.stepVideo {
  background: #c7291a;
}

.active {
  display: block;
}

.title {
  margin-bottom: 32px;
  font-size: 48px;
  font-family: 'introRust-Base';
  text-transform: uppercase;
  color: white;
}

.explain {
  width: 100%;
  max-width: 640px;
  padding: 16px;
  margin: 0 auto 32px;
  color: white;
  text-align: justify;
}

.range {
  margin-bottom: 32px;
  width: 100%;
  max-width: 640px;
  height: 15px;
  background: white;
  -webkit-appearance: none;
  outline: none;
  border-radius: 15px;
}

.range::-webkit-slider-thumb {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: red;
  -webkit-appearance: none;
  cursor: pointer;
  border: 2px solid white;
}

.rangeWrapper {
  position: relative;

  &:after,
  &:before {
    position: absolute;
    top: 24px;
    font-size: 20px;
    font-weight: 600;
    font-family: 'introRust-Base';
    color: white;
  }

  &:after {
    right: -16px;
    content: attr(data-range-max) ' %';
  }

  &:before {
    left: -8px;
    content: attr(data-range-min) ' %';
  }
}

.range::-webkit-slider-thumb::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: white;
  -webkit-appearance: none;
  cursor: pointer;
  border: 2px solid white;
}


.percent {
  width: 240px;
  margin: 0 auto 32px;
  padding: 8px 48px;
  font-size: 48px;
  font-weight: 700;
  font-family: 'introRust-Base';
  color: red;
  background: white;
}

.titleStep {
  font-size: 30px;
  font-family: 'introRust-Base';
  text-transform: uppercase;
}

.attacksWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 48px auto;
  .attackWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 16px;
    width: 180px;
    cursor: pointer;
    transition: all .3s ease-out;

    &:hover {
      transform: scale(1.5);
      margin: 0 76px;
      transition: all .3s ease-in;
    }

    .attackImage {
      width: 100%;
    }

    .nameAttack {
      margin-top: 8px;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
}
</style>
