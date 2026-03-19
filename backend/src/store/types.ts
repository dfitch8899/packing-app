export type ChecklistCategory = {
  id: string;
  name: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  categoryId: string;
  quantity: number;
  completed: boolean;
};

export type Trip = {
  id: string;
  name: string;
  location: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  checklistCategories: ChecklistCategory[];
  checklistItems: ChecklistItem[];
  participants: Array<{
    id: string;
    name: string;
    ready: boolean;
  }>;
  weather: {
    summary: {
      minC: number;
      maxC: number;
      label: string;
    };
    forecast: Array<{
      day: string;
      minC: number;
      maxC: number;
      condition: string;
    }>;
  };
  packingStrategy: {
    recommended: Array<{
      id: string;
      text: string;
      rationale: string;
    }>;
  };
  shared: {
    commonItems: Array<{
      id: string;
      text: string;
      quantity: number;
      assignedTo?: string; // participantId
    }>;
  };
};

export type InspirationCard = {
  id: string;
  destination: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type StoreData = {
  trips: Trip[];
  inspirations: InspirationCard[];
};

