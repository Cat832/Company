import { modal, pickRandom, stats } from '../scripts/main';
import { Company } from '../types/main';
import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
import { buildCompany, getRandomProduct, grc, grp } from './grc';

//========================================TIER 0====================================================
/**Parameters:
 * @param firstWrite lawsuit value: `number`
 * @param secondWrite person name: `string`
 */
export const LawsuitPersonal = new Eventbuilder({
  id: 'lawsuitpersonal',
  tier: 0,
  generate(_id) {
    let person = stats.lastTransmission as string;
    let amount = stats.getIndexedTransmission(1) as number;
    return [
      {
        title: `&#9878;&#65039; ${person} is sueing you! They want to settle for <r>$${amount}</r>.`,
        buttons: [
          {
            text: 'settle',
            description: `Pay <r>$${amount}</r> and just get this over with.`,
            variant: 'succes',
            onClick() {
              return { moneyGain: -amount };
            },
          },
          {
            text: 'fight',
            description: `Fight a legal battle, and risk your reputation.`,
            variant: 'error',
            onClick() {
              let caseWon = chance(50);
              modal.changeModal({
                title: `Case ${caseWon ? 'won' : 'lost'}`,
                description: caseWon
                  ? "You won the case, and didn't lose anything."
                  : `Not only did you lose <span class="red">$${amount}</span>, you also lost 10% reputation.`,
                options: {
                  footer: {
                    hideConfirm: true,
                    cancelText: 'okay',
                  },
                },
              });
              modal.show();
              return {
                moneyGain: caseWon ? 0 : -amount,
                reputationGain: caseWon ? 0 : -15,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});
/**Parameters:
 * @param write waterPrice: `number`
 */
export const DirtyWaterFollowup = new Eventbuilder({
  id: 'dirtywaterfollowup',
  tier: 0,
  generate(_id) {
    waterIsFixed = true;
    let waterPrice = (stats.lastTransmission as number) * 1.5;
    return [
      {
        title: `😡 The media found out about your little water secret and wants you to pay <r>$${waterPrice}</r>.`,
        buttons: [
          {
            text: 'pay up',
            description: `Pay <r>$${waterPrice}</r> for poisoning your water.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -waterPrice,
              };
            },
          },
          {
            text: 'deny',
            description: `Deny everything and lose <r>7%</r> reputation.`,
            variant: 'error',
            onClick() {
              return {
                reputationGain: -7,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});
/**No parameters*/
export const DataScandal = new Eventbuilder({
  tier: 0,
  id: 'datascandal',
  generate(_id) {
    let settlePrice = generateLargeMoney(2, 6, 900);
    return [
      {
        title: `😡 People found out that the leaked data is real, and your reputation is shattered. What do you do?`,
        buttons: [
          {
            text: 'settle',
            variant: 'succes',
            description: `Pay <r>$${settlePrice}</r> and lose <span class="red">8%</g> reputation.`,
            onClick() {
              return {
                moneyGain: -settlePrice,
                reputationGain: -8,
              };
            },
          },
          {
            text: 'leave as is',
            description: `Lose <r>16%</r> reputation.`,
            variant: 'error',
            onClick() {
              return {
                reputationGain: -16,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

//========================================TIER 1====================================================
export const PropertyFire = new Eventbuilder({
  tier: 1,
  id: 'propertyfire',
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
  id: 'hotdogshop',
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
            description: `Buy <span class="blue modal-link" aria-description="${id}">“${stand.name}”</span> for <r>$${price}</r>.`,
            onClick() {
              return {
                moneyGain: -price,
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
  id: 'dropshipping',
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
        )}</r> annually for 3 years to clean up this mess. `,
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
  oneTime: true,
  id: 'toomuchproducts',
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
              productPrice * 1.5
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
                  growVals: [6, 12],
                  sector: 'industry',
                  hideNameInModal: true,
                  prependInModal: 'Sell products',
                  sellDescription: `Note that you bought this warehouse for <span class="green">$${
                    productPrice * 1.5
                  }</span>.`,
                },
                moneyGain: -(productPrice * 1.5),
              };
            },
          },
          {
            text: 'sell now',
            variant: 'error',
            description: `Sell the products now for <g>$${
              productPrice / 4
            }</g>`,
            onClick() {
              return {
                moneyGain: productPrice / 4,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const Advertisment = new Eventbuilder({
  tier: 1,
  id: 'advertisment',
  oneTime: true,
  generate(id) {
    let company = buildCompany(4);
    let coffeePrice = generateLargeMoney(3, 6, 500);
    return [
      {
        title: `📰 Your media team decides that it's time to get advertisement. You can advertise in coffee shops, or on more effective billboards. Be warned: <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> already has advirtisement on these billboards. <div style="display: inline; transform: scale(0.7); font-size: 0.7em;" class="info-btn-wrapper modal-link" aria-description="12"><i style="tranform: scale(0.8) !important" class="fas fa-info-circle info-btn"></i></div>  `,
        buttons: [
          {
            text: 'Buy in coffeeshops',
            description: `Pay <r>$${coffeePrice}</r> for around <g>$${
              coffeePrice / 10
            }</g> annually.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -coffeePrice,
                incomeGain: {
                  name: 'Advertisment in coffeshops',
                  annual: coffeePrice / 10,
                  disbandable: true,
                },
              };
            },
          },
          {
            text: 'Buy in billboards',
            description: `Pay <r>$${
              coffeePrice * 1.5
            }</r> for a chance (click the info button for more info) that “${
              company.name
            }” will let you advertise on their billboards (that make around <g>$${
              coffeePrice / 5
            }</g> annually).`,
            variant: 'warning',
            onClick() {
              let gotPermission = chance(company.reputation);
              modal.changeModal({
                title: `Permission ${gotPermission ? 'granted' : 'denied'}.`,
                description:
                  `You now have paid <span class="red">$${
                    coffeePrice * 1.5
                  }</span> ` +
                  (gotPermission
                    ? `for an extra income of around <span class="green">$${
                        coffeePrice / 5
                      }</span> annually.`
                    : `for nothing.`),
                options: {
                  footer: {
                    hideCancel: gotPermission,
                    hideConfirm: !gotPermission,
                    cancelText: 'okay',
                    confirmText: 'okay',
                  },
                },
              });
              modal.show();
              return {
                incomeGain: gotPermission
                  ? {
                      name: 'Advertisment on billboards',
                      annual: coffeePrice / 5,
                      disbandable: true,
                    }
                  : undefined,
                moneyGain: -(coffeePrice * 1.5),
              };
            },
          },
          {
            text: 'Decline advertisment',
            description: `Lose around <r>$${
              coffeePrice / 40
            }</r> each year due to missing out on advertisment.`,
            variant: 'error',
            onClick() {
              return {
                incomeGain: {
                  name: 'Missing out on advertisment',
                  annual: -(coffeePrice / 40),
                  disbandable: true,
                  disbanddescription: `have to pay <span class="red">$${
                    coffeePrice / 2
                  }</span>.`,
                  onDisband() {
                    stats.money = stats.money - coffeePrice / 2;
                  },
                },
              };
            },
          },
        ],
      },
      company,
    ];
  },
});

export const AbondenedFactory = new Eventbuilder({
  tier: 1,
  oneTime: true,
  id: 'abondenedfactory',
  generate(_id) {
    let value = generateLargeMoney(3, 6, 600);
    let repairCosts = generateLargeMoney(5, 8, 500) / 2;

    return [
      {
        title: `🏭 An abondened factory is found in the woods. Do you keep it, knowing it will cost <r>$${repairCosts}</r> to repair, or do you want to sell it immediately?`,
        buttons: [
          {
            text: 'sell it',
            description: `Sell the property and gain <g>$${value / 2}</g>`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: value / 2,
              };
            },
          },
          {
            text: 'keep it',
            description: `Keep the property, but it starts out damaged.`,
            variant: 'info',
            onClick() {
              return {
                propertyGain: {
                  name: 'factory',
                  icon: 'industry',
                  onDamagePrice: repairCosts,
                  startedAt: value,
                  value: value,
                  growVals: [3, 10],
                  sector: 'industry',
                  damaged: true,
                },
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const EmployeeDeath = new Eventbuilder({
  tier: 1,
  oneTime: true,
  id: 'employeedeath',
  generate(_id) {
    let employeeName = grp();
    let funeralPrice = generateLargeMoney(0, 5, 1600);
    return [
      {
        title: `⚰\uFE0F Your employee, “${employeeName}”, has died of terminal cancer. Do you want to pay for the funeral? This will cost <r>$${funeralPrice}</r>`,
        buttons: [
          {
            text: 'accept',
            variant: 'succes',
            description: `Pay <r>$${funeralPrice}</r> for a <g>10%</g> reputation boost.`,
            onClick() {
              return {
                moneyGain: -funeralPrice,
                reputationGain: 10,
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Let the family pay the funeral.',
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

export const Humantrafficking = new Eventbuilder({
  tier: 1,
  oneTime: true,
  id: 'humantrafficking',
  generate(id) {
    let company: Company = {
      name: grc(),
      income: parseFloat((Math.floor(Math.random() * 30000) + 1000).toFixed(2)),
      reputation: generateLargeMoney(5, 20, 1),
    };
    let payment = parseFloat((company.income / 5).toFixed(0));
    return [
      {
        title: `🚨 You catch <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> on acts of human trafficking. They will pay you <g>$${payment}</g> for you to not report them.`,
        buttons: [
          {
            text: 'report',
            variant: 'succes',
            description: `Report ${company.name} to authorities and gain a <g>7%</g> reputation boost.`,
            onClick() {
              return {
                reputationGain: 7,
              };
            },
          },
          {
            text: "don't report",
            variant: 'error',
            description: `Gain <g>$${payment}</g> for not snitching.`,
            onClick() {
              return {
                moneyGain: payment,
              };
            },
          },
        ],
      },
      company,
    ];
  },
});

let waterIsFixed = false;
export const DirtyWater = new Eventbuilder({
  tier: 1,
  id: 'dirtywater',
  shouldSkip: () => waterIsFixed,
  generate(_id) {
    let waterFilterPrice = generateLargeMoney(3, 5, 700);
    return [
      {
        title:
          '🌊 There are traces of methane and lead found in the water what you produce. Do you cover this scandal up or take responsability?',
        buttons: [
          {
            text: 'take responsability',
            description: `Take responsability like an adult and improve your water filters for <r>$${waterFilterPrice}</r>.`,
            variant: 'succes',
            onClick() {
              waterIsFixed = true;
              return {
                moneyGain: -waterFilterPrice,
              };
            },
          },
          {
            text: 'cover up',
            variant: 'error',
            description:
              'Cover the scandal, but risk that the media finds out.',
            onClick() {
              if (chance(20)) {
                stats.write(waterFilterPrice);
                return { triggerEvent: 'dirtywaterfollowup' };
              }
              return {};
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const OfficeParty = new Eventbuilder({
  tier: 1,
  id: 'officeparty',
  oneTime: true,
  generate(_id) {
    let partyCost = generateLargeMoney(2, 5, 800);
    return [
      {
        title: `🎉 Your employees are asking for an office party. It would cost <r>$${partyCost}</r> but could boost morale.`,
        buttons: [
          {
            text: 'Throw party',
            description: `Pay <r>$${partyCost}</r> for a <g>5%</g> reputation boost.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -partyCost,
                reputationGain: 5,
              };
            },
          },
          {
            text: 'Decline',
            description: 'Lose <r>3%</r> reputation for being stingy.',
            variant: 'error',
            onClick() {
              return {
                reputationGain: -3,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const TechStartup = new Eventbuilder({
  tier: 1,
  id: 'techstartup',
  oneTime: true,
  generate(id) {
    let startup: Company = {
      name: `${grc()} Technologies`,
      income: generateLargeMoney(4, 8, 200),
      reputation: 85,
    };
    let investment = generateLargeMoney(3, 6, 1000);
    return [
      {
        title: `💻 A tech startup called <span class="blue modal-link" aria-description="${id}">"${startup.name}"</span> is looking for investors. They're asking for <r>$${investment}</r>.`,
        buttons: [
          {
            text: 'Invest',
            description: `Invest <r>$${investment}</r> for potential annual returns.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -investment,
                incomeGain: {
                  name: `Investment in ${startup.name}`,
                  annual: startup.income / 4,
                  disbandable: true,
                },
              };
            },
          },
          {
            text: 'Decline',
            description: 'Miss out on this investment opportunity.',
            variant: 'error',
            onClick() {
              return {};
            },
          },
        ],
      },
      startup,
    ];
  },
});

export const UnionDemands = new Eventbuilder({
  tier: 1,
  id: 'uniondemands',
  shouldSkip: () => chance(70),
  generate(_id) {
    let raiseAmount = generateLargeMoney(0, 8, 250);
    return [
      {
        title: `✊ Your workers are unionizing and demanding higher wages. They want an annual increase of <r>$${raiseAmount}</r> to your expenses.`,
        buttons: [
          {
            text: 'Accept demands',
            description: `Increase expenses by <r>$${raiseAmount}</r> but gain <g>8%</g> reputation.`,
            variant: 'succes',
            onClick() {
              stats.incomes[1].annual -= raiseAmount;
              stats.updateIncomes();
              return {
                reputationGain: 8,
              };
            },
          },
          {
            text: 'Refuse',
            description: 'Lose <r>10%</r> reputation and risk strikes.',
            variant: 'error',
            onClick() {
              if (chance(30)) {
                return {
                  reputationGain: -10,
                  incomeGain: {
                    name: 'Strike losses',
                    annual: -raiseAmount * 2,
                    disbandable: true,
                    disbandYearnumber: stats.yearNumber + 2,
                  },
                };
              }
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

export const CharityDonation = new Eventbuilder({
  tier: 1,
  id: 'charitydonation',
  oneTime: true,
  generate(_id) {
    let charityAmount = generateLargeMoney(1, 4, 1000);
    return [
      {
        title: `❤️ A local charity is raising funds to help families in need. They ask if you'd like to donate <r>$${charityAmount}</r>.`,
        buttons: [
          {
            text: 'donate generously',
            description: `Pay <r>$${charityAmount}</r> and gain <g>12%</g> reputation.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -charityAmount,
                reputationGain: 12,
              };
            },
          },
          {
            text: 'small donation',
            description: `Pay <r>$${
              charityAmount / 2
            }</r> and gain <g>6%</g> reputation.`,
            variant: 'warning',
            onClick() {
              return {
                moneyGain: -(charityAmount / 2),
                reputationGain: 6,
              };
            },
          },
          {
            text: 'decline politely',
            description: 'No cost, but miss out on goodwill.',
            variant: 'error',
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

export const EmployeeInnovation = new Eventbuilder({
  tier: 1,
  oneTime: true,
  id: 'employeeinnovation',
  generate(_id) {
    let employeeName = grp();
    let bonusCost = generateLargeMoney(1, 3, 500);
    let incomeGain = generateLargeMoney(0, 5, 300);
    return [
      {
        title: `💡 Your employee, <span class="blue">${employeeName}</span>, developed an efficiency improvement that could save money! They humbly ask for a <r>$${bonusCost}</r> bonus.`,
        buttons: [
          {
            text: 'reward them',
            description: `Pay <r>$${bonusCost}</r> and gain <g>$${incomeGain}</g> annually from their idea.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -bonusCost,
                incomeGain: {
                  name: `${employeeName}'s innovation`,
                  annual: incomeGain,
                  disbandable: true,
                },
                reputationGain: 5,
              };
            },
          },
          {
            text: 'acknowledge lightly',
            description: `Pay <r>$${bonusCost / 2}</r> and gain <g>$${
              incomeGain / 2
            }</g> annually.`,
            variant: 'warning',
            onClick() {
              return {
                moneyGain: -(bonusCost / 2),
                incomeGain: {
                  name: `${employeeName}'s minor improvement`,
                  annual: incomeGain / 2,
                  disbandable: true,
                },
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const CommunityGarden = new Eventbuilder({
  tier: 1,
  id: 'communitygarden',
  oneTime: true,
  generate(_id) {
    let gardenCost = generateLargeMoney(2, 5, 800);
    return [
      {
        title: `🌱 The neighborhood wants to start a community garden on unused land you own. They ask for <r>$${gardenCost}</r> to help fund it.`,
        buttons: [
          {
            text: 'fund fully',
            description: `Pay <r>$${gardenCost}</r> and gain <g>15%</g> reputation.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -gardenCost,
                reputationGain: 15,
                propertyGain: {
                  name: 'community garden',
                  icon: 'tree',
                  sector: 'economy',
                  immune: true,
                  onDamagePrice: 0,
                  startedAt: gardenCost,
                  value: gardenCost,
                  growVals: [1, 3],
                  sellDescription:
                    'Selling would anger the community (-10% reputation).',
                  onSell() {
                    stats.reputation -= 10;
                  },
                },
              };
            },
          },
          {
            text: 'donate land only',
            description: `No cost, but gain <g>8%</g> reputation.`,
            variant: 'warning',
            onClick() {
              return {
                reputationGain: 8,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const LostWallet = new Eventbuilder({
  tier: 1,
  id: 'lostwallet',
  generate(_id) {
    let reward = generateLargeMoney(0, 5, 200); // Small cash reward (e.g., $200–$800)
    return [
      {
        title: `💵 You find a lost wallet on the street. Do you return it to the owner?`,
        buttons: [
          {
            text: 'return it',
            description: `Gain <g>$${reward}</g> as a thank-you and <g>3%</g> reputation.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: reward,
                reputationGain: 3,
              };
            },
          },
          {
            text: 'keep the cash',
            description: `Take <g>$${reward * 1.5}</g>.`,
            variant: 'error',
            onClick() {
              return {
                moneyGain: reward * 1.5,
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const StrayDog = new Eventbuilder({
  tier: 1,
  id: 'straydog',
  generate(_id) {
    return [
      {
        title: `🐶 A stray dog finds its way in the office and some people are getting attached to it. If you don't euthanise it, it will bring down company efficiency.`,
        buttons: [
          {
            text: 'put him down',
            description: `Lose <r>6%</r> reputation due to you being a dog killer.`,
            variant: 'succes',
            onClick() {
              return {
                reputationGain: -6,
              };
            },
          },
          {
            text: 'keep him',
            description: `You will lose <r>$150</r> per year due to employee inefficiency.`,
            variant: 'error',
            onClick() {
              stats.incomes[1].annual += 150;
              stats.updateIncomes();
              return {};
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const VendingMachine = new Eventbuilder({
  tier: 1,
  id: 'vendingmachine',
  oneTime: true,
  generate(id) {
    let company: Company = {
      name: 'DGA vending',
      income: 12983456,
      reputation: 85,
    };

    let produceValue = generateLargeMoney(0, 60, 10);

    return [
      {
        title: `🎁 A vending machine company called <span class="blue modal-link" aria-description="${id}">“${company.name}”</span> wants to give you a vending machine!`,
        buttons: [
          {
            text: 'accept gift',
            description: 'Accept the gift and get a vending machine.',
            variant: 'succes',
            onClick: () => {
              return {
                propertyGain: {
                  name: 'vending machine',
                  icon: 'store',
                  onDamagePrice: 60,
                  sector: 'economy',
                  startedAt: produceValue,
                  value: produceValue,
                  growVals: [6, 10],
                },
              };
            },
          },
          {
            text: 'decline',
            variant: 'error',
            description: 'Refuse the gift.',
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

let leakFixed = false;
export const DataLeak = new Eventbuilder({
  tier: 1,
  id: 'dataleak',
  shouldSkip: () => leakFixed,
  generate(_id) {
    let dataLeakPrice = generateLargeMoney(0, 5, 600);

    return [
      {
        title: `📊 Your data is being leaked! Hire a cyberteam or cover it up.`,
        buttons: [
          {
            text: 'hire cyberteam',
            description: `Pay <r>$${dataLeakPrice}</r> to fix the leak.`,
            variant: 'succes',
            onClick() {
              leakFixed = true;
              return {
                moneyGain: -dataLeakPrice,
              };
            },
          },
          {
            text: 'cover up',
            description: 'Deny everything but risk a scandal.',
            variant: 'error',
            onClick() {
              if (chance(50)) {
                return {
                  triggerEvent: 'datascandal',
                };
              }
              return {};
            },
          },
        ],
      },
      undefined,
    ];
  },
});

const incomeGains = [
  { name: 'factory', emoji: '🏭' },
  { name: 'farm', emoji: '🚜' },
  { name: 'lumber yard', emoji: '🪵' },
  { name: 'orchard', emoji: '🌳' },
  { name: 'bakery', emoji: '🥖' },
  { name: 'supermarket', emoji: '🏪' },
  { name: 'mine', emoji: '⛏\uFE0F' },
  { name: 'pumpjack', emoji: '🛢\uFE0F' },
  { name: 'power plant', emoji: '🔌' },
  { name: 'gas pump', emoji: '⛽' },
];

export const CEOSellsThing = new Eventbuilder({
  tier: 1,
  id: 'ceosellsthing',
  generate(id) {
    let ceoName = grp();
    let company = buildCompany(6);
    let object = pickRandom(incomeGains);
    let price = generateLargeMoney(2, 6, 120);
    let income = generateLargeMoney(1, 4, 385);
    return [
      {
        title: `${object.emoji} <span class="blue">${ceoName}</span>, the CEO of <span class="blue modal-link" aria-description="${id}">“${company.name}”</span>, is allowing shared custody of one of their ${object.name}s for <r>$${price}</r>.`,
        buttons: [
          {
            text: 'pay',
            description: `Pay <r>$${price}</r> for <g>$${income}</g> per year.`,
            variant: 'succes',
            onClick() {
              return {
                moneyGain: -price,
                incomeGain: {
                  name: `${ceoName}'s ${object.name}`,
                  annual: income,
                },
              };
            },
          },
          {
            text: 'refuse',
            variant: 'error',
            description: 'decline the offer',
            onClick() {
              return {};
            },
          },
        ],
      },
      company,
    ];
  },
});

//==============================================TIER 2=========================================================
export const HarrasmentClaim = new Eventbuilder({
  tier: 2,
  id: 'harassmentclaim',
  generate(_id) {
    let person = grp();
    let harasser = grp();
    let priceFire = generateLargeMoney(2, 6, 200);
    let lawsuitPrice = generateLargeMoney(4, 10, 700);
    return [
      {
        title: `🤕 <span class="blue">${person}</span> claims they are being harassed by one of your employees; <span class="blue">${harasser}</span>. They want you to fire them.`,
        buttons: [
          {
            text: `fire`,
            description: `Fire ${harasser}, increasing your default expenses by <r>$${priceFire}</r>.`,
            variant: 'succes',
            onClick() {
              stats.incomes[1].annual -= priceFire;
              stats.updateIncomes();
              return {};
            },
          },
          {
            text: `demote`,
            description:
              'Lose no money, but <r>6%</r> reputation for letting a harasser work in your company.',
            variant: 'warning',
            onClick() {
              return {
                reputationGain: -6,
              };
            },
          },
          {
            text: 'do nothing',
            description: `Do nothing and risk a lawsuit`,
            variant: 'error',
            onClick() {
              stats.write(lawsuitPrice);
              stats.write(person);
              return {
                triggerEvent: 'lawsuitpersonal',
              };
            },
          },
        ],
      },
      undefined,
    ];
  },
});

export const Truck = new Eventbuilder({
  tier: 2,
  id: 'truck',
  shouldSkip() {
    let options = stats.incomes.filter(
      (v) => v.name.split(' ')[0] == 'Dropshipping'
    );
    return options.length == 0;
  },
  generate(_id) {
    let options = stats.incomes.filter(
      (v) => v.name.split(' ')[0] == 'Dropshipping'
    );
    let increaseAmount = generateLargeMoney(4, 11, 15);
    let truckPrice = increaseAmount * 120;
    return [
      {
        title: `🚛 To support your dropshipping you can buy your own truck for <r>$${truckPrice}</r>.`,
        buttons: [
          {
            text: 'buy truck',
            description: `increase all dropshipping income with <g>$${increaseAmount}</g> and get a truck.`,
            variant: 'succes',
            onClick() {
              options.forEach((element) => {
                element.annual += increaseAmount;
              });
              return {
                moneyGain: -truckPrice,
                propertyGain: {
                  name: 'truck',
                  icon: 'truck',
                  sector: 'service',
                  immune: true,
                  onDamagePrice: 0,
                  startedAt: truckPrice,
                  value: truckPrice,
                  growVals: [0, 0],
                  onSell() {
                    let updatedOptions = stats.incomes.filter(
                      (v) => v.name.split(' ')[0] == 'Dropshipping'
                    );
                    updatedOptions.forEach((v) => {
                      v.annual -= increaseAmount;
                    });
                  },
                  sellDescription: 'All dropshipping income will be decreased.',
                },
              };
            },
          },
          {
            text: 'do nothing',
            description: 'Nothing happens.',
            variant: 'error',
            onClick: () => {
              return {};
            },
          },
        ],
      },
      undefined,
    ];
  },
});
