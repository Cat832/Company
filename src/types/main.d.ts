export type Tool = 'Media team';

export type PropertySector =
  | 'production'
  | 'industry'
  | 'economy'
  | 'service'


export type Property = {
  /**Name of property.*/
  name: string;
  /**Fill in blank: `<i class="fas fa-`___`"`></i>`*/
  icon: string;

  /**Sector property falls in, for events to deal with.*/
  sector: PropertySector;

  /**The first value of property.*/
  startedAt: number;
  /**Upon initiliazation should be equal to `startedAt`.*/
  value: number;

  /**How much it will cost to repair.*/
  onDamagePrice: number;
  /****Do not touch in initiliazation**. References if the property if damaged*/
  damaged?: boolean;
  /**If true property can't be damaged.*/
  immune?: boolean;

  /**Function is called when property is sold.*/
  onSell?(): void;
  /**Is shown in the modal as *information* about what will happen when you sell the property.*/
  sellDescription?: string;
  /**Is shown in the modal *title* before the property name.*/
  prependInModal?: string;
  /**If true, the name is not shown in the title the modal.*/
  hideNameInModal?: boolean;

  /**Min and max of the grow percentage each year. Set to [0, 0] if you want the property value to be non-dynamic.*/
  growVals?: [number, number];
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
  percentOwning?: number;
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
