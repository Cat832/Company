import {
  deleteWithName,
  growRandom,
  updateIncometable,
  riseRandom,
} from './incomes';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import '../styles/style.css';
import '../styles/colorpicker.css';
import '../styles/table.css';
import setupColorpicker from './colorpicker';
import buildChart from './buildChart';
import Modal, { getElement, ModalConfig } from './modal';
import rawModalData from '../modals.json';
import { companiesTS, formatNumberWithPeriods } from '../Events/grc';
import desicionManager from './desicionmanager';
import '@fortawesome/fontawesome-free/css/all.min.css';
export let disabled = false;
function disableBody() {
  let body = document.querySelector('.everything-wrapper') as HTMLDivElement;
  body.classList.add('disabled');
  disabled = true;
}
function enableBody() {
  let body = document.querySelector('.everything-wrapper') as HTMLDivElement;
  body.classList.remove('disabled');
  disabled = false;
}
let hasWarnedAboutRogue = false;
let hasWarnedAboutDamagedProperties = false;
type ModalDataType = { [key: string]: ModalConfig };
const modalDB = rawModalData as ModalDataType;
Chart.register(...registerables, zoomPlugin, annotationPlugin);
const startingMoney = 10000;
const moneyInt = getElement<HTMLSpanElement>('money-int');
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const progressInt = document.getElementById('progress-int') as HTMLSpanElement;
const incomeList = document.querySelector('.income-list') as HTMLDivElement;
const incomeTable = getElement<HTMLTableSectionElement>('income-table');
function updateIncomelist() {
  console.log(incomeList.firstChild);
  const count = incomeTable.children.length;
  incomeList.style.setProperty('--children-count', count.toString());
}
function losePlayer() {
  window.location.replace('/loss-screen.html');
}
function updateProgress(percent: number) {
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;
  progressBar.style.width = `${percent}%`;
  progressInt.innerText = `${Math.round(percent)}%`;
}
export function getLast<T>(array: T[]) {
  return array[array.length - 1];
}
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
let CompanyChart = buildChart({
  context: document.getElementById('chart') as HTMLCanvasElement,
  values: [startingMoney],
  lineColor: '#00aa00',
  defaultBorderWidth: 2,
});
setupColorpicker({
  onValidInput(input) {
    let ds = CompanyChart.data.datasets[0];
    if (ds) {
      ds.borderColor = `#${input}`;
      CompanyChart.update();
    }
  },
});
function simulateEvent(event: Eventbuilder) {
  let interaction = event.build();
  desicionManager.fillAll(interaction);
}

getElement<HTMLButtonElement>('tier-btn').onclick = () => {
  (
    document.querySelector('.tier-upgrade-msg') as HTMLDivElement
  ).classList.remove('show');
  enableBody();
};
const tierDescriptions: Record<number, string> = {
  2: 'After reaching <span class="green">$20000</span> you need to get ahead of yourself, hire more people and buy more properties. More companies are going to try and bring you down!',
};

