export type Tool = 'Media team';

export type Property = {
  name: string;
  icon: string;
  startedAt: number;
  value: number;
  onDamagePrice: number;
  onSell?(): void;
  damaged?: boolean;
};

export type Income = {
  name: string;
  annual: number;
  disbandable?: boolean;
  onDisband?(): void;
  /**Complete the text "and you will"*/
  disbanddescription?: text;
  append?: string;
  /**If not dynamic, it can't grow with each year*/
  nonDynamic?: boolean;
  /**If safe, it will not "go rogue"*/
  safe?: boolean;
  disbandYearnumber?: number;
};

export type ButtonResult = {
  moneyGain?: number;
  propertyGain?: Property;
  incomeGain?: Income;
  reputationGain?: number;
  // toolGain?: Tool;
};

export type Company = {
  name: string;
  income: number;
  reputation: number;
  /**How much *they* own of **the player**.*/
  percentOwning: number;
};

export type Variant = 'error' | 'succes' | 'info' | 'warning';

export type InteractionButton = {
  text: string;
  description: string;
  variant: Variant;
  onClick(): ButtonResult;
};

export type Interaction = {
  title: string | Node;
  buttons: InteractionButton[];
};
