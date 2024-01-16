export interface Mof {
  idCharge: number;
  nameCharge: string;
  imageCompany: string;
  proficiencies: Proficiencies[];
}

export interface Proficiencies {
  code: number;
  description: string;
  weight: number;
  level: number;
  isConfigured: boolean;
}