export abstract class stats {
  public static propertyBreakchance: 20;
  public static currentTier: number = 1;
  public static yearNumber: number = 0;
  public static properties: Property[] = [];
  private static _transmissions: any[] = [];
  private static _reputation: number = 50;
  private static _economy: number[] = [startingMoney];
  public static upgradeTier() {
    let tierUpgraded = false;
    if (this.money >= 20000) {
      this.currentTier = 2;
      tierUpgraded = true;
    }

    if (tierUpgraded) {
      disableBody();
      let popupMsg = document.querySelector(
        '.tier-upgrade-msg'
      ) as HTMLDivElement;
      popupMsg.classList.add('show');
      getElement<HTMLHeadingElement>(
        'upgrade-txt'
      ).innerHTML = `Upgraded to tier ${this.currentTier}!`;
      getElement<HTMLSpanElement>('upgrade-desc').innerHTML =
        tierDescriptions[this.currentTier];
    }
  }
  public static incomes: Income[] = [
    {
      name: 'Default earnings',
      annual: 400,
      disbandable: true,
      safe: true,
    },
    { name: 'Default expenses', annual: -400 },
  ];
  public get totalProfit() {
    let qr = 0;
    for (const income of stats.incomes) {
      qr += income.annual;
    }
    return qr;
  }
  public static getIndexedTransmission(indexFromEnd: number) {
    return stats._transmissions[
      stats._transmissions.length - (indexFromEnd + 1)
    ];
  }
  public static get lastTransmission() {
    return getLast(stats._transmissions);
  }
  private static salery: number = 0;
  public static get reputation(): number {
    return this._reputation;
  }
  public static updateIncomes() {
    updateIncometable(this.incomes, (nl) => {
      this.incomes = nl;
      this.updateIncomes();
    });
    updateIncomelist();
  }
  public static updateProperties() {
    updatePropertiesTable(
      stats.properties,
      function ({ interactionAtIndex, moneyGain }) {
        stats.money = stats.money + moneyGain;
        spawnCash(moneyInt, moneyGain);
        if (moneyGain < 0) {
          stats.properties[interactionAtIndex].damaged = false;
        } else {
          stats.properties.splice(interactionAtIndex, 1);
        }
        stats.updateProperties();
      }
    );
  }
  public static set reputation(to: number) {
    this._reputation = to;
    updateProgress(this._reputation);
  }
  public static get economy(): number[] {
    return this._economy;
  }
  public static get money() {
    return getLast<number>(this._economy);
  }
  public static set money(to: number) {
    this._economy.push(to);
    let dataset = CompanyChart.data.datasets[0];
    if (dataset) {
      dataset.data = this._economy;
      CompanyChart.data.labels = Array.from(dataset.data, () => '');
      CompanyChart.update();
    }
    if (this.money >= 20000) {
      this.currentTier = 2;
    }
    moneyInt.innerHTML = `Current money: $${formatNumberWithPeriods(
      parseInt(this._economy[this._economy.length - 1].toFixed(0))
    )}`;
  }
  public static simulateRandomEvent() {
    let validChoice = false;
    let index = Math.floor(Math.random() * possibleEvents.length);
    let element = possibleEvents[index];
    while (!validChoice) {
      if (!element.shouldSkip() && element.tier == this.currentTier) {
        validChoice = true;
      } else {
        index = Math.floor(Math.random() * possibleEvents.length);
        element = possibleEvents[index];
      }
      if (element.oneTime) possibleEvents.splice(index, 1);
    }
    simulateEvent(element);
    updateLinks();
  }
  public static simulateSpecificEvent(id: string) {
    let options = possibleEvents.filter((v) => v.id == id);
    if (options.length == 0) {
      console.warn('Event not found, random event triggered instead');
      this.simulateRandomEvent();
    } else {
      if (options.length > 1) {
        console.warn('Multiple events found, first in list triggered');
      }
      simulateEvent(options[0]);
      updateLinks();
    }
  }
  public static addIncome(a: Income) {
    let nameSharers = this.incomes.filter((v) => v.name == a.name);
    if (nameSharers.length == 0) {
      this.incomes.push(a);
    } else {
      nameSharers[0].annual += a.annual;
    }
    this.updateIncomes();
  }
  public static addProperty(a: Property) {
    this.properties.push(a);
    this.updateProperties();
  }
  public static addMoney(num: number) {
    this.salery += num;
  }
  public static simulateYear(id?: string) {
    //Cash in
    let incomeSalery = 0;
    for (const income of this.incomes) {
      if ((income.disbandYearnumber || Infinity) <= this.yearNumber) {
        this.incomes = deleteWithName(income.name, this.incomes);
      } else {
        incomeSalery += income.annual;
      }
    }
    this.salery += incomeSalery;
    let currentMoney = this.money;
    this.money = (currentMoney || 0) + this.salery;
    this.salery = 0;

    for (const income of this.incomes) {
      if (!income.nonDynamic) income.annual = growRandom(income.annual);
      if (income.annual == 0) {
        this.incomes = deleteWithName(income.name, this.incomes);
      }
    }

    (
      document.querySelectorAll('.property') as NodeListOf<HTMLDivElement>
    ).forEach((element, i) => {
      let property = this.properties[i];
      if (property.damaged) return;
      let growValues = property.growVals || [-10, 20];
      if (growValues.every((value) => value === 0)) return;
      let newValue = riseRandom(property.value, growValues[0], growValues[1]);
      spawnCash(element, newValue - property.value);
      property.value = newValue;
    });

    //For incomes
    if (chance(10)) {
      //Find random earnings to go rogue (so that you have to disband 😞)
      let randomPositiveIncome: Income;
      const options: Income[] = [];
      for (const element of this.incomes) {
        if (element.annual > 0 && !element.nonDynamic && !element.safe)
          options.push(element);
      }
      if (options.length > 0) {
        randomPositiveIncome =
          options[Math.floor(Math.random() * options.length)];
        let newAnnual =
          0 - generateLargeMoney(200, randomPositiveIncome.annual, 1);

        if (!hasWarnedAboutRogue) {
          modal.changeModal({
            title: 'Warning!',
            description: `Any type of income can randomly be heavily influenced. In this case “${
              randomPositiveIncome.name
            }” goes from producing <span class="green">$${
              randomPositiveIncome.annual
            }</span> annualy to <b>costing</b> <span class="red">$${Math.abs(
              newAnnual
            )}</span> annualy. Keep good tabs on your incomes, and disband them if neccesary!`,
            options: {
              footer: {
                hideCancel: true,
                confirmText: 'Okay',
              },
            },
          });
          modal.show();
          hasWarnedAboutRogue = true;
        }
        randomPositiveIncome.annual = newAnnual;
      }
    }

    //For properties
    let options = this.properties.filter((v) => !(v.damaged || v.immune));
    if (options.length > 0 && chance(20)) {
      let randomProperty: Property;
      randomProperty = pickRandom(options);

      if (!hasWarnedAboutDamagedProperties) {
        modal.changeModal({
          title: 'Warning!',
          description: `Properties can sometimes break. In this case, your ${randomProperty.name} is damaged, meaning it can't increase in value no more until you repair it at a price of <span class="red">$${randomProperty.onDamagePrice}</span>. Make sure to maintain your properties, becuase this is the last time you will be warned.`,
          options: {
            footer: {
              hideCancel: true,
              confirmText: 'I understand',
            },
          },
        });
        modal.show();
        hasWarnedAboutDamagedProperties = true;
      }

      randomProperty.damaged = true;
    }

    this.updateProperties();
    this.updateIncomes();
    if (this.money <= 0 || this._reputation <= 0) {
      losePlayer();
    }
    if (id !== undefined) {
      this.simulateSpecificEvent(id);
    } else {
      this.simulateRandomEvent();
    }
    this.yearNumber++;
  }
  public static write<T>(a: T) {
    this._transmissions.push(a);
  }
}
stats.updateIncomes();
stats.reputation = 50;

