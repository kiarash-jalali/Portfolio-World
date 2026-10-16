/**
 * Gollum: 24×16 pixels, side view facing right, crouched on all fours.
 * Pale skin, a few strands of hair, huge pale eyes and a ragged loincloth,
 * in the spirit of the reference sprite. Drawn by hand, one character per pixel.
 */
export const GOLLUM_PALETTE = {
  o: '#25221a', // outline
  g: '#d8cfa3', // skin
  G: '#a99d6d', // skin shade
  d: '#6f6545', // deep shade, mouth
  e: '#e8f6f4', // eye white
  E: '#2f6f8f', // iris
  k: '#101418', // pupil
  h: '#4a4430', // hair
  l: '#5b3b24', // loincloth
  r: '#e9b93c', // the ring
  R: '#fff0a8', // ring glint
  z: '#dfe8ef', // sleep "z"
};


export const GOLLUM_FRAMES = {
  idle: [
    '................h.h.....',
    '........oooo...ohohoo...',
    '......oogggGo.ogggggGo..',
    '.....ogggggGGoggggggggo.',
    '....oggGgGgggggggeeekgo.',
    '....olllgGgGggggeEEkkgo.',
    '...ollllooooogGggeeeggo.',
    '...ogllo....oGGgdddgo...',
    '..oggo......oGo.ooo.....',
    '..ogo.......ogo.........',
    '.ogo..o.....ogo.........',
    '.ogo.ogo....ogo.........',
    '.ogo.ogo....oggo........',
    'ogo..ogo.....ogo........',
    'oggo.oggo....oggoo......',
    'oooo.oooo....ooooo......',
  ],
  // Breathing: the head and shoulders dip a pixel.
  idleLow: [
    '........................',
    '........oooo....h.h.....',
    '......oogggGo..ohohoo...',
    '.....ogggggGGooggggggo..',
    '....oggGgGggggggggggggo.',
    '....olllgGgGgggggeeekgo.',
    '...ollllooooogGgeEEkkgo.',
    '...ogllo....oGGggeeeggo.',
    '..oggo......oGo.gdddgo..',
    '..ogo.......ogo.oooo....',
    '.ogo..o.....ogo.........',
    '.ogo.ogo....ogo.........',
    '.ogo.ogo....oggo........',
    'ogo..ogo.....ogo........',
    'oggo.oggo....oggoo......',
    'oooo.oooo....ooooo......',
  ],
  // Creeping: hind leg stretched back, front hand reaching forward.
  creepA: [
    '................h.h.....',
    '........oooo...ohohoo...',
    '......oogggGo.ogggggGo..',
    '.....ogggggGGoggggggggo.',
    '....oggGgGgggggggeeekgo.',
    '....olllgGgGggggeEEkkgo.',
    '...ollllooooogGggeeeggo.',
    '..oogllo....oGGgdddgo...',
    '.oggoo.......oGo.ooo....',
    'ogo...........ogo.......',
    'oo.....o.......ogo......',
    '......ogo.......ogo.....',
    '......ogo........ogo....',
    '.....ogo..........ogo...',
    '.....oggo.........oggoo.',
    '.....oooo.........ooooo.',
  ],
  // Creeping: hind leg tucked under, front hand planted back.
  creepB: [
    '................h.h.....',
    '........oooo...ohohoo...',
    '......oogggGo.ogggggGo..',
    '.....ogggggGGoggggggggo.',
    '....oggGgGgggggggeeekgo.',
    '....olllgGgGggggeEEkkgo.',
    '...ollllooooogGggeeeggo.',
    '...ogllo....oGGgdddgo...',
    '....ogo.....oGo.ooo.....',
    '....ogo....ogo..........',
    '...ogo.o...ogo..........',
    '...ogoogo..ogo..........',
    '..ogo.ogo..ogo..........',
    '..ogo.ogo.ogo...........',
    '.oggo.oggooggo..........',
    '.oooo.ooooooooo.........',
  ],
  // Sitting up on his haunches, cradling the ring to his face.
  ring: [
    '..........h.h.h.........',
    '.........ohohohoo.......',
    '........ogggggggGo......',
    '.......ogggggggggGo.....',
    '.......ogeeekgeeekGo....',
    '.......ogeEkkgeEkkgo....',
    '.......oggeeeggeeego....',
    '........ogggdddggGo.....',
    '......oo.oggggggGo.oo...',
    '.....ogggoggggggGoggo...',
    '.....ogggrRrgggggrrgo...',
    '......oggrorggggGoo.....',
    '.....olllrrrlggggGo.....',
    '....ogglllllgggggGGo....',
    '...oggggoooogggggggGo...',
    '...oooooo..oooooooooo...',
  ],
  // Delight: arms up, eyes wide, ring held high.
  ringJoy: [
    '....rRr...h.h.h..rr.....',
    '....ror..ohohohoorr.....',
    '....ogo.ogggggggGogo....',
    '....ogooggggggggggGo....',
    '.....ogogeeekgeeekgo....',
    '.....oggoeEkkgeEkkgo....',
    '......oogeeeggeeeggo....',
    '........oggdddddggo.....',
    '.........oggddggGo......',
    '.........ogggggggo......',
    '........ogggggggggo.....',
    '........ogggggggGgo.....',
    '.......olllllggggGo.....',
    '....ooglllllgggggGGo....',
    '...oggggoooogggggggGo...',
    '...oooooo..oooooooooo...',
  ],
  // The ring is gone: head hung low.
  lost: [
    '........................',
    '........................',
    '........oooo............',
    '......oogggGo...........',
    '.....ogggggGGo..h.h.....',
    '....oggGgGggggoohohoo...',
    '....olllgGgGgggggggggo..',
    '...ollllooooogGgggggggo.',
    '...ogllo....oGGggekkggo.',
    '..oggo......oGo.ggEkgo..',
    '..ogo.......ogo.oddgo...',
    '.ogo..o.....ogo..ooo....',
    '.ogo.ogo....oggo........',
    'ogo..ogo.....ogo........',
    'oggo.oggo....oggoo......',
    'oooo.oooo....ooooo......',
  ],
  // Curled up asleep, eyes shut, hands under his head.
  sleep: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '..........oooooo........',
    '........oogggggGoo.h.h..',
    '......oogggGgGgggGoohoo.',
    '.....ogggGgGgggggggggGo.',
    '....ollllgggggggGgddggo.',
    '...olllllgGGGgggggggGo..',
    '...oggggggooooggGGGGo...',
    '..oggGGGgo..oggggggo....',
    '.oggggggGo..oGGGGGGo....',
    '.oooooooo...oooooooo....',
  ],
  // Breathing in his sleep: the back rises a pixel.
  sleepHigh: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '..........oooooo........',
    '........oogggggGoo.h.h..',
    '......oogggGgGgggGoohoo.',
    '.....ogggGgGgggggggggGo.',
    '....ollllgggggggGgddggo.',
    '...olllllgGGGgggggggGo..',
    '...olllllgGGGgggggggGo..',
    '...oggggggooooggGGGGo...',
    '..oggGGGgo..oggggggo....',
    '.oggggggGo..oGGGGGGo....',
    '.oooooooo...oooooooo....',
  ],
};

