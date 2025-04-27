import {
  isOriginalInList,
  deleteWithName,
  growRandom,
  updateIncometable,
} from './incomes';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
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
let hasWarnedAboutRogue = false;
type ModalDataType = { [key: string]: ModalConfig };
const modalDB = rawModalData as ModalDataType;
Chart.register(...registerables, zoomPlugin);
const startingMoney = 25000;
const moneyInt = getElement<HTMLSpanElement>('money-int');
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const progressInt = document.getElementById('progress-int') as HTMLSpanElement;
function updateProgress(percent: number) {
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;
  progressBar.style.width = `${percent}%`;
  progressInt.innerText = `${Math.round(percent)}%`;
}
function getLast<T>(array: T[]) {
  return array[array.length - 1];
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
export abstract class stats {
  public static currentTier: number = 1;
  public static yearNumber: number = 0;
  public static properties: Property[] = [
    {
      name: 'warehouse',
      icon: 'warehouse',
      value: 5000,
      startedAt: 5000,
      onDamagePrice: 13000,
      damaged: true,
    },
  ];
  private static _reputation: number = 50;
  private static _economy: number[] = [startingMoney];
  private static _incomes: Income[] = [
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
    for (const income of stats._incomes) {
      qr += income.annual;
    }
    return qr;
  }
  private static salery: number = 0;
  public static get reputation(): number {
    return this._reputation;
  }
  public static updateIncomes() {
    updateIncometable(this._incomes, (nl) => {
      this._incomes = nl;
      this.updateIncomes();
    });
  }
  public static updateProperties() {
    updateProperties(this.properties, function({deleteAtIndex, moneyGain}) {
      stats.money = stats.money + moneyGain;
      if (deleteAtIndex !== undefined) {
        stats.properties.splice(deleteAtIndex, 1);
        stats.updateProperties();
      }
    });
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
    moneyInt.innerHTML = `Current money: $${formatNumberWithPeriods(
      this._economy[this._economy.length - 1]
    )}`;
  }
  public static simulateRandomEvent() {
    let index = Math.floor(Math.random() * possibleEvents.length);
    let element = possibleEvents[index];
    if (element.oneTime) possibleEvents.splice(index, 1);
    simulateEvent(element);
    updateLinks();
  }
  public static addIncome(a: Income) {
    let isOriginal = false;
    let instance = 0;
    while (!isOriginal) {
      let qorg = isOriginalInList(a, this._incomes);
      if (qorg) {
        instance++;
        a.name = `${a.name.replace(`(${instance - 1})`, '')} (${instance})`;
      } else {
        break;
      }
    }
    this._incomes.push(a);
    this.updateIncomes();
  }
  public static addMoney(num: number) {
    this.salery += num;
  }
  public static simulateYear() {
    //Cash in
    let incomeSalery = 0;
    for (const income of this._incomes) {
      if ((income.disbandYearnumber || Infinity) <= this.yearNumber) {
        this._incomes = deleteWithName(income.name, this._incomes);
      } else {
        incomeSalery += income.annual;
      }
    }
    this.salery += incomeSalery;
    let currentMoney = this.money;
    this.money = (currentMoney || 0) + this.salery;
    this.salery = 0;

    for (const income of this._incomes) {
      if (!income.nonDynamic) income.annual = growRandom(income.annual);
      if (income.annual == 0) {
        this._incomes = deleteWithName(income.name, this._incomes);
      }
    }

    if (chance(10)) {
      //Find random earnings to go rogue (so that you have to disband 😞)
      let randomPositiveIncome: Income;
      const options: Income[] = [];
      for (const element of this._incomes) {
        if (element.annual > 0 && !element.nonDynamic && !element.safe)
          options.push(element);
      }
      if (options.length > 0) {
        randomPositiveIncome =
          options[Math.floor(Math.random() * options.length)];
        let newAnnual = 0 - generateLargeMoney(1, 600, 10);

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

    this.updateIncomes();
    this.simulateRandomEvent();
    this.yearNumber++;
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

desicionManager.listenFor = (a) => {
  stats.reputation = stats.reputation + (a.reputationGain || 0);
  stats.addMoney(a.moneyGain || 0);
  stats.simulateYear();
  if (a.incomeGain) stats.addIncome(a.incomeGain);
};

import { Income, Property } from '../types/main';
import {
  chance,
  Eventbuilder,
  generateLargeMoney,
} from '../Events/eventBuilder';
import { StarterEvent } from '../Events/events';
import { updateProperties } from './properties';

const possibleEvents: Eventbuilder[] = [StarterEvent];

stats.simulateRandomEvent();

function updateLinks() {
  (
    document.querySelectorAll('.modal-link') as NodeListOf<HTMLSpanElement>
  ).forEach((element) => {
    console.log(element);
    let modalId = element.ariaDescription as string;
    console.log(modalId);
    if (modalId == 'decorative') return;
    if (modalId.startsWith('ts')) {
      let config = companiesTS[modalId];
      if (config) {
        element.addEventListener('click', () => {
          modal.changeModal(config.modal);
          modal.show();
        });
      }
    } else {
      let config = modalDB[modalId];
      if (config) {
        element.addEventListener('click', () => {
          modal.changeModal(config);
          modal.show();
        });
      }
    }
  });
}
