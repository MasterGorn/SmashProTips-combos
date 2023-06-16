<script setup>
import { inject, ref } from 'vue'

const axios = inject('axios') // inject axios
const combos = ref({})
const percentChoose = ref(0)
let attacksStepOne = ref([])

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

const filterCombosByPercent = (event) => {
  attacksStepOne.value = []
  // Get combos for choose percent and transform data into array
  const asArray = Object.entries(combos.value)
  if (asArray.filter(([key]) => key == event.target.value).length != 0) {
    const filtered = { ...asArray.filter(([key]) => key == event.target.value)[0][1] }

    // Keep attack name for step one
    //let attacksStepOne = []
    for (const [key, value] of Object.entries(filtered)) {
      attacksStepOne.value.push(value.steps[0])
    }

    // Keep only one occurrence for each attack
    attacksStepOne.value = [...new Set(attacksStepOne.value)]
    console.log('attacksStepOne', attacksStepOne.value)
  }
}

const nextStep = () => {}

getList()
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
    <section class="step stepOne">
      <h3 class="titleStep">Etape 1</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepOne" :key="attack" class="attackWrapper">
          <img @click="nextStep" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section class="step stepTwo">
      <h3 class="titleStep">Etape 2</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepTwo" :key="attack" class="attackWrapper">
          <img @click="nextStep" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section class="step stepThree">
      <h3 class="titleStep">Etape 3</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepThree" :key="attack" class="attackWrapper">
          <img @click="nextStep" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section class="step stepFour">
      <h3 class="titleStep">Etape 4</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepFour" :key="attack" class="attackWrapper">
          <img @click="nextStep" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section class="step stepFive">
      <h3 class="titleStep">Etape 5</h3>
      <div class="attacksWrapper">
        <div v-for="attack of attacksStepFive" :key="attack" class="attackWrapper">
          <img @click="nextStep" :src="getImageUrl('mario', attack)" class="attackImage" />
          <span class="nameAttack">{{ attack }}</span>
        </div>
      </div>
    </section>
    <section class="step stepVideo">
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
  padding: 32px 0;
  text-align: center;
}

.stepHeader {
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

.title {
  margin-bottom: 32px;
  font-size: 48px;
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
  color: red;
  background: white;
}

.titleStep {
}

.attacksWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .attackWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 16px;
    width: 240px;
    cursor: pointer;

    .attackImage {
      width: 100%;
    }
  }
}
</style>
