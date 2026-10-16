/**
 * The hobbit who answers the round door: 16×24 pixels, front view, in the
 * spirit of a small Bilbo (curly hair, red coat, green waistcoat, bare hairy
 * feet). Drawn by hand, one character per pixel.
 */
export const HOBBIT_PALETTE = {
  o: '#2b1a10', // outline
  h: '#7b4a22', // hair
  H: '#b0743a', // hair highlight
  s: '#f2bd8d', // skin
  S: '#cf8e60', // skin shade
  e: '#24160e', // eyes
  m: '#a04f3a', // mouth
  w: '#efe4cc', // shirt
  v: '#5f8233', // waistcoat
  V: '#3c5520', // waistcoat shade
  b: '#e7c050', // brass button
  c: '#9a3024', // coat
  C: '#64201a', // coat shade
  p: '#bf934f', // breeches
  P: '#8a6331', // breeches shade
  f: '#d89c6a', // feet
  F: '#6f421e', // foot hair
};

const head = [
  '.....oooooo.....',
  '....ohHhHhho....',
  '...ohHhhhHhho...',
  '..ohHhhHhhhHho..',
  '..ohhsssssshho..',
  '.ohhsssssssshho.',
  '.ohssesssessho..',
  '.oSsssssssssSo..',
  '..osssSmmSsso...',
  '...oSsssssSo....',
];

const legs = [
  '.oocCCCCCCCCCoo.',
  '...opppPPpppo...',
  '...opppo.opppo..',
  '...opPpo.oPppo..',
  '..ofFFfo.ofFFfo.',
  '.offFFfo.offFFfo',
  '.oooooo...oooooo',
];

export const HOBBIT_FRAMES = {
  stand: [
    ...head,
    '....owwsswwo....',
    '..occwwvvwwcco..',
    '.occcvvbvvvccco.',
    '.occCvvvvvvCcco.',
    'occCcvvvvvvcCcco',
    'occCcvvbvvvcCcco',
    'oscCcCvvvvCcCcso',
    ...legs,
  ],
  // Right hand raised high.
  waveUp: [
    ...head.slice(0, 7),
    '.oSsssssssssSo.o',
    '..osssSmmSsso.os',
    '...oSsssssSo..cs',
    '....owwsswwo.oc.',
    '..occwwvvwwccco.',
    '.occcvvbvvvccco.',
    '.occCvvvvvvCcco.',
    'occCcvvvvvvcCco.',
    'occCcvvbvvvcCco.',
    'oscCcCvvvvCcCo..',
    ...legs,
  ],
  // Hand tipped outward: alternating with waveUp reads as a wave.
  waveOut: [
    ...head.slice(0, 7),
    '.oSsssssssssSo..',
    '..osssSmmSsso..o',
    '...oSsssssSo.oso',
    '....owwsswwo.co.',
    '..occwwvvwwccco.',
    '.occcvvbvvvccco.',
    '.occCvvvvvvCcco.',
    'occCcvvvvvvcCco.',
    'occCcvvbvvvcCco.',
    'oscCcCvvvvCcCo..',
    ...legs,
  ],
};
