import { Income, Property } from '../types/main';
import { modal } from './main';
import { getElement } from './modal';

export const element = getElement<HTMLTableSectionElement>('income-table');

export function deleteWithName(x: string, incomeList: Income[]) {
  let qr = [];
  let list = [...incomeList];
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    element;
    if (element.name !== x) {
      qr.push(element);
    }
  }
  return qr;
}

function propertiesToStr(
  safe: boolean | undefined,
  nonDynamic: boolean | undefined
) {
  if (safe && nonDynamic) {
    return "will not go rogue and can't change.";
  } else if (safe) {
    return 'will not go rogue.';
  } else {
    return "can't change.";
  }
}

export function updateIncometable(
  a: Income[],
  onChange: (nl: Income[]) => void
) {
  let qr: string = '';
  a.forEach((v) => {
    qr += `<tr class="income-table-row ${
      v.disbandable ? 'pointer' : 'non-disbandable'
    }" id="itr-${v.name.replace(' ', '_')}">
        <td colspan="2" class="income-table-cell">${v.name}${
      !v.disbandable ? '🔒' : ''
    }</td>
        <td class="income-table-cell ${v.annual > 0 ? 'profit' : 'noprofit'}">${
      v.annual < 0 ? '-' : ''
    }$${Math.abs(v.annual)}</td>
        </tr>`;
  });
  element.innerHTML = qr;
  a.forEach((v) => {
    if (!v.disbandable) return;
    getElement<HTMLTableRowElement>(
      `itr-${v.name.replace(' ', '_')}`
    ).addEventListener('click', () => {
      modal.changeModal({
        title: 'Disband?',
        description: `You will cancel out this subscription, ${
          v.annual >= 0 ? 'losing' : 'gaining'
        } $${Math.abs(v.annual)} per year${
          v.disbanddescription ? `, and you will ${v.disbanddescription}` : '.'
        }${
          v.nonDynamic || v.safe
            ? `<hr>This income ${propertiesToStr(v.safe, v.nonDynamic)}`
            : ''
        }`,
        options: {
          footer: { confirmText: 'disband' },
        },
        onConfirm() {
          if (v.onDisband) {
            v.onDisband();
          }
          let newList = deleteWithName(v.name, a);
          onChange(newList);
        },
      });
      modal.show();
    });
  });
}

export function growRandom(num: number): number {
  return parseFloat((num * (1 + (Math.random() * 20 - 10) / 100)).toFixed(0));
}

export function riseRandom(num: number, min: number, max: number): number {
  return parseFloat(
    (num * (1 + (Math.random() * (max - min) + min) / 100)).toFixed(0)
  );
}

export function isOriginalInList<T extends Income | Property>(
  x: T,
  list: T[]
): boolean {
  for (const element of list) {
    if (element.name == x.name) {
      return true;
    }
  }
  return false;
}
