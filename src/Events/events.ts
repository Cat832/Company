// import { modal, stats } from '../scripts/main';
// import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
// import { buildCompany, Tier } from './grc';

import { Eventbuilder } from "./eventBuilder";

export const StarterEvent = new Eventbuilder({
  tier: 1,
  generate(_id) {
    return [{
      title: 'Do you want <span class="green">$10.000</span>?',
      buttons: [
        {text: 'accept', variant: 'succes', onClick() { return {
          moneyGain: 10000,
        }; }, description: 'Recieve <span class="green">$10.000</span>.'},
        {text: 'decline', variant: 'error', onClick() {
          return {};
        }, description: 'Skip the offer.'}
      ]
    }, undefined];
  },
})