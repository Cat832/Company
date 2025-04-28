import { ButtonResult, Interaction, InteractionButton } from '../types/main';
import { disabled } from './main';
import { getElement } from './modal';

const desicionManager = {
  textElement: getElement<HTMLSpanElement>('desicion-txt'),
  buttonRow: {
    element: getElement<HTMLDivElement>('desicion-options'),
    buildBtn(btn: InteractionButton): HTMLButtonElement {
      const button = document.createElement('button');
      button.className = `desicion-options-button ${btn.variant}`;
      button.innerHTML = btn.text;
      this.element.appendChild(button);
      return button;
    },
  },
  table: {
    element: getElement<HTMLTableElement>('tradeoff-table'),
    bodyElement: getElement<HTMLTableSectionElement>('tradeoff-body'),
    buildTr(): HTMLTableRowElement {
      const tablerow = document.createElement('tr');
      tablerow.classList.add('table-row');
      this.bodyElement.appendChild(tablerow);
      return tablerow;
    },
    buildTc(row: HTMLTableRowElement): HTMLTableCellElement {
      const cell = document.createElement('td');
      cell.classList.add('table-cell');
      row.appendChild(cell);
      return cell;
    },
    clear() {
      this.bodyElement.innerHTML = '';
    },
  },
  fillTextElement(x: string | Node) {
    if (typeof x == 'string') {
      this.textElement.innerHTML = x
        .replace('<g>', '<span class="green">')
        .replace('<r>', '<span class="red">')
        .replace('</g>', '</span>')
        .replace('</r>', '</span>');
    } else {
      this.textElement.appendChild(x);
    }
  },
  fillTableElement(x: InteractionButton[]) {
    this.table.bodyElement.innerHTML = '';
    x.forEach((btn) => {
      const row = this.table.buildTr();
      const namecell = this.table.buildTc(row);
      const desccell = this.table.buildTc(row);
      namecell.innerHTML = btn.text;
      desccell.innerHTML = btn.description
        .replace('<g>', '<span class="green">')
        .replace('<r>', '<span class="red">')
        .replace('</g>', '</span>')
        .replace('</r>', '</span>');
    });
  },
  fillButtonRowElement(x: InteractionButton[]) {
    this.buttonRow.element.innerHTML = '';
    x.forEach((btn) => {
      let button = this.buttonRow.buildBtn(btn);
      button.addEventListener('click', () => {
        if (!disabled) {
          this.listenFor(btn.onClick());
        }
      });
    });
  },
  fillAll(x: Interaction) {
    this.fillTextElement(x.title);
    this.fillTableElement(x.buttons);
    this.fillButtonRowElement(x.buttons);
  },
  /**Method is called when button is clicked */
  listenFor: (_a: ButtonResult) => {},
};

export default desicionManager;
