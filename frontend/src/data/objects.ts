export interface GameObject {
  id: string;
  name: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  synonyms: string[];
  enabled: boolean;
}

export const GAME_OBJECTS: GameObject[] = [
  { id: 'obj-001', name: 'Fan', category: 'Household', difficulty: 'EASY', synonyms: ['ceiling fan', 'table fan'], enabled: true },
  { id: 'obj-002', name: 'Light bulb', category: 'Household', difficulty: 'EASY', synonyms: ['bulb', 'lamp'], enabled: true },
  { id: 'obj-003', name: 'Washing machine', category: 'Household', difficulty: 'MEDIUM', synonyms: ['washer'], enabled: true },
  { id: 'obj-004', name: 'Refrigerator', category: 'Household', difficulty: 'EASY', synonyms: ['fridge'], enabled: true },
  { id: 'obj-005', name: 'Television', category: 'Household', difficulty: 'EASY', synonyms: ['tv', 'telly'], enabled: true },
  { id: 'obj-006', name: 'Sofa', category: 'Household', difficulty: 'EASY', synonyms: ['couch'], enabled: true },
  { id: 'obj-007', name: 'Chair', category: 'Household', difficulty: 'EASY', synonyms: ['seat'], enabled: true },
  { id: 'obj-008', name: 'Table', category: 'Household', difficulty: 'EASY', synonyms: ['desk'], enabled: true },
  { id: 'obj-009', name: 'Bed', category: 'Household', difficulty: 'EASY', synonyms: ['cot'], enabled: true },
  { id: 'obj-010', name: 'Pillow', category: 'Household', difficulty: 'EASY', synonyms: ['cushion'], enabled: true },
  { id: 'obj-011', name: 'Clock', category: 'Household', difficulty: 'EASY', synonyms: ['watch'], enabled: true },
  { id: 'obj-012', name: 'Mirror', category: 'Household', difficulty: 'EASY', synonyms: ['glass'], enabled: true },
  { id: 'obj-013', name: 'Door', category: 'Household', difficulty: 'EASY', synonyms: ['gate'], enabled: true },
  { id: 'obj-014', name: 'Window', category: 'Household', difficulty: 'EASY', synonyms: ['glass window'], enabled: true },
  { id: 'obj-015', name: 'Curtain', category: 'Household', difficulty: 'EASY', synonyms: ['drapes'], enabled: true },
  { id: 'obj-016', name: 'Bucket', category: 'Household', difficulty: 'EASY', synonyms: ['pail'], enabled: true },
  { id: 'obj-017', name: 'Broom', category: 'Household', difficulty: 'EASY', synonyms: ['sweeper'], enabled: true },
  { id: 'obj-018', name: 'Dustbin', category: 'Household', difficulty: 'EASY', synonyms: ['trash can'], enabled: true },
  { id: 'obj-019', name: 'Iron box', category: 'Household', difficulty: 'MEDIUM', synonyms: ['iron'], enabled: true },
  { id: 'obj-020', name: 'Air conditioner', category: 'Household', difficulty: 'MEDIUM', synonyms: ['ac'], enabled: true }
];
