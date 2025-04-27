// import { modal, stats } from '../scripts/main';
// import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
// import { buildCompany, Tier } from './grc';

import { Eventbuilder, generateLargeMoney } from './eventBuilder';

export const Stockmarket = new Eventbuilder({
  tier: 1,
  generate(_id) {
    let money = generateLargeMoney(0, 4, 1000);
    return [
      {
        title: `Do you want to invest <span class="green">$${money}</span> in the stockmarket?`,
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
                  prependInModal: 'Cash out',
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


