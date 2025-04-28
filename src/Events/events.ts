import { modal, pickRandom, stats } from '../scripts/main';
import { Company } from '../types/main';
import { chance, Eventbuilder, generateLargeMoney } from './eventBuilder';
import { buildCompany, getRandomProduct, grc, grp } from './grc';

//========================================TIER 0====================================================
/**Parameters:
 * @param firstWrite lawsuit value: number
 * @param secondWrite person name: string
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
                    productPrice * 2
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

export const Truck = new Eventbuilder({
  tier: 1,
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

export const Humantrafficking = new Eventbuilder({
  tier: 1,
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
        title: `🤕 “${person}” claims they are being harassed by one of your employees; “${harasser}”. They want you to fire them.`,
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