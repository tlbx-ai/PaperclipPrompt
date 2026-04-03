export const assetRegistry = [
  {
    id: 'earth-material',
    label: 'Earth Surface',
    kind: 'material',
    status: 'procedural',
    path: 'src/main.js',
    preview: 'planet',
    tags: ['planet', 'earth', 'surface'],
    notes: 'Current placeholder uses a procedural material. Replace with albedo, roughness, and emissive maps later.'
  },
  {
    id: 'city-blocks',
    label: 'City Blocks',
    kind: 'mesh-set',
    status: 'procedural',
    path: 'src/main.js',
    preview: 'city',
    tags: ['earth', 'city', 'factory'],
    notes: 'Generated low-detail skyline around factory #1.'
  },
  {
    id: 'factory-01',
    label: 'Factory #1',
    kind: 'mesh-set',
    status: 'procedural',
    path: 'src/main.js',
    preview: 'factory',
    tags: ['factory', 'anchor', 'earth'],
    notes: 'Main player anchor. Future replacement target for authored model.'
  },
  {
    id: 'paperclip-orbit',
    label: 'Paperclip Orbit',
    kind: 'effect',
    status: 'procedural',
    path: 'src/main.js',
    preview: 'paperclips',
    tags: ['paperclip', 'reward', 'orbit'],
    notes: 'Animated reward visualization for production volume.'
  },
  {
    id: 'space-backdrop',
    label: 'Space Backdrop',
    kind: 'environment',
    status: 'procedural',
    path: 'src/main.js',
    preview: 'space',
    tags: ['stars', 'space', 'background'],
    notes: 'Procedural star field. Candidate for later skybox replacement.'
  }
];