//Modal code!
export const modal = new Modal({});
document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    modal.close();
  }
});
stats.updateProperties();

desicionManager.listenFor = (a) => {
  stats.reputation = stats.reputation + (a.reputationGain || 0);
  stats.addMoney(a.moneyGain || 0);
  stats.simulateYear(a.triggerEvent);
  if (a.propertyGain) {
    stats.addProperty(a.propertyGain);
  }
  if (a.incomeGain) stats.addIncome(a.incomeGain);
};

import { Income, Property } from '../types/main';
import {
  chance,
  Eventbuilder,
  generateLargeMoney,
} from '../Events/eventBuilder';
import {
  Advertisment,
  Dropshipping,
  Hotdogshop,
  PropertyFire,
  TooMuchProducts,
  LawsuitPersonal,
  HarrasmentClaim,
  AbondenedFactory,
  EmployeeDeath,
  Truck,
  Humantrafficking,
} from '../Events/events';
import { updateProperties as updatePropertiesTable } from './properties';
import { spawnCash } from './spawnCashsign';

const possibleEvents: Eventbuilder[] = [
  //Tier 0
  LawsuitPersonal,

  //Tier 1
  PropertyFire,
  Dropshipping,
  Hotdogshop,
  TooMuchProducts,
  Advertisment,
  AbondenedFactory,
  EmployeeDeath,
  Truck,
  Humantrafficking,

  //Tier 2
  HarrasmentClaim,
];

stats.simulateRandomEvent();

function updateLinks() {
  (document.querySelectorAll('.modal-link') as NodeListOf<HTMLElement>).forEach(
    (element) => {
      console.log(element);
      let modalId = element.ariaDescription as string;
      console.log(modalId);
      if (modalId == 'decorative') return;
      if (modalId.startsWith('ts')) {
        let config = companiesTS[modalId];
        if (config) {
          element.addEventListener('click', () => {
            if (disabled) return;
            modal.changeModal(config.modal);
            modal.show();
          });
        }
      } else {
        let config = modalDB[modalId];
        if (config) {
          element.addEventListener('click', () => {
            if (disabled) return;
            modal.changeModal(config);
            modal.show();
          });
        }
      }
    }
  );
}

let admin = false;
document.addEventListener('keydown', (e) => {
  if (e.key == 'o') {
    if (!admin && prompt('password?') !== 'ibseSo!1') return;
    if (!admin) alert('logged in');
    admin = true;
    let command = prompt('Type command') || '';
    switch (true) {
      case command.startsWith('money'):
        try {
          let amount = parseInt(command.split(' ')[1]);
          stats.money = stats.money + amount;
        } catch {
          alert('command did not work');
        }
        break;
      case command.startsWith('upgrade'):
        stats.upgradeTier();
        break;
      case command == 'force tier 2':
        stats.money = stats.money + 20000;
        stats.upgradeTier();
        break;
      default:
        alert('Command not recognized');
    }
  }
});
