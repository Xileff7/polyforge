import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fake iPhone 17 Pro',
    description: '1:1 Scale non-functional display model. Features the new camera layout design. Perfect for case makers or pranks.',
    price: 5.00,
    filamentType: 'PLA',
  },
  {
    id: '2',
    name: 'Butterfly Knife Trainer',
    description: 'Safe, blunt-blade balisong trainer. Smooth bearing action for practicing tricks. NOT a weapon.',
    price: 5.00,
    filamentType: 'PLA',
  },
  {
    id: '3',
    name: 'Custom Phone Case',
    description: 'Rugged aesthetic case with honeycomb impact structure. Fits most modern phones.',
    price: 5.00,
    filamentType: 'PLA',
  },
  {
    id: '4',
    name: 'Sim Gear Shifter',
    description: 'Realistic H-pattern shifter knob and mechanism housing for sim racing setups.',
    price: 5.00,
    filamentType: 'PLA',
  },
  {
    id: '5',
    name: 'Fidget Toy (Custom)',
    description: 'Any fidget model you want. Please specify the exact model name (e.g. Infinity Cube, Gear Bearing) in the notes.',
    price: Math.floor(Math.random() * 26) + 5, // Random price between 5 and 30
    filamentType: 'PLA',
  }
];

export const ADMIN_PASSWORD = "Xileff7pupu!";