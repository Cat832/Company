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

export function getElement<T>(id: string): T {
  return document.getElementById(id) as T;
}

export default class Modal {
  private static element = getElement<HTMLDivElement>('modal');
  private static footerElement: HTMLDivElement = document.getElementById(
    'modal-footer'
  ) as HTMLDivElement;
  private static titleElement: HTMLHeadingElement = document.getElementById(
    'modal-title'
  ) as HTMLHeadingElement;
  private static textElement: HTMLSpanElement = document.getElementById(
    'modal-text'
  ) as HTMLSpanElement;
  private static cancelElement = getElement<HTMLButtonElement>('cancel-btn');
  private static confirmElement = getElement<HTMLButtonElement>('confirm-btn');

  z_title: string;
  z_description: string;
  options: ModalOptions;
  visible: boolean;
  onConfirm: () => void;

  constructor({ onConfirm, title, description, options }: ModalConfig) {
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
    this.visible = true;
    if (Modal.element.classList.contains('show')) return;
    Modal.element.classList.add('show');
  }

  close() {
    this.visible = false;
    if (!Modal.element.classList.contains('show')) return;
    Modal.element.classList.remove('show');
  }

  toggleVisibility() {
    if (this.visible) this.close();
    else this.show();
  }

  changeModal({ onConfirm, title, description, options }: ModalConfig) {
    this.title = title || "Title didn't load.";
    this.description = description || "Description didn't load";
    this.onConfirm = () => {
      if (onConfirm) onConfirm();
      this.close();
    };
    this.options = typeof options == 'undefined' ? {} : options;
    this.update();
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
