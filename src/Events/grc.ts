import { pickRandom } from '../scripts/main';
import { ModalConfig } from '../scripts/modal';
import { Company } from '../types/main';
import companiesRawData from './companies.json';
import productsRawData from './products.json';
import peopleRawData from './people.json';
let people = peopleRawData as { firstNames: string[]; lastNames: string[] };
let products = [...(productsRawData as string[])];
let companies = [...(companiesRawData as string[])];

export function grc(): string {
  // if (companies.length == 0) return undefined
  let index = Math.floor(Math.random() * companies.length);
  let element = companies[index];
  companies.splice(index, 1);
  return element;
}
export function grp(): string {
  return `${
    people.firstNames[Math.floor(Math.random() * people.firstNames.length)]
  } ${people.lastNames[Math.floor(Math.random() * people.lastNames.length)]}`;
}

/**Tier:
 * `0`: can't be instanciated for companies, functions to indicate that event is "specific" and can only be called using other events.
 * `1-3`: in debt,
 * `4-5`: low income,
 * `6-7`: regular income,
 * `8-9`: multimillion income,
 * `10`: multibillion income
 */
export type Tier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export function formatNumberWithPeriods(num: number): string {
  return (
    num
      .toString()
      .split('')
      .reverse()
      .join('')
      .match(/.{1,3}/g)
      ?.join('.')
      .split('')
      .reverse()
      .join('') || ''
  );
}

export function buildCompany(tier: Tier): Company {
  // Base reputation calculation (1-100)
  let rep = Math.round(Math.random() * 100);
  let companyName = grc();

  // Base company structure
  let company = {
    name: companyName, // Assuming grc() generates company names
    income: 0,
    reputation: Math.min(100, rep), // Cap reputation at 100
    percentOwning: 0,
  };

  // Tier-based income calculation
  switch (true) {
    case tier <= 3: // In debt
      company.income = -parseFloat(
        ((Math.floor(Math.random() * 10000) / 1000) * (4 - tier) * 500).toFixed(
          2
        )
      );
      break;

    case tier <= 5: // Low income ($1K-$50K)
      company.income = parseFloat(
        (Math.floor(Math.random() * 50000) + 1000).toFixed(2)
      );
      break;

    case tier <= 7: // Regular income ($50K-$500K)
      company.income = parseFloat(
        (Math.floor(Math.random() * 450000) + 50000).toFixed(2)
      );
      break;

    case tier <= 9: // Multimillion income ($1M-$20M)
      company.income = parseFloat(
        (Math.floor(Math.random() * 19000000) + 1000000).toFixed(2)
      );
      break;

    case tier === 10: // Multibillion income ($1B-$5B)
      company.income = parseFloat(
        (Math.floor(Math.random() * 4000000000) + 1000000000).toFixed(2)
      );
      break;
  }

  return company;
}

// function owningToStr(o: number) {
//   if (o < 0) {
//     return `You own ${o}% of their company`;
//   }
//   return `They own ${o}% of your company`;
// }
// function reputationToStr(r: number) {
//   switch (true) {
//     case r <= 10: return 'horrible'
//     case r <= 20: return 'bad'
//     case r <= 40: return 'pretty bad'
//     case r <= 60: return 'average'
//     case r <= 80: return 'pretty good'
//     case r <= 90: return 'good'
//     case r <= 100: return 'fabulous'
//   }
// }
export function companyToStr(c: Company) {
  // return `The company is named “${c.name}.”<br>Income (annualy): ${c.income}<br>They have a ${reputationToStr(c.reputation)} reputation of ${c.reputation}%<br>${owningToStr(c.percentOwning)}`
  return `<table class="modal-table">
  <thead class="modal-table-head"><th class="modal-table-th">Key</th><th class="modal-table-th">Value</th></thead>
  <tbody>
    <tr class="modal-table-row">
      <td class="modal-table-cell">Name</td>
      <td class="modal-table-cell">${c.name}</td>
    </tr>
    <tr class="modal-table-row">
      <td class="modal-table-cell">Income</td>
      <td class="modal-table-cell"><span class="${
        c.income > 0 ? 'green' : 'red'
      }">$${formatNumberWithPeriods(c.income)}</span></td>
    </tr>
    <tr class="modal-table-row">
      <td class="modal-table-cell">Reputation</td>
      <td class="modal-table-cell">${c.reputation}%</td>
    </tr>
  </tbody>
</table>`;
}

export type companyTs = { content: Company; modal: ModalConfig };
export let registeredCompanies = 0;
export const companiesTS: Record<string, companyTs> = {};
export function registerCompany(a: Company, b: ModalConfig) {
  companiesTS[`ts${registeredCompanies + 1}`] = {
    content: a,
    modal: b,
  };
  registeredCompanies++;
}

export function getRandomProduct(): string {
  return pickRandom(products);
}
