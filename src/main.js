import { MallGame } from './game.js';
import { MallUI } from './ui.js';
import { sound } from './sound.js';
import { loadMallData } from './firebase.js';

window.addEventListener('DOMContentLoaded', async () => {
  const canvasContainer = document.getElementById('game-canvas-container');
  const loaderEl = document.getElementById('mall-loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderStatus = document.getElementById('loader-status');

  const updateProgress = (text, pct) => {
    if (loaderStatus) loaderStatus.textContent = text;
    if (loaderProgress) loaderProgress.style.width = `${pct}%`;
  };

  // 1. Load all mall data from Firebase Database with local IndexedDB cache
  updateProgress("Connecting to Firebase Cloud Database...", 25);
  const { stores, products, orders, source } = await loadMallData((text, pct) => {
    updateProgress(text, pct);
  });

  updateProgress("Assembling 3D Mall & Stalls...", 90);

  let ui = null;

  // 2. Initialize Game Scene with loaded stores and products
  const game = new MallGame(
    canvasContainer,
    stores,
    products,
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
    },
    // On Open Grand Glass Elevator Floor Selector
    () => {
      if (ui) ui.openElevatorModal();
    }
  );

  // 3. Initialize UI overlay & controller with live database stores, products, orders
  ui = new MallUI(game, stores, products, orders);

  // Audio activation on first user interaction
  const activateAudio = () => {
    sound.init();
    window.removeEventListener('pointerdown', activateAudio);
    window.removeEventListener('keydown', activateAudio);
  };
  window.addEventListener('pointerdown', activateAudio);
  window.addEventListener('keydown', activateAudio);

  // 4. Smoothly fade out loader overlay
  if (loaderEl) {
    updateProgress("Welcome to Ready Mall Accra!", 100);
    setTimeout(() => {
      loaderEl.classList.add('loader-hidden');
      setTimeout(() => loaderEl.remove(), 600);
    }, 250);
  }

  console.log(`🏬 Ready Mall Accra successfully booted (Data source: ${source})!`);
});
