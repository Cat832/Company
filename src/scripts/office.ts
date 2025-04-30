import { getElement } from './modal';
// type span = HTMLSpanElement;
type div = HTMLDivElement;
type button = HTMLButtonElement;
export function createElement<T extends HTMLElement>(
  query: string,
  children: HTMLElement[] | string = []
): T {
  let keys = query.split('.');
  let elementName = keys.splice(0, 1)[0];
  let element = document.createElement(elementName) as T;
  keys.forEach((v) => element.classList.add(v));
  if (typeof children == 'object') {
    children.forEach((v) => element.appendChild(v));
  } else {
    element.innerHTML = children;
  }
  return element;
}
const div = (q: string, children: HTMLElement[] = []) =>
  createElement<div>(`div.${q}`, children);

let dialog = getElement<HTMLDialogElement>('offices-modal');
let officeBox = getElement<div>('offices-box');
type Office = {
  name: string;
};

function fillTopElement(
  top: div,
  name: string,
  onNameChange: (newName: string) => void
) {
  top.innerHTML = '';
  top.appendChild(createElement<HTMLSpanElement>('span.office-name', name));
  let editBtn = createElement<button>('button.office-edit-btn', [
    createElement<HTMLElement>('i.fas.fa-edit.edit-btn-icon'),
  ]);
  top.appendChild(editBtn);
  editBtn.addEventListener('click', () => {
    top.innerHTML = '';
    let nameInput = createElement<HTMLInputElement>('input.office-name-input');
    nameInput.value = name;
    top.appendChild(nameInput);
    nameInput.focus();
    const trigger = (ev: FocusEvent | KeyboardEvent) => {
      let target = ev.currentTarget as HTMLInputElement;
      if (target.value != '') onNameChange(target.value);
      fillTopElement(
        top,
        target.value == '' ? name : target.value,
        onNameChange
      );
    };

    nameInput.addEventListener('keypress', (ev) => {
      if (ev.key == 'Enter') {
        trigger(ev);
      }
    });
    nameInput.addEventListener('focusout', trigger);
  });
}

function createOffice(from: Office): HTMLElement {
  let top = div('office-top');
  fillTopElement(top, from.name, (n) => {
    from.name = n;
  });
  let bottom = div('office-bottom');
  let element = div('office', [top, bottom]);
  return element;
}

const offices = {
  update(list: Office[]) {
    list.forEach((office) => {
      let element = createOffice(office);
      officeBox.appendChild(element);
    });
  },
  show() {
    dialog.showModal();
  },
  close() {
    dialog.classList.add('hideanimation');
    setTimeout(() => {
      dialog.classList.remove('hideanimation');
      dialog.close();
    }, 600);
  },

  register() {
    let button = getElement<button>('debug');
    let closeBtn = getElement<button>('offices-close');
    button.onclick = this.show;
    closeBtn.onclick = this.close;
  },
};

offices.register();
offices.update([
  {
    name: 'Headquarters',
  },
]);
