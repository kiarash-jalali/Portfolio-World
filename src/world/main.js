import { createMotionState, initScenes } from './scenes.js';
import { initNavigation, initProjects, initAI, initContact } from './ui.js';
import { initOpening } from './opening.js';
import { initDoor, initGollum } from './characters.js';
import { initWorkshop } from './workshop.js';
const motion=createMotionState();
initNavigation();initProjects();initAI();initContact();initScenes(motion);initDoor(motion);initGollum(motion);initWorkshop(motion);
initOpening(motion).catch(()=>{document.documentElement.style.overflow='';document.querySelector('#home').classList.remove('intro-running');document.querySelector('#skipIntro').hidden=true;});
