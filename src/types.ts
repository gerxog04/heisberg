export interface DrugProfile {
  searchTerm: string;
  inn: string;
  commonNames: string[];
  drugClass: string;
  description: string;
  imageUrl?: string;
}

export interface DrugAnalogue {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  dosageForm: string;
  route: string;
  strength: string;
}

export type SelectedCountry = "USA" | "Canada" | "EU" | "Serbia" | "Singapore";
