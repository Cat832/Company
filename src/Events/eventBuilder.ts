import { Company, Interaction } from '../types/main';
import {
  companyToStr,
  registerCompany,
  registeredCompanies,
  Tier,
} from './grc';

export function chance(percent: number): boolean {
  return Math.random() * 100 < percent;
}

export function generateLargeMoney(
  max: number,
  min: number,
  multiplier: number
) {
  return Math.floor(Math.random() * (max - min + 1) + min) * multiplier;
}

export type eventConfig = {
  generate(id: string): [Interaction, Company | undefined];
  id: string;
  shouldSkip?(): boolean;
  tier: Tier;
  oneTime?: boolean;
};

export class Eventbuilder {
  tier: Tier;
  oneTime: boolean;
  id: string;
  shouldSkip: () => boolean;
  generate: (id: string) => [Interaction, Company | undefined];
  constructor({ generate, tier, oneTime, shouldSkip, id }: eventConfig) {
    this.oneTime = oneTime == undefined ? false : oneTime;
    this.id = id;
    if (shouldSkip == undefined) {
      this.shouldSkip = function () {
        return false;
      };
    } else {
      this.shouldSkip = shouldSkip;
    }
    this.tier = tier;
    this.generate = generate;
  }

  build(): Interaction {
    let result = this.generate(`ts${registeredCompanies + 1}`);
    if (typeof result[1] !== 'undefined') {
      registerCompany(result[1], {
        title: 'Company info',
        description: companyToStr(result[1]),
        options: {
          footer: {
            hideCancel: true,
            hideConfirm: true,
          },
        },
      });
    }
    return result[0];
  }
}
