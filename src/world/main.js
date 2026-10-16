// Entry point: wires up every chapter of the page, top to bottom.
import { createMotionState } from './core/motion.js';
import { initMenu, initScrollProgress } from './navigation/menu.js';
import { initChapterTheme } from './navigation/chapter-theme.js';
import { initProjectDialog } from './dialogs/project-dialog.js';
import { initSceneVisibility } from './scenes/visibility.js';
import { initScrollMotion } from './scenes/scroll-motion.js';
import { initWater } from './chapters/pond/water.js';
import { initOpening } from './chapters/pond/opening.js';
import { pondCaptionScroll } from './chapters/pond/caption.js';
import { initDoor } from './chapters/shire/door.js';
import { initGollum } from './chapters/gollum.js';
import { cityScroll } from './chapters/city.js';
import { projectsScroll } from './chapters/projects.js';
import { atlasScroll } from './chapters/atlas.js';
import { initAiChapter } from './chapters/ai.js';
import { initLab } from './chapters/lab.js';
import { initContact } from './chapters/contact.js';

const motion = createMotionState();

initMenu();
initScrollProgress();
initProjectDialog();
initAiChapter();
initContact();

initSceneVisibility();
initChapterTheme(motion);
initScrollMotion(motion, [atlasScroll, pondCaptionScroll, cityScroll, projectsScroll]);

initDoor(motion);
initGollum(motion);
initLab(motion);

const pond = initWater(motion);
try {
  initOpening(motion, pond);
} catch {
  // Whatever goes wrong with the intro, the page must never stay locked.
  document.documentElement.style.overflow = '';
  document.querySelector('#home').classList.remove('intro-running');
  document.querySelector('#skipIntro').hidden = true;
}
