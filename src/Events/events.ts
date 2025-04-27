// import { modal, stats } from '../scripts/main';
// import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
// import { buildCompany, Tier } from './grc';

import { modal, pickRandom, stats } from '../scripts/main';
import { Company } from '../types/main';
import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
import { getRandomProduct } from './grc';

export const Stockmarket = new Eventbuilder({
  tier: 1,
  generate(_id) {
    let money = generateLargeMoney(0, 4, 1000);
    return [
      {
        title: `📈 An expert trader says he can help you make money. All he needs is <g>$${money}</g> from you to invest the stockmarket. Do you comply? `,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            onClick() {
              return {
                propertyGain: {
                  name: 'stockmarket investment',
                  icon: 'money-bill-trend-up',
                  sector: 'service',
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
            description: `Leave your ${random.name} in a damaged state, which will cost <r>$${random.onDamagePrice}</r> to repair.`,
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
                  sector: 'economy',
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

export const Dropshipping = new Eventbuilder({
  tier: 1,
  oneTime: false,
  generate(_id) {
    let product1 = getRandomProduct();
    let product2 = getRandomProduct();

    let dropshippingGoesbad = chance(30);
    let moneyGain = dropshippingGoesbad
      ? generateLargeMoney(0, 8, -100)
      : generateLargeMoney(0, 8, 100);

    const popupMsg = () => {
      modal.changeModal({
        title: 'Dropshipping failed...',
        description: `You will now have to pay <r>$${Math.abs(
          moneyGain
        )}</r> annualy for 3 years to clean up this mess. `,
        options: {
          footer: {
            hideConfirm: true,
            cancelText: 'okay',
          },
        },
      });
      modal.show();
    };

    return [
      {
        title: `📦 You start dropshipping, and have to choose between <span class="blue">“${product1}”</g> and <span class="blue">“${product2}”</r>, or do you choose to not risk it and find safer ways to make money.`,
        buttons: [
          {
            variant: 'succes',
            text: product1,
            description: `Start dropshipping “${product1}”.`,
            onClick() {
              if (dropshippingGoesbad) {
                popupMsg();
              }
              return dropshippingGoesbad
                ? {
                    incomeGain: {
                      name: `Recovering “${product1}”`,
                      annual: moneyGain,
                      disbandable: false,
                      disbandYearnumber: stats.yearNumber + 3,
                    },
                  }
                : {
                    incomeGain: {
                      name: `Dropshipping “${product1}”`,
                      annual: moneyGain,
                      disbandable: true,
                    },
                  };
            },
          },
          {
            variant: 'succes',
            text: product2,
            description: `Start dropshipping “${product2}”.`,
            onClick() {
              if (dropshippingGoesbad) {
                popupMsg();
              }
              return dropshippingGoesbad
                ? {
                    incomeGain: {
                      name: `Recovering “${product2}”`,
                      annual: moneyGain,
                      disbandable: false,
                      disbandYearnumber: stats.yearNumber + 3,
                    },
                  }
                : {
                    incomeGain: {
                      name: `Dropshipping “${product2}”`,
                      annual: moneyGain,
                      disbandable: true,
                    },
                  };
            },
          },
          {
            text: "don't risk it",
            variant: 'error',
            description: "Don't start dropshipping any product.",
            onClick() {
              return {};
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const TooMuchProducts = new Eventbuilder({
  tier: 1,
  generate(_id) {
    let productPrice = generateLargeMoney(40, 90, 30);
    return [
      {
        title: `💸 You have too much products (worth <g>$${
          productPrice / 4
        }</g>) and no place to store them. Do you buy an expansive warehouse with the chance of getting more value from them, or do you sell them now?`,
        buttons: [
          {
            text: 'buy warehouse',
            description: `Buy a warehouse for <r>$${
              productPrice * 2
            }</r> to store them.`,
            variant: 'succes',
            onClick() {
              return {
                propertyGain: {
                  name: 'warehouse',
                  icon: 'warehouse',
                  onDamagePrice: productPrice / 15,
                  startedAt: productPrice / 4,
                  value: productPrice / 4,
                  growVals: [-2, 6],
                  sector: 'industry',
                  hideNameInModal: true,
                  prependInModal: 'Sell products',
                },
                moneyGain: -(productPrice / 4),
              };
            },
          },
          {
            text: 'sell now',
            variant: 'error',
            description: `Sell the products now for <g>$${productPrice / 4}</g>`,
            onClick() {
              return {
                moneyGain: productPrice / 4
              }
            },
          },
        ],
      },
      undefined,
    ];
  },
});
