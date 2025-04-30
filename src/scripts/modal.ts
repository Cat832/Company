import { disabled, getLast } from "./main";

export interface ModalOptions {
  footer?: {
    hideCancel?: boolean;
    hideConfirm?: boolean;
    cancelText?: string;
    confirmText?: string;
  };
}

export interface ModalConfig {
  onConfirm?(): void;
  title?: string;
  description?: string;
  options?: ModalOptions;
}
export function getElement<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}
export function getElementWithClass<T extends HTMLElement>(className: string): T {
  return document.querySelector(`.${className}`) as T;
}
const getDiv = (id: string) => getElement<HTMLDivElement>(id);

export default class Modal {
  private static element = getDiv('modal');
  private static footerElement = getDiv('modal-footer');
  private static titleElement = getElement<HTMLHeadingElement>('modal-title');
  private static textElement = getElement<HTMLSpanElement>('modal-text');
  private static cancelElement = getElement<HTMLButtonElement>('cancel-btn');
  private static confirmElement = getElement<HTMLButtonElement>('confirm-btn');

  private z_title: string;
  private z_description: string;
  options: ModalOptions;
  visible: boolean;
  onConfirm: () => void;
  que: ModalConfig[];

  constructor({ onConfirm, title, description, options }: ModalConfig) {
    this.que = [];
    this.z_title = title || "Title didn't load.";
    this.z_description = description || "Description didn't load.";
    this.options = typeof options == 'undefined' ? {} : options;
    Modal.titleElement.innerText = this.z_title;
    Modal.textElement.innerHTML = this.z_description;
    this.visible = false;
    this.onConfirm = () => {
      if (onConfirm) onConfirm();
      this.close();
    };

    const closeBtn = document.getElementById(
      'modal-close'
    ) as HTMLButtonElement;

    closeBtn.addEventListener('click', () => this.close());
    Modal.confirmElement.addEventListener('click', () => this.onConfirm());
    Modal.cancelElement.addEventListener('click', () => this.close());
  }

  update() {
    if (this.options.footer?.hideCancel) {
      Modal.cancelElement.style.display = 'none';
    } else {
      Modal.cancelElement.style.display = 'block';
      Modal.cancelElement.innerText =
        this.options.footer?.cancelText || 'cancel';
    }

    if (this.options.footer?.hideConfirm) {
      Modal.confirmElement.style.display = 'none';
    } else {
      Modal.confirmElement.style.display = 'block';
      Modal.confirmElement.innerText =
        this.options.footer?.confirmText || 'confirm';
    }

    Modal.footerElement.style.display =
      this.options.footer?.hideCancel && this.options.footer?.hideConfirm
        ? 'none'
        : 'flex';
  }

  show() {
    if (disabled) return;
    this.visible = true;
    if (Modal.element.classList.contains('show')) return;
    Modal.element.classList.add('show');
  }

  close() {
    if (this.que.length == 0) {
      this.visible = false;
      if (!Modal.element.classList.contains('show')) return;
      Modal.element.classList.remove('show');
    } else {
      this.forceChange(getLast(this.que));
      this.que.splice(this.que.length - 1, 1);
    }
  }

  toggleVisibility() {
    if (this.visible) this.close();
    else this.show();
  }

  forceChange({ onConfirm, title, description, options }: ModalConfig) {
    this.title = title || "Title didn't load.";
    this.description = description || "Description didn't load";
    this.onConfirm = () => {
      if (onConfirm) onConfirm();
      this.close();
    };
    this.options = typeof options == 'undefined' ? {} : options;
    this.update();
  }

  changeModal(config: ModalConfig) {
    if (this.visible) {
      this.que.push(config);
    } else {
      this.forceChange(config);
    }
  }

  get title() {
    return this.z_title;
  }
  set title(to: string) {
    this.z_title = to;
    Modal.titleElement.innerText = to;
  }

  get description() {
    return this.z_description;
  }
  set description(to: string) {
    this.z_description = to;
    Modal.textElement.innerHTML = to;
  }
}
