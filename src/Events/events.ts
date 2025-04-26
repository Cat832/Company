import { modal, stats } from '../scripts/main';
import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
import { buildCompany, Tier } from './grc';

export const CyberAttack = new Eventbuilder({
  generate: (id, tier) => {
    let company = buildCompany((tier + 1) as Tier);
    let reputationGain = (company.reputation - 50) / 10;
    let price = generateLargeMoney(2, 6, 5000);
    let interactionTitle = `There is a cyber attack planned on your company! <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> has offered to help: they want <span class="red">$${price}</span>, in exchange for assisting you with the attack.`;
    return [
      {
        title: interactionTitle,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            description: `Pay the money and ${
              reputationGain >= 0 ? 'gain' : 'lose'
            } <span class="${reputationGain >= 0 ? 'green' : 'red'}">${Math.abs(
              reputationGain
            )}%</span> reputation for working with ${company.name}.`,
            onClick: () => {
              return {
                moneyGain: -price,
                reputationGain: reputationGain,
              };
            },
          },
          {
            text: 'decline',
            variant: 'warning',
            description: `Leave this to your cybersecurity, risking a 40% chance that they will steal <span class="red">$${
              price * 4
            }</span> from you.`,
            onClick: () => {
              let cyberAttackDefended = !chance(40);
              if (cyberAttackDefended) {
                modal.changeModal({
                  title: 'Attack defended!',
                  description:
                    'You successfully defended against the attack, losing no money!',
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
              } else {
                modal.changeModal({
                  title: 'Attack not defended...',
                  description: `A cyberattack hacked into your bank account, stealing <span class="red">$${
                    price * 4
                  }</span>...`,
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
              }
              return {
                moneyGain: cyberAttackDefended ? 0 : -(price * 4),
              };
            },
          },
        ],
      },
      company,
    ];
  },
  tier: 3,
});

export const TakingCareOfFamilyMember = new Eventbuilder({
  tier: 1,
  oneTime: true,
  generate: (_id, _tier) => {
    return [
      {
        title:
          'A family member lost their house, and asks if they can stay with you.',
        buttons: [
          {
            text: 'accept',
            description:
              'Take your family member in, for a small price of around <span class="red">-$700</span> per year.',
            variant: 'succes',
            onClick() {
              return {
                incomeGain: {
                  name: 'Taking care of family member',
                  annual: -700,
                  disbandable: true,
                  disbanddescription: 'lose 10% reputation.',
                  onDisband() {
                    stats.reputation = stats.reputation - 10;
                  },
                },
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Lose 10% reputation due to not knowing clear morals.',
            onClick() {
              return {
                reputationGain: -10,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const CompanyPitch = new Eventbuilder({
  tier: 4,
  generate(id, tier) {
    let company = buildCompany(tier);
    let price = generateLargeMoney(2, 6, 10000);
    let donatingIncome = parseInt((company.income / 3).toFixed(0));
    let scoldReputationLoss = 5 + company.reputation / 10;
    return [
      {
        title: `The company <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> throws an amazing pitch to you. The company looks like it will generate <span class="green">$${donatingIncome}</span> annually for you, in exchange for <span class="red">$${price}</span>.`,
        buttons: [
          {
            text: `invest`,
            variant: 'succes',
            description: `Pay <span class="red">$${price}</span> for ~<span class="green">$${donatingIncome}</span> annually.`,
            onClick() {
              return {
                incomeGain: {
                  name: `Money from “${company.name}”`,
                  annual: donatingIncome,
                  disbandable: true,
                },
                moneyGain: -price,
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Skip the offer, gain & lose nothing.',
            onClick() {
              return {};
            },
          },
          {
            text: 'scold',
            variant: 'warning',
            description: `Yell at them for the stupid deal, and get the company for half the price, but lose <span class="red">${scoldReputationLoss}%</span> reputation.`,
            onClick() {
              return {
                incomeGain: {
                  name: `Money from “${company.name}”`,
                  annual: donatingIncome,
                  disbandable: true,
                },
                moneyGain: -(price / 2),
                reputationGain: -scoldReputationLoss,
              };
            },
          },
        ],
      },
      company,
    ];
  },
});

export const CharityPartnership = new Eventbuilder({
  tier: 4,
  generate(_id, tier) {
    let expenses = generateLargeMoney(1, tier, 2000);
    let reputationBoost = (expenses / 4000) * 10;
    return [
      {
        title: `A charity likes to parter up with you. They want around ~<span class="red">$${expenses}</span> annually, to spend on children in need. <strong>This deal is permanent</strong>.`,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            description: `Partner with the charity and pay <span class="red">$${expenses}</span> annually. This comes with a <span class="green">${reputationBoost}%</span> reputation boost.`,
            onClick: () => {
              return {
                incomeGain: {
                  name: 'Donating to charity',
                  annual: -expenses,
                  disbandable: false,
                  nonDynamic: true,
                },
                reputationGain: reputationBoost,
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: `Decline the offer, but lose <span class="red">${reputationBoost}%</span> reputation.`,
            onClick: () => {
              return {
                reputationGain: -reputationBoost,
              };
            },
          },
          {
            text: 'donate',
            variant: 'info',
            description: `Pay <span class="red">$${
              expenses * 2
            }</span> to get rid of the charity <b>and</b> the media.`,
            onClick() {
              return {
                moneyGain: -(expenses * 2),
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const Sweatshops = new Eventbuilder({
  tier: 4,
  generate: (id, tier) => {
    let company = buildCompany(tier);
    company.reputation -= 30;
    if (company.reputation <= 0) company.reputation = 2;

    let potentialProfit = generateLargeMoney(1, 4, 4680);

    return [
      {
        title: `<span class="blue modal-link" aria-description="${id}">“${company.name}”</span> is selling their sweatshops, which are using child labour. These will profit you <span class="green">$${potentialProfit}</span>, however they are highly unethical.`,
        buttons: [
          {
            text: 'buy',
            variant: 'succes',
            description: `Gain an income of <span class="green">$${potentialProfit}</span> annually, but lose <span class="red">20%</span> reputation.`,
            onClick: () => {
              return {
                incomeGain: {
                  name: 'Sweatshops',
                  annual: potentialProfit,
                  disbandable: true,
                  onDisband() {
                    stats.reputation = stats.reputation + 5;
                  },
                  disbanddescription:
                    'gain <span class="green">5%</span> reputation.',
                },
                reputationGain: -20,
              };
            },
          },
          {
            text: 'refuse',
            variant: 'error',
            description: 'Skip the offer and gain/lose nothing.',
            onClick: () => {
              return {};
            },
          },
          {
            text: 'take down',
            variant: 'warning',
            description: `Take down the sweat shops for a <span class="green">10%</span> reputation boost, except this costs <span class="red">$${
              potentialProfit * 7
            }</span>.`,
            onClick() {
              return {
                moneyGain: potentialProfit * -7,
                reputationGain: 10,
              };
            },
          },
        ],
      },
      company,
    ];
  },
});

// export const PitchCompany = new Eventbuilder({
//   generate: (id, tier) => {
//     let company = buildCompany((tier + 2) as Tier);
//     let price = generateLargeMoney(2, 4, 25000);
//     let annualPayment = (price / 25) * 3;
//     let interactionTitle = `Investors from <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> like to invest in you; they offer <span class="green">$${price}</span>, if you pay them around <span class="red">$${annualPayment}</span> annually.`;
//     return [
//       {
//         title: interactionTitle,
//         buttons: [
//           {
//             text: 'accept',
//             variant: 'succes',
//             description: `Recieve <span class="green">$${price}</span>, but pay <span class="red">$${annualPayment}</span> annually.`,
//             onClick: () => {
//               return {
//                 moneyGain: price,
//                 incomeGain: {
//                   name: `Payment to “${company.name}”`,
//                   annual: -annualPayment,
//                   disbandable: false,
//                 },
//               };
//             },
//           },
//           {
//             text: 'decline',
//             variant: 'error',
//             description: 'Skip the offer and lose/gain nothing.',
//             onClick() {
//               return {};
//             },
//           },
//           {
//             text: 'push deal',
//             variant: 'warning',
//             description: `Try to push for a better deal, with a 50% succes rate, you will have to pay half.`,
//             onClick: () => {
//               let dealFailed = chance(50);
//               if (dealFailed) {
//                 modal.changeModal({
//                   title: 'Lost deal...',
//                   description:
//                     "They didn't like your attitiude. You lost the deal.",
//                   options: {
//                     footer: { cancelText: 'close', hideConfirm: true },
//                   },
//                 });
//                 modal.show();
//               } else {
//                 modal.changeModal({
//                   title: 'Deal pushed!',
//                   description: `You got a way better deal, now you only have to pay <span class="red">$${
//                     annualPayment / 2
//                   }</span>!`,
//                   options: {
//                     footer: { cancelText: 'close', hideConfirm: true },
//                   },
//                 });
//                 modal.show();
//               }
//               return {
//                 moneyGain: dealFailed ? undefined : price,
//                 incomeGain: dealFailed
//                   ? undefined
//                   : {
//                       name: `Payment to “${company.name}”`,
//                       annual: -(annualPayment / 2),
//                       disbandable: false,
//                     },
//               };
//             },
//           },
//         ],
//       },
//       company,
//     ];
//   },
//   tier: 4,
// });

const firstSector: string[] = [
  'Coal mines',
  'Corn farms',
  'Pumpjacks',
  'Orchards',
  'Cotton fields',
  'Lumber yards',
  'Gold mines',
  'Quarries',
];

export const FirstSector = new Eventbuilder({
  tier: 2,
  generate(_id, _tier) {
    let sector = firstSector[Math.floor(Math.random() * firstSector.length)];
    let price = generateLargeMoney(11, 17, 135);
    let gain = generateLargeMoney(11, 17, 345);
    return [
      {
        title: `${sector} have opened up for <span class="red">$${price}</span>, experts estimate they will generate around <span class="green">$${gain}</span> annually.`,
        buttons: [
          {
            text: 'buy',
            description: `Pay <span class="red">$${price}</span> for an estimate income of around <span class="green">$${gain}</span> annually.`,
            variant: 'succes',
            onClick() {
              return {
                incomeGain: {
                  name: sector,
                  annual: gain,
                  disbandable: true,
                },
                moneyGain: -price,
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Skip the offer and lose/gain nothing',
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

export const StockMarketTip = new Eventbuilder({
  tier: 2,
  generate(_id, _tier) {
    const tipCost = generateLargeMoney(1, 5, 3000);
    const profit = tipCost * 3;
    const failChance = 35;
    return [
      {
        title: `A trader offers you a "guaranteed" stock market tip for <span class="red">$${tipCost}</span>. It could triple your investment, but it might be fake.`,
        buttons: [
          {
            text: 'invest',
            variant: 'succes',
            description: `Invest <span class="red">$${tipCost}</span>. There's a <b>${failChance}%</b> chance the tip is fake.`,
            onClick: () => {
              const failed = chance(failChance);
              if (failed) {
                modal.changeModal({
                  title: 'Bad Tip!',
                  description:
                    'The tip was fake. You lost all your investment.',
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
                return { moneyGain: -tipCost };
              } else {
                modal.changeModal({
                  title: 'Success!',
                  description: `The stock surged! You made <span class="green">$${profit}</span>!`,
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
                return { moneyGain: profit - tipCost };
              }
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'You decide not to trust the shady trader.',
            onClick: () => ({}),
          },
        ],
      },
      undefined,
    ];
  },
});

export const EnvironmentalCrisis = new Eventbuilder({
  tier: 2,
  generate(_id, _tier) {
    const fine = generateLargeMoney(1, 3, 5000);
    return [
      {
        title: `Your factories are accused of polluting a local river. Environmental agencies demand a <span class="red">$${fine}</span> cleanup.`,
        buttons: [
          {
            text: 'pay fine',
            variant: 'succes',
            description: `Pay <span class="red">$${fine}</span> to restore reputation and clean up the area.`,
            onClick: () => ({
              moneyGain: -fine,
              reputationGain: 8,
            }),
          },
          {
            text: 'deny',
            variant: 'error',
            description:
              'Refuse to pay. Keep your money but lose <span class="red">15%</span> reputation.',
            onClick: () => ({
              reputationGain: -15,
            }),
          },
        ],
      },
      undefined,
    ];
  },
});

export const TechGrant = new Eventbuilder({
  tier: 4,
  generate(_id, _tier) {
    const grant = generateLargeMoney(1, 7, 20000);
    const cost = (grant / 20) * 3;
    return [
      {
        title: `The government offers a <span class="green">$${grant}</span> grant to support advanced tech research. But it requires <span class="red">$${cost}</span> co-investment annually for 5 years.`,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            description: `Get <span class="green">$${grant}</span> now, pay <span class="red">$${cost}</span> annually for 5 years.`,
            onClick: () => {
              console.log(stats.yearNumber);
              return {
                moneyGain: grant,
                incomeGain: {
                  name: 'Tech Grant Co-Funding',
                  annual: -cost,
                  disbandYearnumber: stats.yearNumber + 5,
                  disbandable: false,
                },
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Refuse the grant, keep everything as-is.',
            onClick: () => ({}),
          },
        ],
      },
      undefined,
    ];
  },
});

export const WarehouseFire = new Eventbuilder({
  tier: 2,
  generate(_id, _tier) {
    const damage = generateLargeMoney(1, 4, 10000);
    return [
      {
        title: `A warehouse storing your goods caught fire. You can claim insurance or cover the costs yourself.`,
        buttons: [
          {
            text: 'claim insurance',
            variant: 'succes',
            description: `Insurance covers damage, but you lose <span class="red">5%</span> reputation due to delays and PR issues.`,
            onClick: () => ({
              reputationGain: -5,
            }),
          },
          {
            text: 'cover damage',
            variant: 'warning',
            description: `Pay <span class="red">$${damage}</span> from your own funds. No reputation damage.`,
            onClick: () => ({
              moneyGain: -damage,
            }),
          },
        ],
      },
      undefined,
    ];
  },
});

//* Low reputation
export const UnionStrike = new Eventbuilder({
  tier: 3,
  generate(_id, _tier) {
    const cost = generateLargeMoney(1, 3, 7500);
    return [
      {
        title: `Your workers are striking for better wages. The union demands <span class="red">$${cost}</span> in improvements.`,
        buttons: [
          {
            text: 'negotiate',
            variant: 'warning',
            description: `Try to settle with half the cost. 50% chance to succeed.`,
            onClick: () => {
              const failed = chance(50);
              if (failed) {
                modal.changeModal({
                  title: 'Negotiations Failed!',
                  description:
                    'Talks broke down. You must pay the full amount and lost <span class="red">5%</span> reputation.',
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
                return { moneyGain: -cost, reputationGain: -5 };
              } else {
                modal.changeModal({
                  title: 'Deal Made!',
                  description: 'You negotiated well. Only half was needed.',
                  options: {
                    footer: { cancelText: 'close', hideConfirm: true },
                  },
                });
                modal.show();
                return { moneyGain: -(cost / 2) };
              }
            },
          },
          {
            text: 'accept',
            variant: 'succes',
            description: `Pay <span class="red">$${cost}</span> and maintain peace.`,
            onClick: () => ({
              moneyGain: -cost,
            }),
          },
          {
            text: 'refuse',
            variant: 'error',
            description:
              'Refuse the strike. You lose <span class="red">15%</span> reputation.',
            onClick: () => ({
              reputationGain: -15,
            }),
          },
        ],
      },
      undefined,
    ];
  },
});

//* Low reputation
export const Lawsuit = new Eventbuilder({
  tier: 6,
  generate(id, tier) {
    let company = buildCompany(tier);
    let settleFee = parseFloat((company.income / 20).toFixed(0));

    return [
      {
        title: `The company <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> is sueing you! Do you fight them in court, or settle?`,
        buttons: [
          {
            text: 'settle',
            variant: 'succes',
            description: `Pay a <span class="red">$${settleFee}</span> settlement fee, but avoid a legal battle.`,
            onClick() {
              return { moneyGain: -settleFee };
            },
          },
          {
            text: 'fight',
            variant: 'error',
            description: `Fight them in court, and risk your reputation with a 40% winning chance.`,
            onClick() {
              const wonCase = chance(40);
              if (wonCase) {
                modal.changeModal({
                  title: 'Case won',
                  description:
                    'You won the case, earning respect from the media and increasing your reputation by <span class="green">12%</span>.',
                  options: {
                    footer: {
                      hideCancel: true,
                      confirmText: 'Okay',
                    },
                  },
                });
              } else {
                modal.changeModal({
                  title: 'Case lost',
                  description:
                    'You lost the case, losing respect from the media and decreasing your reputation by <span class="red">12%</span>.',
                  options: {
                    footer: {
                      hideConfirm: true,
                      cancelText: 'Okay',
                    },
                  },
                });
              }
              modal.show();

              return {
                reputationGain: (wonCase ? 1 : -1) * 12,
              };
            },
          },
          {
            text: 'sign patent',
            variant: 'warning',
            description: `Pay <span class="red">$${
              settleFee / 2
            }</span> and lose <span class="red">6%</span> reputation.`,
            onClick() {
              return {
                moneyGain: -(settleFee / 2),
                reputationGain: -6,
              };
            },
          },
        ],
      },
      company,
    ];
  },
});


