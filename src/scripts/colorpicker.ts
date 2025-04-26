interface props {
  onInput?: (input: string) => void;
  onValidInput?: (input: string) => void;
  onExit?: (input: string) => void;
  onClick?: () => boolean;
}

export default function setupColorpicker({
  onClick = () => true,
  onExit = () => undefined,
  onValidInput = (_) => undefined,
  onInput = (_) => undefined,
}: props) {
  const colorButton = document.getElementById('color-button') as HTMLDivElement;
  const colorPopup = document.getElementById('color-popup') as HTMLDivElement;
  const hexInput = document.getElementById('hex-input') as HTMLInputElement;

  let popupVisible = false;

  // Toggle popup visibility
  colorButton.addEventListener('click', () => {
    if (!onClick()) return;
    popupVisible = !popupVisible;
    colorPopup.style.display = popupVisible ? 'block' : 'none';

    // Position the popup near the button
    // Temporarily show popup to get dimensions
    colorPopup.style.display = 'block';
    colorPopup.style.visibility = 'hidden'; // Hide visually but allow measuring

    const buttonRect = colorButton.getBoundingClientRect();
    const popupRect = colorPopup.getBoundingClientRect();

    // Position top-left of popup to align with top-left of button, offset by its width/height
    colorPopup.style.top = `${buttonRect.top + window.scrollY}px`;
    colorPopup.style.left = `${
      buttonRect.left + window.scrollX - popupRect.width - 8
    }px`;

    colorPopup.style.visibility = 'visible';

    if (popupVisible) {
      hexInput.focus();
    }
  });

  // Change color when valid hex code is typed
  hexInput.addEventListener('input', () => {
    onInput(hexInput.value);
    let value = hexInput.value.trim();
    value = `#${value}`;
    const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

    if (hexPattern.test(value)) {
      colorButton.style.backgroundColor = value;
      onValidInput(hexInput.value);
    }
  });

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !colorButton.contains(e.target as Node) &&
      !colorPopup.contains(e.target as Node)
    ) {
      colorPopup.style.display = 'none';
      popupVisible = false;
      onExit(hexInput.value);
    }
  });
}
