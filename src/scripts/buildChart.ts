import { Chart } from 'chart.js';

interface config {
  context: HTMLCanvasElement;
  values: Array<number>;
  lineColor: string;
  defaultBorderWidth: number;
  title?: string;
}

export default function buildChart({
  context,
  values,
  lineColor,
  defaultBorderWidth,
  title = 'Tier 1',
}: config) {
  const qr = new Chart(context, {
    type: 'line',
    data: {
      labels: Array.from(values, () => ''),
      datasets: [
        {
          label: 'worth',
          data: values,
          tension: 0.1,
          fill: 'start',
          borderColor: lineColor,
          pointRadius: 0.2,
          borderWidth: defaultBorderWidth,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false, // ❌ no vertical grid lines
          },
        },
        y: {
          ticks: {
            font: {
              size: 8,
            },
          },
          min: 8500,
          max: 10500,
        }
      },
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
        legend: {
          display: false,
        },
        zoom: {
          pan: {
            enabled: true,
            threshold: 0.02,
            mode: 'xy',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
        annotation: {
          annotations: {
            Tier2Indicator: {
              type: 'line',
              scaleID: 'y',
              value: 20000,
              borderColor: 'black',
              borderWidth: 2,
              adjustScaleRange: false,
              label: {
                display: true,
                content: "Tier 2",
                color: 'white',
                backgroundColor: 'black',
                position: 'start',
                font: {
                  family: 'def',
                  size: 8,
                  weight: 'bold',
                }
              }
            }
          }
        }
      },
    },
  });

  (
    document.getElementById('reset-zoom-btn') as HTMLButtonElement
  ).addEventListener('click', () => {
    qr.resetZoom();
  });

  return qr;
}

export function createRandomWalkArray(length: number = 100): number[] {
  let current = 0;
  return Array.from({ length }, (_, i) => {
    if (i === 0) return current;
    const change = Math.random() * 10 - 5; // random between -5 and 5
    current += change;
    return current;
  });
}
