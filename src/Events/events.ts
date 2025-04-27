// import { modal, stats } from '../scripts/main';
// import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
// import { buildCompany, Tier } from './grc';

import { pickRandom, stats } from '../scripts/main';
import { Company } from '../types/main';
import { Eventbuilder, generateLargeMoney } from './eventBuilder';

export const Stockmarket = new Eventbuilder({
  tier: 1,
  generate(_id) {
    let money = generateLargeMoney(0, 4, 1000);
    return [
      {
        title: `📈 Do you want to invest <g>$${money}</g> in the stockmarket?`,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            onClick() {
              return {
                propertyGain: {
                  name: 'stockmarket investment',
                  icon: 'money-bill-trend-up',
                  onDamagePrice: 0,
                  startedAt: money,
                  value: money,
                  prependInModal: 'Cash out ',
                  immune: true,
                  growVals: [-3, 3],
                },
                moneyGain: -money,
              };
            },
            description: `Recieve a "stockmarket" property of value <span class="green">$${money}</span>.`,
          },
          {
            text: 'decline',
            variant: 'error',
            onClick() {
              return {};
            },
            description: 'Skip the offer.',
          },
        ],
      },
      undefined,
    ];
  },
});

export const PropertyFire = new Eventbuilder({
  tier: 1,
  shouldSkip() {
    let options = stats.properties.filter((v) => !(v.damaged || v.immune));
    return options.length == 0;
  },
  generate(_id) {
    let options = stats.properties.filter((v) => !(v.damaged || v.immune));
    let random = pickRandom(options);
    return [
      {
        title: `🔥 Your ${random.name} is on fire! Do you call the fire department, risking fire fighters lifes, or do you fix it yourself?`,
        buttons: [
          {
            text: 'Fix it yourself',
            variant: 'succes',
            description: `Leave your ${random.name} in a damaged state, which will cost <r>$${random.onDamagePrice}</r>.`,
            onClick() {
              random.damaged = true;
              return {};
            },
          },
          {
            text: 'Call fire department',
            variant: 'error',
            description:
              'Lose <r>4%</r> reputation, due to fire fighters risking your lifes for objects.',
            onClick() {
              return { reputationGain: -4 };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const Hotdogshop = new Eventbuilder({
  tier: 1,
  oneTime: true,
  generate(id) {
    let stand: Company = {
      name: `Garçia Hotdogs`,
      income: generateLargeMoney(0, 7, 500),
      reputation: 97,
    };
    let price = generateLargeMoney(0, 5, 750);
    return [
      {
        title: `🌭 The hotdog stall where your workers eat offers to become officialy part of your company for <r>$${price}</r>. If you refuse, he moves his stall.`,
        buttons: [
          {
            text: 'buy',
            variant: 'succes',
            description: `Buy <span class="blue modal-link" aria-description="${id}">“${stand.name}”</span> for <g>$${price}</g>.`,
            onClick() {

              return {
                propertyGain: {
                  name: 'hotdog stand',
                  icon: 'hotdog',
                  onDamagePrice: stand.income / 5,
                  startedAt: price,
                  value: price,
                  growVals: [-3, 3],
                  hideNameInModal: true,
                  prependInModal: `Sell Garçia's hotdog stand`,
                  sellDescription:
                    'You will lose 6% reputation due to your workers wanting hotdogs.',
                  onSell() {
                    stats.reputation = stats.reputation - 6;
                  },
                },
              };
            },
          },
          {
            text: 'refuse',
            description:
              'Lose 6% reputation due to your workers wanting hotdogs.',
            variant: 'error',
            onClick() {
              return { reputationGain: -6 };
            },
          },
        ],
      },
      stand,
    ];
  },
});
