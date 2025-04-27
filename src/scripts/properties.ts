import { Property } from '../types/main';
import { modal } from './main';
import { getElement } from './modal';

export type PropertiesChange = {
  deleteAtIndex: number | undefined;
  moneyGain: number;
};

export function updateProperties(
  a: Property[],
  onChange: (data: PropertiesChange) => void
) {
  const element = getElement<HTMLDivElement>('properties-box');
  element.innerHTML = a.length > 0 ? '' : '<span class="NA-properties">You have no properties</span>';
  a.forEach((v, i) => {
    let propertyElement = document.createElement('div');
    propertyElement.classList = `property${v.damaged ? ' damaged' : ''}`;
    let icon = document.createElement('i');
    icon.className = `fas fa-${v.icon}`;
    propertyElement.appendChild(icon);
    let modalTable = !v.damaged
      ? `<table class="modal-table">
        <thead class="modal-table-head">
          <th class="modal-table-th">Starting value</th>
          <th class="modal-table-th">Current value</th>
        </thead>
        <tbody>
          <td class="modal-table-cell"><span class="green" style="font-weight: 500">$${v.startedAt}</span></td>
          <td class="modal-table-cell"><span class="green">$${v.value}</span></td>
        </tbody>
      </table>`
      : `<table class="modal-table">
        <thead class="modal-table-head">
          <th class="modal-table-th">Current value</th>
          <th class="modal-table-th">Repair costs</th>
        </thead>
        <tbody>
          <td class="modal-table-cell"><span class="green" style="font-weight: 500">$${v.value}</span></td>
          <td class="modal-table-cell"><span class="red">$${v.onDamagePrice}</span></td>
        </tbody>
      </table>`;
    propertyElement.onclick = () => {
      modal.changeModal({
        title: `${v.damaged ? 'Repair' : 'Sell'} ${v.name}?`,
        description: `${
          v.damaged
            ? 'You cannot sell this property due to it being damaged.'
            : `Note that properties gain value over time, you could be gaining more from this!`
        }${modalTable}`,
        onConfirm() {
          onChange({
            moneyGain: v.damaged ? -v.onDamagePrice : v.value,
            deleteAtIndex: v.damaged ? undefined : i,
          });
        },
      });
      modal.show();
    };
    element.appendChild(propertyElement);
  });
}
