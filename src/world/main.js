import { createMotionState, initScenes } from './scenes.js';
import { initNavigation, initProjects, initAI, initContact } from './ui.js';
import {initPond} from './pond.js';
import { initOpening } from './opening.js';
import { initDoor, initGollum } from './characters.js';
import { initWorkshop } from './workshop.js';
const motion=createMotionState();
initNavigation();initProjects();initAI();initContact();initScenes(motion);initDoor(motion);initGollum(motion);initWorkshop(motion);
const pond=initPond(motion);
try{initOpening(motion,pond);}catch{document.documentElement.style.overflow='';document.querySelector('#home').classList.remove('intro-running');document.querySelector('#skipIntro').hidden=true;}
