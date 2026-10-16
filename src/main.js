import { MallGame } from './game.js';
import { MallUI } from './ui.js';
import { sound } from './sound.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('game-canvas-container');

  let ui = null;

  // Initialize Game Scene
  const game = new MallGame(
    canvasContainer,
    // On Proximity Change
    (trigger) => {
      if (ui) ui.handleProximity(trigger);
    },
    // On Open Product Card
    (product) => {
      if (ui) ui.openProductModal(product);
    },
    // On Open Checkout Counter
    () => {
      if (ui) ui.openCheckout();
    },
    // On Open GTA Stall Catalog (when standing in glowing cylinder)
    (store) => {
      if (ui) ui.openStallCatalog(store);
    },
    // On Open Mall Exit Door Confirmation Prompt
    () => {
      if (ui) ui.openExitPrompt();
    }
  );

  // Initialize UI overlay & controller
  ui = new MallUI(game);

  // Audio activation on first user interaction
  const activateAudio = () => {
    sound.init();
    window.removeEventListener('pointerdown', activateAudio);
    window.removeEventListener('keydown', activateAudio);
  };
  window.addEventListener('pointerdown', activateAudio);
  window.addEventListener('keydown', activateAudio);

  console.log("🏬 Ready Mall Accra successfully booted!");
});
