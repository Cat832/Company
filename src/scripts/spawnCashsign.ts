import { formatNumberWithPeriods } from "../Events/grc";
import { getElement } from "./modal";

export function spawnCash(element: HTMLElement, amount: number) {
  if (getElement<HTMLInputElement>('setting-option-cashfloat').checked == false) return;
  let rect = element.getBoundingClientRect();
  let span = document.createElement('span');
  span.className = `cash-floating cash-${amount < 0 ? 'red' : 'green'}`;
  span.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
  span.style.top = `${rect.top + window.scrollY}px`;
  span.innerText = `${amount < 0 ? '-' : '+'}$${formatNumberWithPeriods(Math.abs(amount))}`
  document.body.appendChild(span);
  setTimeout(() => {
    span.remove();
  }, 1000)
}
