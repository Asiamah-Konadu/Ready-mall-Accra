import confetti from 'canvas-confetti';
import { sound } from './sound.js';
import {
  placeOrder,
  updateProductStock,
  addProduct,
  subscribeToOrders,
  updateOrderStatus
} from './firebase.js';

export class MallUI {
  constructor(game, stores = [], products = [], orders = []) {
    this.game = game;
    this.stores = stores;
    this.products = products;
    this.orders = [...orders];
    this.selectedStoreId = this.stores[0]?.id || 'store-shoes-1';
    this.selectedVariant = null;
    this.currentInspectingProduct = null;
    this.selectedNetwork = 'MTN MoMo';

    // Wardrobe state
    this.readyCoins = 250;
    this.currentSkin = { name: 'yellow', color: '#f59e0b' };
    this.upgrades = { speed: false, stack: false };

    // Radio state
    this.radioStations = [
      { name: 'Accra Vibes FM', genre: 'Afrobeats' },
      { name: 'Highlife Radio', genre: 'Highlife' },
      { name: 'Mall Chill Beats', genre: 'Lo-Fi' },
      { name: 'Accra City FM', genre: 'Afropop' }
    ];
    this.radioIndex = 0;
    this.radioPlaying = false;
    this.radioGainNode = null;
    this.radioOscillators = [];

    // Product uploader color
    this.selectedProductColor = '#f59e0b';

    // Placed orders tracker
    this.myOrders = []; // customer-side orders with stepper state

    this.cacheElements();
    this.bindEvents();
    this.initJoystick();

    // Subscribe to live Firestore orders updates
    try {
      this.unsubOrders = subscribeToOrders((liveOrders) => {
        if (liveOrders && liveOrders.length > 0) {
          this.orders = liveOrders;
          this.renderMerchantOrders();
        }
      });
    } catch (e) {
      console.warn("Real-time orders subscription not available:", e);
    }
    this.initMinimap();
    this.initRadio();
    this.initSearch();
    this.renderMerchantOrders();
  }

  cacheElements() {
    // HUD
    this.cartBtn = document.getElementById('cart-btn');
    this.cartCounter = document.getElementById('cart-counter');
    this.cartTotalBadge = document.getElementById('cart-total-badge');
    this.soundBtn = document.getElementById('sound-btn');
    this.merchantBtn = document.getElementById('merchant-btn');
    this.roomNav = document.getElementById('room-nav');

    // Proximity Banner
    this.proximityBanner = document.getElementById('proximity-banner');
    this.promptMainText = document.getElementById('prompt-main-text');
    this.promptSubText = document.getElementById('prompt-sub-text');
    this.interactionActionBtn = document.getElementById('interaction-action-btn');

    // Product Modal
    this.productModal = document.getElementById('product-modal');
    this.productModalClose = document.getElementById('product-modal-close');
    this.modalProdImg = document.getElementById('modal-prod-img');
    this.modalStoreIcon = document.getElementById('modal-store-icon');
    this.modalStoreName = document.getElementById('modal-store-name');
    this.modalProdName = document.getElementById('modal-prod-name');
    this.modalProdPrice = document.getElementById('modal-prod-price');
    this.modalProdStock = document.getElementById('modal-prod-stock');
    this.modalProdDesc = document.getElementById('modal-prod-desc');
    this.modalVariantChips = document.getElementById('modal-variant-chips');
    this.modalAddStackBtn = document.getElementById('modal-add-stack-btn');
    this.modalStallBadge = document.getElementById('modal-stall-badge');

    // Checkout Modal
    this.checkoutModal = document.getElementById('checkout-modal');
    this.checkoutModalClose = document.getElementById('checkout-modal-close');
    this.cartItemsContainer = document.getElementById('cart-items-container');
    this.custNameInput = document.getElementById('cust-name');
    this.custPhoneInput = document.getElementById('cust-phone');
    this.custAddressInput = document.getElementById('cust-address');
    this.networkOptions = document.querySelectorAll('.network-option');
    this.paystackTriggerBtn = document.getElementById('paystack-trigger-btn');
    this.payButtonLabel = document.getElementById('pay-button-label');

    // Paystack Modal
    this.paystackModal = document.getElementById('paystack-modal');
    this.paystackModalAmount = document.getElementById('paystack-modal-amount');
    this.paystackModalPhone = document.getElementById('paystack-modal-phone');
    this.simulateMomoApproveBtn = document.getElementById('simulate-momo-approve-btn');
    this.cancelPaystackBtn = document.getElementById('cancel-paystack-btn');

    // Merchant Modal
    this.merchantModal = document.getElementById('merchant-modal');
    this.merchantModalClose = document.getElementById('merchant-modal-close');
    this.merchantStoreTabs = document.getElementById('merchant-store-tabs');
    this.merchantOrdersList = document.getElementById('merchant-orders-list');
    this.statRevenue = document.getElementById('stat-revenue');
    this.statOrdersCount = document.getElementById('stat-orders-count');

    // Stall Catalog Modal (GTA Glowing Cylinder)
    this.stallCatalogModal = document.getElementById('stall-catalog-modal');
    this.stallCatalogClose = document.getElementById('stall-catalog-close');
    this.catalogHeaderBanner = document.getElementById('catalog-header-banner');
    this.catalogStallNum = document.getElementById('catalog-stall-num');
    this.catalogDistrictName = document.getElementById('catalog-district-name');
    this.catalogStoreName = document.getElementById('catalog-store-name');
    this.catalogStoreTagline = document.getElementById('catalog-store-tagline');
    this.catalogOwnerName = document.getElementById('catalog-owner-name');
    this.catalogWhatsappLink = document.getElementById('catalog-whatsapp-link');
    this.catalogProductsCount = document.getElementById('catalog-products-count');
    this.catalogProductsGrid = document.getElementById('catalog-products-grid');
    this.catalogCarriedCount = document.getElementById('catalog-carried-count');
    this.catalogCarriedTotal = document.getElementById('catalog-carried-total');
    this.catalogGotoCheckoutBtn = document.getElementById('catalog-goto-checkout-btn');

    // Exit Door Modal & Splash Screen
    this.exitModal = document.getElementById('exit-modal');
    this.exitModalMsg = document.getElementById('exit-modal-msg');
    this.confirmExitBtn = document.getElementById('confirm-exit-btn');
    this.cancelExitBtn = document.getElementById('cancel-exit-btn');
    this.gameExitScreen = document.getElementById('game-exit-screen');
    this.exitStatOrders = document.getElementById('exit-stat-orders');
    this.exitStatSpent = document.getElementById('exit-stat-spent');
    this.reenterMallBtn = document.getElementById('reenter-mall-btn');

    // Virtual Joystick
    this.joystickZone = document.getElementById('joystick-zone');
    this.joystickKnob = document.getElementById('joystick-knob');

    // Minimap
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;
    this.minimapContainer = document.getElementById('minimap-container');
    this.minimapToggleBtn = document.getElementById('minimap-toggle');

    // Radio
    this.radioWidget = document.getElementById('radio-widget');
    this.radioPlayBtn = document.getElementById('radio-play-btn');
    this.radioPrevBtn = document.getElementById('radio-prev-btn');
    this.radioNextBtn = document.getElementById('radio-next-btn');
    this.radioStationName = document.getElementById('radio-station-name');
    this.radioVolSlider = document.getElementById('radio-vol');

    // Wardrobe
    this.wardrobeBtn = document.getElementById('wardrobe-btn');
    this.wardrobeModal = document.getElementById('wardrobe-modal');
    this.wardrobeModalClose = document.getElementById('wardrobe-modal-close');
    this.readyCoinsVal = document.getElementById('ready-coins-val');
    this.wardrobeSkinsGrid = document.getElementById('wardrobe-skins-grid');
    this.avatarCanvas = document.getElementById('avatar-canvas');
    this.avatarCtx = this.avatarCanvas ? this.avatarCanvas.getContext('2d') : null;

    // Orders tracker
    this.ordersBtn = document.getElementById('orders-btn');
    this.ordersBadge = document.getElementById('orders-badge');
    this.ordersModal = document.getElementById('orders-modal');
    this.ordersModalClose = document.getElementById('orders-modal-close');
    this.ordersTrackerList = document.getElementById('orders-tracker-list');
    this.ordersEmptyState = document.getElementById('orders-empty-state');

    // Search
    this.hudSearchInput = document.getElementById('hud-search-input');
    this.searchResultsDropdown = document.getElementById('search-results-dropdown');

    // Product uploader
    this.addProductModal = document.getElementById('add-product-modal');
    this.addProductModalClose = document.getElementById('add-product-modal-close');
    this.npPublishBtn = document.getElementById('np-publish-btn');
    this.npSuccessMsg = document.getElementById('np-success-msg');
    this.npColorRow = document.getElementById('np-color-row');

    // Mobile controls & toggles
    this.hudSearchWrap = document.querySelector('.hud-search-wrap');
    this.mobileSearchBtn = document.getElementById('mobile-search-btn');
    this.mobileRadioBtn = document.getElementById('mobile-radio-btn');
    this.mobileActionBtn = document.getElementById('mobile-action-btn');
    this.mobileActionIcon = document.getElementById('mobile-action-icon');
    this.mobileActionLabel = document.getElementById('mobile-action-label');
  }

  bindEvents() {
    // Room fast-travel
    this.roomNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-pill');
      if (!btn) return;
      document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const room = btn.dataset.room;
      this.game.teleportToRoom(room);
    });

    // Sound toggle
    this.soundBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      this.soundBtn.textContent = isEnabled ? '🔊' : '🔇';
      this.soundBtn.title = isEnabled ? 'Sound Enabled' : 'Sound Muted';
    });

    // Proximity banner action
    this.interactionActionBtn.addEventListener('click', () => {
      this.game.interactCurrentTrigger();
    });

    // Modals open/close
    this.cartBtn.addEventListener('click', () => this.openCheckout());
    this.productModalClose.addEventListener('click', () => this.closeModals());
    this.checkoutModalClose.addEventListener('click', () => this.closeModals());
    this.merchantBtn.addEventListener('click', () => this.openMerchantModal());
    this.merchantModalClose.addEventListener('click', () => this.closeModals());
    this.cancelPaystackBtn.addEventListener('click', () => this.closeModals());
    this.stallCatalogClose.addEventListener('click', () => this.closeModals());
    this.catalogGotoCheckoutBtn.addEventListener('click', () => {
      this.closeModals();
      this.openCheckout();
    });

    // Exit Door Modal Events
    this.cancelExitBtn.addEventListener('click', () => this.closeModals());
    this.confirmExitBtn.addEventListener('click', () => this.confirmExitGame());
    this.reenterMallBtn.addEventListener('click', () => this.reenterMall());

    // Add to Stack button
    this.modalAddStackBtn.addEventListener('click', () => {
      if (this.currentInspectingProduct) {
        this.addToCart(this.currentInspectingProduct, this.selectedVariant);
        this.closeModals();
      }
    });

    // Network selector
    this.networkOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        this.networkOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.selectedNetwork = opt.dataset.network;
      });
    });

    // Paystack Trigger
    this.paystackTriggerBtn.addEventListener('click', () => this.startPaystackMoMo());

    // Simulate MoMo Approval
    this.simulateMomoApproveBtn.addEventListener('click', () => this.completeMoMoPayment());

    // Minimap toggle
    if (this.minimapToggleBtn) {
      this.minimapToggleBtn.addEventListener('click', () => {
        this.minimapContainer.classList.toggle('hidden');
      });
    }

    // Radio
    if (this.radioPlayBtn) {
      this.radioPlayBtn.addEventListener('click', () => this.toggleRadio());
      this.radioPrevBtn.addEventListener('click', () => this.changeStation(-1));
      this.radioNextBtn.addEventListener('click', () => this.changeStation(1));
      this.radioVolSlider.addEventListener('input', () => this.setRadioVolume());
    }

    // Wardrobe
    if (this.wardrobeBtn) {
      this.wardrobeBtn.addEventListener('click', () => this.openWardrobeModal());
      this.wardrobeModalClose.addEventListener('click', () => this.closeModals());
    }

    // Skin card selection
    document.querySelectorAll('.skin-card').forEach(card => {
      card.addEventListener('click', () => this.selectSkin(card));
    });

    // Upgrade buy buttons
    document.querySelectorAll('.upgrade-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => this.buyUpgrade(btn));
    });

    // Orders tracker
    if (this.ordersBtn) {
      this.ordersBtn.addEventListener('click', () => this.openOrdersModal());
      this.ordersModalClose.addEventListener('click', () => this.closeModals());
    }

    // Search
    if (this.hudSearchInput) {
      this.hudSearchInput.addEventListener('input', () => this.onSearchInput());
      this.hudSearchInput.addEventListener('blur', () => {
        setTimeout(() => { this.searchResultsDropdown.style.display = 'none'; }, 200);
      });
    }

    // Product uploader
    if (this.addProductModalClose) {
      this.addProductModalClose.addEventListener('click', () => this.closeModals());
    }
    if (this.npPublishBtn) {
      this.npPublishBtn.addEventListener('click', () => this.publishNewProduct());
    }
    if (this.npColorRow) {
      this.npColorRow.querySelectorAll('.color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          this.npColorRow.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');
          this.selectedProductColor = sw.dataset.color;
        });
      });
    }

    // Merchant Portal — Add Product button (appended dynamically)
    document.addEventListener('click', (e) => {
      if (e.target.id === 'open-add-product-btn') {
        this.closeModals();
        this.addProductModal.classList.add('active');
      }
    });

    // Minimap toggle (expand / collapse on mobile)
    if (this.minimapToggleBtn && this.minimapContainer) {
      const toggleMinimap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.minimapContainer.classList.toggle('collapsed');
      };
      this.minimapToggleBtn.addEventListener('click', toggleMinimap);
      this.minimapToggleBtn.addEventListener('touchstart', toggleMinimap, { passive: false });
    }

    // Mobile Search toggle
    if (this.mobileSearchBtn && this.hudSearchWrap) {
      this.mobileSearchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hudSearchWrap.classList.toggle('mobile-open');
        if (this.hudSearchWrap.classList.contains('mobile-open') && this.hudSearchInput) {
          this.hudSearchInput.focus();
        }
      });
    }

    // Mobile Radio toggle
    if (this.mobileRadioBtn && this.radioWidget) {
      this.mobileRadioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.radioWidget.classList.toggle('mobile-open');
        this.toggleRadio();
      });
    }

    // Mobile Action Button (Right Thumb Ergonomics)
    if (this.mobileActionBtn) {
      const triggerAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.game.currentTrigger) {
          this.game.interactCurrentTrigger();
        } else {
          this.game.triggerSprintBoost();
          if (this.mobileActionLabel) {
            const old = this.mobileActionLabel.textContent;
            this.mobileActionLabel.textContent = "BOOST!";
            setTimeout(() => {
              if (!this.game.currentTrigger && this.mobileActionLabel) {
                this.mobileActionLabel.textContent = old;
              }
            }, 1000);
          }
        }
      };
      this.mobileActionBtn.addEventListener('touchstart', triggerAction, { passive: false });
      this.mobileActionBtn.addEventListener('click', triggerAction);
    }
  }

  handleProximity(trigger) {
    if (!trigger) {
      this.proximityBanner.classList.add('hidden');
      if (this.mobileActionBtn) {
        this.mobileActionBtn.classList.remove('active-trigger', 'action-stall', 'action-checkout', 'action-product', 'action-exit');
        if (this.mobileActionIcon) this.mobileActionIcon.textContent = '⚡';
        if (this.mobileActionLabel) this.mobileActionLabel.textContent = 'SPRINT';
      }
      return;
    }

    this.proximityBanner.classList.remove('hidden');

    if (this.mobileActionBtn) {
      this.mobileActionBtn.classList.add('active-trigger');
      this.mobileActionBtn.classList.remove('action-stall', 'action-checkout', 'action-product', 'action-exit');
    }

    if (trigger.type === 'exit_door') {
      this.promptMainText.textContent = `🚪 Exit Ready Mall?`;
      this.promptSubText.textContent = `Automatic Sliding Doors • Press E or Tap to Leave`;
      if (this.mobileActionBtn) {
        this.mobileActionBtn.classList.add('action-exit');
        if (this.mobileActionIcon) this.mobileActionIcon.textContent = '🚪';
        if (this.mobileActionLabel) this.mobileActionLabel.textContent = 'EXIT';
      }
    } else if (trigger.type === 'stall_catalog') {
      const s = trigger.store;
      this.promptMainText.textContent = `Browse ${s.name} (${s.stallNumber})`;
      this.promptSubText.textContent = `GTA Cylinder Activated • Press E or Tap to view full stall menu!`;
      if (this.mobileActionBtn) {
        this.mobileActionBtn.classList.add('action-stall');
        if (this.mobileActionIcon) this.mobileActionIcon.textContent = '🛍️';
        if (this.mobileActionLabel) this.mobileActionLabel.textContent = 'SHOP';
      }
    } else if (trigger.type === 'product') {
      const p = trigger.product;
      const store = this.stores.find(s => s.id === p.storeId);
      const stallLabel = store ? `${store.name} (${store.stallNumber})` : 'Mall Stall';
      this.promptMainText.textContent = `Inspect ${p.name}`;
      this.promptSubText.textContent = `${stallLabel} • GHS ${p.price.toFixed(2)} • Tap to inspect & stack`;
      if (this.mobileActionBtn) {
        this.mobileActionBtn.classList.add('action-product');
        if (this.mobileActionIcon) this.mobileActionIcon.textContent = '📦';
        if (this.mobileActionLabel) this.mobileActionLabel.textContent = 'PICK';
      }
    } else if (trigger.type === 'checkout') {
      this.promptMainText.textContent = `Accra Mall Cashier Counter`;
      const count = this.cart.length;
      this.promptSubText.textContent = count > 0 
        ? `You have ${count} item(s) in stack. Tap to Pay with MoMo!`
        : `Empty stack. Pick up items from the shelves first!`;
      if (this.mobileActionBtn) {
        this.mobileActionBtn.classList.add('action-checkout');
        if (this.mobileActionIcon) this.mobileActionIcon.textContent = '💳';
        if (this.mobileActionLabel) this.mobileActionLabel.textContent = 'PAY';
      }
    }
  }

  openProductModal(product) {
    this.currentInspectingProduct = product;
    const store = this.stores.find(s => s.id === product.storeId) || this.stores[0];

    this.modalProdImg.src = product.image;
    this.modalStoreIcon.textContent = store.icon;
    this.modalStoreName.textContent = store.name;
    if (this.modalStallBadge) {
      this.modalStallBadge.textContent = store.stallNumber || 'Stall';
      this.modalStallBadge.style.borderColor = store.hexColor || 'var(--primary)';
      this.modalStallBadge.style.color = store.hexColor || '#fff';
    }
    this.modalProdName.textContent = product.name;
    this.modalProdPrice.textContent = product.price.toFixed(2);
    this.modalProdStock.textContent = `${product.stock} in stock`;
    this.modalProdDesc.textContent = product.description;

    // Render variants
    this.modalVariantChips.innerHTML = '';
    if (product.variants && product.variants.length > 0) {
      this.selectedVariant = product.variants[0];
      product.variants.forEach((v, idx) => {
        const chip = document.createElement('div');
        chip.className = `variant-chip ${idx === 0 ? 'active' : ''}`;
        chip.textContent = v;
        chip.addEventListener('click', () => {
          document.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.selectedVariant = v;
          sound.playPickup();
        });
        this.modalVariantChips.appendChild(chip);
      });
    }

    this.productModal.classList.add('active');
  }

  addToCart(product, variant) {
    if (this.cart.length >= 6) {
      alert("Your character is carrying maximum boxes! Walk to the cashier counter to checkout.");
      return;
    }

    this.cart.push({
      ...product,
      cartId: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      chosenVariant: variant
    });

    sound.playPickup();
    this.updateCartUI();
    this.game.updateStackedBoxes(this.cart);
  }

  removeFromCart(cartId) {
    this.cart = this.cart.filter(item => item.cartId !== cartId);
    sound.playPickup();
    this.updateCartUI();
    this.game.updateStackedBoxes(this.cart);
    this.renderCartItems();
  }

  updateCartUI() {
    const total = this.cart.reduce((sum, item) => sum + item.price, 0);
    this.cartCounter.textContent = this.cart.length;
    this.cartTotalBadge.textContent = `GHS ${total.toFixed(0)}`;
    this.payButtonLabel.textContent = `Pay GHS ${total.toFixed(2)} with ${this.selectedNetwork}`;
  }

  openCheckout() {
    sound.playCounterDing();
    this.renderCartItems();
    this.updateCartUI();
    this.checkoutModal.classList.add('active');
  }

  renderCartItems() {
    this.cartItemsContainer.innerHTML = '';

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 25px; color: var(--text-muted); font-size: 0.88rem;">
          🛒 Character hands are empty!<br/>Walk to any store shelf and tap to pick up items.
        </div>
      `;
      this.paystackTriggerBtn.disabled = true;
      this.paystackTriggerBtn.style.opacity = '0.5';
      return;
    }

    this.paystackTriggerBtn.disabled = false;
    this.paystackTriggerBtn.style.opacity = '1';

    this.cart.forEach(item => {
      const store = this.stores.find(s => s.id === item.storeId) || { name: 'Mall Merchant', stallNumber: '' };
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-sub">${store.name} (${store.stallNumber}) • GHS ${item.price.toFixed(2)} ${item.chosenVariant ? '• ' + item.chosenVariant : ''}</div>
        </div>
        <button class="cart-remove-btn" title="Remove">✕</button>
      `;
      el.querySelector('.cart-remove-btn').addEventListener('click', () => {
        this.removeFromCart(item.cartId);
      });
      this.cartItemsContainer.appendChild(el);
    });
  }

  startPaystackMoMo() {
    if (this.cart.length === 0) return;

    const phone = this.custPhoneInput.value.trim();
    const name = this.custNameInput.value.trim();
    const address = this.custAddressInput.value.trim();

    if (!phone || !name || !address) {
      alert("Please fill in your name, MoMo phone, and delivery address.");
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + item.price, 0);

    // Populate Paystack modal
    this.paystackModalAmount.textContent = total.toFixed(2);
    this.paystackModalPhone.textContent = phone;

    // Transition modals
    this.checkoutModal.classList.remove('active');
    this.paystackModal.classList.add('active');

    sound.playCounterDing();
  }

  completeMoMoPayment() {
    const total = this.cart.reduce((sum, item) => sum + item.price, 0);
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const store = this.stores.find(s => s.id === this.cart[0].storeId) || this.stores[0];

    // Create order record (merchant view)
    const newOrder = {
      id: orderId,
      customerName: this.custNameInput.value.trim(),
      phone: this.custPhoneInput.value.trim(),
      address: this.custAddressInput.value.trim(),
      storeId: store.id,
      storeName: store.name,
      items: this.cart.map(i => ({ name: i.name, qty: 1, price: i.price })),
      total: total,
      status: 'paid',
      fulfillment: 'preparing',
      network: this.selectedNetwork,
      reference: 'PAY-GH-' + Math.floor(10000 + Math.random() * 90000),
      time: 'Just now'
    };

    this.orders.unshift(newOrder);

    // Save order to Firestore Database
    placeOrder(newOrder).catch(err => {
      console.warn("Could not persist order to Firestore:", err);
    });

    // Create customer order tracker entry
    const trackerOrder = {
      id: orderId,
      storeName: store.name,
      storeIcon: store.icon || '🏬',
      total: total,
      address: this.custAddressInput.value.trim(),
      items: this.cart.map(i => i.name),
      // Stepper: 0=payment, 1=packaging, 2=rider, 3=delivered
      currentStep: 1, // start at packaging
      startTime: Date.now()
    };
    this.myOrders.unshift(trackerOrder);

    // Award Ready Coins (5 per GHS spent)
    const coinsEarned = Math.floor(total / 10);
    this.readyCoins += coinsEarned;

    // Decrement stock in data & Firestore Database
    this.cart.forEach(cartItem => {
      const prod = this.products.find(p => p.id === cartItem.id);
      if (prod && prod.stock > 0) {
        prod.stock--;
        updateProductStock(prod.id, prod.stock);
      }
    });

    // Clear cart and game stack
    this.cart = [];
    this.updateCartUI();
    this.game.updateStackedBoxes([]);

    // Update orders badge
    this.updateOrdersBadge();

    // Close Paystack modal
    this.paystackModal.classList.remove('active');

    // SFX & Confetti Celebration
    sound.playCashRegister();
    sound.playFanfare();

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
    });

    // Advance delivery stepper over time (simulated)
    this.simulateDeliveryProgress(trackerOrder);

    // Success notification
    alert(`🎉 MoMo Payment Successful!\n\nOrder #${orderId} has been sent to ${store.name}.\nReceipt Reference: ${newOrder.reference}\n+${coinsEarned} Ready Coins earned!\nDelivery to: ${newOrder.address}`);

    this.renderMerchantOrders();
  }

  simulateDeliveryProgress(order) {
    // Step through: Packaging → Rider → Delivered
    const steps = [1, 2, 3];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        order.currentStep = step;
      }, (idx + 1) * 12000); // every 12 seconds
    });
  }

  updateOrdersBadge() {
    const active = this.myOrders.filter(o => o.currentStep < 3).length;
    if (this.ordersBadge) {
      if (active > 0) {
        this.ordersBadge.textContent = active;
        this.ordersBadge.classList.remove('hidden');
      } else {
        this.ordersBadge.classList.add('hidden');
      }
    }
  }

  openMerchantModal() {
    sound.playCounterDing();
    this.renderMerchantTabs();
    this.renderMerchantOrders();
    this.merchantModal.classList.add('active');
  }

  renderMerchantTabs() {
    this.merchantStoreTabs.innerHTML = '';
    this.stores.forEach(store => {
      const chip = document.createElement('div');
      chip.className = `variant-chip ${store.id === this.selectedStoreId ? 'active' : ''}`;
      chip.textContent = `${store.icon} ${store.name} (${store.stallNumber})`;
      chip.addEventListener('click', () => {
        this.selectedStoreId = store.id;
        this.renderMerchantTabs();
        this.renderMerchantOrders();
      });
      this.merchantStoreTabs.appendChild(chip);
    });

    // Populate Add Product stall select dropdown with all 20 stores
    const npStallSelect = document.getElementById('np-stall');
    if (npStallSelect && npStallSelect.children.length !== this.stores.length) {
      npStallSelect.innerHTML = this.stores.map(s => 
        `<option value="${s.id}">${s.icon} ${s.name} (${s.stallNumber})</option>`
      ).join('');
    }
  }

  renderMerchantOrders() {
    const storeOrders = this.orders.filter(o => o.storeId === this.selectedStoreId);
    const totalSales = storeOrders.reduce((sum, o) => sum + o.total, 0);

    this.statRevenue.textContent = `GHS ${totalSales.toFixed(0)}`;
    this.statOrdersCount.textContent = storeOrders.length;

    this.merchantOrdersList.innerHTML = '';

    if (storeOrders.length === 0) {
      this.merchantOrdersList.innerHTML = `
        <div style="text-align: center; padding: 25px; color: var(--text-muted); font-size: 0.85rem;">
          No orders received yet for this store today.
        </div>
      `;
      return;
    }

    storeOrders.forEach(o => {
      const el = document.createElement('div');
      el.className = 'order-card';
      
      const itemsDesc = o.items.map(i => `${i.qty}x ${i.name}`).join(', ');
      
      // Prefilled WhatsApp Rider dispatch text
      const waMsg = encodeURIComponent(
        `Hello dispatch! New ReadyMall Order ${o.id}.\nPick up at: ${o.storeName}\nDeliver to: ${o.customerName} (${o.phone})\nAddress: ${o.address}\nItems: ${itemsDesc}\nTotal: GHS ${o.total.toFixed(2)} (PAID VIA ${o.network.toUpperCase()}).`
      );

      el.innerHTML = `
        <div class="order-header">
          <span class="order-id">${o.id}</span>
          <span class="order-badge badge-paid">${o.status} • ${o.network}</span>
        </div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 4px;">${itemsDesc}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">
          Customer: <b>${o.customerName}</b> (${o.phone}) • ${o.time}
        </div>
        <div style="font-size: 0.8rem; color: #38bdf8; margin-bottom: 8px;">
          📍 ${o.address}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.05rem; font-weight: 800; font-family: 'Outfit'; color: var(--primary);">
            GHS ${o.total.toFixed(2)}
          </div>
          <a class="whatsapp-dispatch-btn" href="https://wa.me/?text=${waMsg}" target="_blank">
            💬 Dispatch Rider via WhatsApp
          </a>
        </div>
      `;
      this.merchantOrdersList.appendChild(el);
    });
  }

  closeModals() {
    this.productModal.classList.remove('active');
    this.checkoutModal.classList.remove('active');
    this.paystackModal.classList.remove('active');
    this.merchantModal.classList.remove('active');
    this.stallCatalogModal.classList.remove('active');
    this.exitModal.classList.remove('active');
    if (this.wardrobeModal) this.wardrobeModal.classList.remove('active');
    if (this.ordersModal) this.ordersModal.classList.remove('active');
    if (this.addProductModal) this.addProductModal.classList.remove('active');
  }

  openExitPrompt() {
    if (this.cart.length > 0) {
      this.exitModalMsg.innerHTML = `⚠️ You are carrying <b style="color:var(--primary);">${this.cart.length} unpaid item(s)</b> in your hands!<br/><span style="color:#f87171;">Leaving the mall now will drop your stack.</span><br/>Are you sure you want to leave?`;
    } else {
      this.exitModalMsg.innerHTML = `Are you ready to exit Ready Mall to Accra City?<br/>Your paid orders remain saved with the shop owners.`;
    }
    this.exitModal.classList.add('active');
  }

  confirmExitGame() {
    this.closeModals();
    sound.playExitDoorSound();

    // Drop unpaid items
    this.cart = [];
    this.game.updateStackedBoxes([]);
    this.updateCartUI();

    // Stats calculation
    const paidOrders = this.orders.filter(o => o.status === 'paid');
    const totalSpent = paidOrders.reduce((sum, o) => sum + o.total, 0);

    this.exitStatOrders.textContent = paidOrders.length;
    this.exitStatSpent.textContent = `GHS ${totalSpent.toFixed(0)}`;

    // Show exit screen
    this.gameExitScreen.classList.remove('hidden');
  }

  reenterMall() {
    this.gameExitScreen.classList.add('hidden');
    this.game.teleportToRoom('lobby');
    sound.playPickup();
  }

  openStallCatalog(store) {
    this.catalogStallNum.textContent = store.stallNumber || 'STALL';
    this.catalogStoreName.textContent = store.name;
    this.catalogStoreTagline.textContent = store.tagline || 'Curated goods in Accra';
    this.catalogOwnerName.textContent = store.owner || 'Accra Merchant';
    this.catalogWhatsappLink.href = `https://wa.me/${(store.whatsapp || '').replace(/[^0-9]/g, '')}`;

    if (store.hexColor) {
      this.catalogHeaderBanner.style.background = `linear-gradient(135deg, ${store.hexColor}33 0%, rgba(15, 23, 42, 0.95) 100%)`;
      this.catalogHeaderBanner.style.borderBottomColor = store.hexColor;
    }

    // Find all products for this stall
    const stallProducts = this.products.filter(p => p.storeId === store.id);
    this.catalogProductsCount.textContent = `${stallProducts.length} Product${stallProducts.length === 1 ? '' : 's'}`;

    this.catalogProductsGrid.innerHTML = '';

    stallProducts.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'catalog-product-card';

      let chosenVariant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : null;

      card.innerHTML = `
        <img class="catalog-card-img" src="${prod.image}" alt="${prod.name}" />
        <div class="catalog-card-title">${prod.name}</div>
        <div class="catalog-card-desc">${prod.description}</div>
        <div class="catalog-card-variants">
          ${(prod.variants || []).map((v, i) => `<span class="catalog-variant-chip ${i === 0 ? 'active' : ''}" data-val="${v}">${v}</span>`).join('')}
        </div>
        <div class="catalog-card-price-row">
          <span class="catalog-card-price">GHS ${prod.price.toFixed(2)}</span>
          <span class="catalog-card-stock">${prod.stock} in stock</span>
        </div>
        <button class="btn-card-add-stack">
          <span>📦</span> Pick Up & Stack
        </button>
      `;

      // Variant selection
      const variantChips = card.querySelectorAll('.catalog-variant-chip');
      variantChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          variantChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          chosenVariant = chip.dataset.val;
          sound.playPickup();
        });
      });

      // Add to Stack button
      const addBtn = card.querySelector('.btn-card-add-stack');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToCart(prod, chosenVariant);
        this.updateCatalogStackSummary();
      });

      this.catalogProductsGrid.appendChild(card);
    });

    this.updateCatalogStackSummary();
    this.stallCatalogModal.classList.add('active');
  }

  updateCatalogStackSummary() {
    const total = this.cart.reduce((sum, item) => sum + item.price, 0);
    this.catalogCarriedCount.textContent = `${this.cart.length} item${this.cart.length === 1 ? '' : 's'}`;
    this.catalogCarriedTotal.textContent = `GHS ${total.toFixed(0)}`;
  }

  initJoystick() {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let touchIdentifier = null;
    const maxRadius = 45;

    const handleStart = (clientX, clientY) => {
      isDragging = true;
      const rect = this.joystickZone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      this.joystickZone.classList.add('active');
      handleMove(clientX, clientY);
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const boundedDist = Math.min(dist, maxRadius);
      const knobX = Math.cos(angle) * boundedDist;
      const knobY = Math.sin(angle) * boundedDist;

      this.joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

      // Pass normalized movement vector to game
      this.game.setJoystickVector(knobX / maxRadius, knobY / maxRadius);
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      touchIdentifier = null;
      this.joystickZone.classList.remove('active');
      this.joystickKnob.style.transform = `translate(0px, 0px)`;
      this.game.setJoystickVector(0, 0);
    };

    // Touch events for mobile with identifier tracking for multi-touch reliability
    this.joystickZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      touchIdentifier = touch.identifier;
      handleStart(touch.clientX, touch.clientY);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdentifier) {
          handleMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdentifier) {
          handleEnd();
          break;
        }
      }
    });

    window.addEventListener('touchcancel', () => handleEnd());

    // Mouse events for desktop testing of joystick
    this.joystickZone.addEventListener('mousedown', (e) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => handleEnd());
  }

  /* ============================================================
   FEATURE 1B: RADAR MINIMAP
   ============================================================ */
  initMinimap() {
    if (!this.minimapCtx) return;
    this.drawMinimap();
    // Refresh minimap at 10fps to not overload GPU
    setInterval(() => this.drawMinimap(), 100);
  }

  drawMinimap() {
    const ctx = this.minimapCtx;
    const W = 160, H = 160;
    const CX = W / 2, CY = H / 2;

    // World bounds: x [-29.5, 29.5], z [-26.5, 22.5]
    const worldW = 59, worldH = 49;
    const scale = Math.min(W / worldW, H / worldH) * 0.82;

    const toMap = (wx, wz) => ({
      x: CX + wx * scale,
      y: CY + wz * scale
    });

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(9,13,22,0.95)';
    ctx.beginPath();
    ctx.arc(CX, CY, W / 2, 0, Math.PI * 2);
    ctx.fill();

    // District zones
    const zones = [
      { x: -13, z: -13, w: 24, h: 24, color: 'rgba(244,63,94,0.2)', label: '👟' },
      { x: 15, z: -13, w: 20, h: 24, color: 'rgba(56,189,248,0.2)', label: '📱' },
      { x: -15, z: 12, w: 20, h: 20, color: 'rgba(16,185,129,0.2)', label: '🛒' },
      { x: 15, z: 12, w: 20, h: 20, color: 'rgba(245,158,11,0.2)', label: '🍔' },
    ];

    zones.forEach(zone => {
      const tl = toMap(zone.x - zone.w / 2, zone.z - zone.h / 2);
      const br = toMap(zone.x + zone.w / 2, zone.z + zone.h / 2);
      ctx.fillStyle = zone.color;
      ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    });

    // Walkways
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    const vWalk = toMap(-4, -26.5), vWalk2 = toMap(4, 22.5);
    ctx.fillRect(vWalk.x, vWalk.y, vWalk2.x - vWalk.x, vWalk2.y - vWalk.y);
    const hWalk = toMap(-29.5, -4), hWalk2 = toMap(29.5, 4);
    ctx.fillRect(hWalk.x, hWalk.y, hWalk2.x - hWalk.x, hWalk2.y - hWalk.y);

    // Stall dots
    const stallDots = [
      { x: -18, z: -19, color: '#ef4444', label: 'S1' },
      { x: -8, z: -19, color: '#ec4899', label: 'S2' },
      { x: -18, z: -8, color: '#06b6d4', label: 'S3' },
      { x: -8, z: -8, color: '#f59e0b', label: 'S4' },
      { x: 10, z: -15, color: '#3b82f6', label: 'E1' },
      { x: 20, z: -15, color: '#8b5cf6', label: 'E2' },
      { x: -15, z: 13, color: '#10b981', label: 'G1' },
      { x: 15, z: 13, color: '#f97316', label: 'F1' },
      { x: 0, z: 7.5, color: '#fbbf24', label: '💳' }, // cashier
      { x: 0, z: 22, color: '#22c55e', label: '🚪' },  // exit
    ];

    stallDots.forEach(dot => {
      const mp = toMap(dot.x, dot.z);
      // Check if inside circle
      if (Math.hypot(mp.x - CX, mp.y - CY) > W / 2 - 4) return;

      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = 'bold 5px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dot.label, mp.x, mp.y - 5);
    });

    // Player dot (pulsing)
    if (this.game && this.game.playerGroup) {
      const px = this.game.playerGroup.position.x;
      const pz = this.game.playerGroup.position.z;
      const pp = toMap(px, pz);

      if (Math.hypot(pp.x - CX, pp.y - CY) < W / 2 - 3) {
        // Pulse ring
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
        ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, 6 + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Player dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Circular clip mask outline
    ctx.strokeStyle = 'rgba(245,158,11,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CX, CY, W / 2 - 1, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* ============================================================
   FEATURE 4: MALL RADIO WIDGET
   ============================================================ */
  initRadio() {
    if (this.radioStationName) {
      this.radioStationName.textContent = this.radioStations[0].name;
    }
  }

  toggleRadio() {
    this.radioPlaying = !this.radioPlaying;
    if (this.radioPlayBtn) {
      this.radioPlayBtn.textContent = this.radioPlaying ? '⏸' : '▶';
    }
    if (this.radioPlaying) {
      this.startRadioAudio();
    } else {
      this.stopRadioAudio();
    }
  }

  startRadioAudio() {
    try {
      const ctx = sound.ctx;
      if (!ctx) return;
      this.radioGainNode = ctx.createGain();
      this.radioGainNode.gain.value = parseFloat(this.radioVolSlider ? this.radioVolSlider.value : 0.4);
      this.radioGainNode.connect(ctx.destination);

      // Generate a pleasant ambient looping chord using oscillators
      const station = this.radioStations[this.radioIndex];
      const chordFreqs = {
        'Accra Vibes FM': [261.6, 329.6, 392.0, 523.3], // C major
        'Highlife Radio': [293.7, 370.0, 440.0, 587.3],  // D major
        'Mall Chill Beats': [220.0, 293.7, 349.2, 440.0], // A minor
        'Accra City FM': [349.2, 440.0, 523.3, 698.5]    // F major
      };
      const freqs = chordFreqs[station.name] || chordFreqs['Accra Vibes FM'];

      this.radioOscillators = freqs.map((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        oscGain.gain.value = 0.06;

        // Gentle amplitude tremolo
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.5 + i * 0.12;
        lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(this.radioGainNode);
        osc.start();
        return { osc, lfo };
      });
    } catch(e) { console.warn('Radio audio error:', e); }
  }

  stopRadioAudio() {
    try {
      if (this.radioOscillators) {
        this.radioOscillators.forEach(({ osc, lfo }) => {
          osc.stop();
          lfo.stop();
        });
        this.radioOscillators = [];
      }
      if (this.radioGainNode) {
        this.radioGainNode.disconnect();
        this.radioGainNode = null;
      }
    } catch(e) {}
  }

  changeStation(dir) {
    this.stopRadioAudio();
    this.radioIndex = (this.radioIndex + dir + this.radioStations.length) % this.radioStations.length;
    if (this.radioStationName) {
      this.radioStationName.textContent = this.radioStations[this.radioIndex].name;
    }
    if (this.radioPlaying) this.startRadioAudio();
  }

  setRadioVolume() {
    if (this.radioGainNode) {
      this.radioGainNode.gain.value = parseFloat(this.radioVolSlider.value);
    }
  }

  /* ============================================================
   FEATURE 6: GLOBAL SEARCH
   ============================================================ */
  initSearch() {}

  onSearchInput() {
    const q = this.hudSearchInput.value.trim().toLowerCase();
    const dropdown = this.searchResultsDropdown;

    if (!q || q.length < 2) {
      dropdown.style.display = 'none';
      return;
    }

    const results = [];

    // Search products
    this.products.forEach(p => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.variants || []).some(v => v.toLowerCase().includes(q))
      ) {
        const store = this.stores.find(s => s.id === p.storeId);
        results.push({ type: 'product', item: p, store });
      }
    });

    // Search stores
    this.stores.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.tagline || '').toLowerCase().includes(q)) {
        results.push({ type: 'store', item: s });
      }
    });

    if (results.length === 0) {
      dropdown.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:0.8rem;">No results found</div>';
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = results.slice(0, 6).map(r => {
      if (r.type === 'product') {
        const store = r.store;
        return `<div class="search-result-item" data-type="product" data-store-id="${r.item.storeId}">
          <div class="search-result-icon">${store ? store.icon : '📦'}</div>
          <div class="search-result-info">
            <div class="search-result-name">${r.item.name}</div>
            <div class="search-result-store">${store ? store.name + ' • ' + store.stallNumber : ''}</div>
          </div>
          <div class="search-result-price">GHS ${r.item.price.toFixed(0)}</div>
          <button class="search-result-goto">Go ➜</button>
        </div>`;
      } else {
        return `<div class="search-result-item" data-type="store" data-room="${r.item.zone || 'shoes'}">
          <div class="search-result-icon">${r.item.icon}</div>
          <div class="search-result-info">
            <div class="search-result-name">${r.item.name}</div>
            <div class="search-result-store">${r.item.stallNumber || ''} ${r.item.tagline ? '• ' + r.item.tagline : ''}</div>
          </div>
          <button class="search-result-goto">Go ➜</button>
        </div>`;
      }
    }).join('');

    dropdown.style.display = 'block';

    // Bind click events
    dropdown.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const storeId = item.dataset.storeId;
        const room = item.dataset.room;
        dropdown.style.display = 'none';
        this.hudSearchInput.value = '';

        if (storeId) {
          // Find which room zone this store belongs to
          const store = this.stores.find(s => s.id === storeId);
          if (store && store.zone) this.game.teleportToRoom(store.zone);
        } else if (room) {
          this.game.teleportToRoom(room);
        }
        sound.playPickup();
      });
    });
  }

  /* ============================================================
   FEATURE 3: CHARACTER WARDROBE
   ============================================================ */
  openWardrobeModal() {
    if (this.readyCoinsVal) this.readyCoinsVal.textContent = this.readyCoins;
    this.drawAvatarPreview();
    this.wardrobeModal.classList.add('active');
  }

  drawAvatarPreview() {
    const ctx = this.avatarCtx;
    if (!ctx) return;
    const color = this.currentSkin.color;
    ctx.clearRect(0, 0, 120, 180);

    // Background
    ctx.fillStyle = 'rgba(15,23,42,1)';
    ctx.fillRect(0, 0, 120, 180);

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(60, 170, 25, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(45, 110, 14, 45);
    ctx.fillRect(62, 110, 14, 45);

    // Shoes
    ctx.fillStyle = '#374151';
    ctx.fillRect(43, 150, 17, 8);
    ctx.fillRect(60, 150, 17, 8);

    // Torso
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(38, 68, 44, 46, 6);
    ctx.fill();

    // Arms
    ctx.fillStyle = color;
    ctx.fillRect(24, 70, 14, 36);
    ctx.fillRect(82, 70, 14, 36);

    // Head
    ctx.fillStyle = '#6b3f24';
    ctx.beginPath();
    ctx.arc(60, 52, 22, 0, Math.PI * 2);
    ctx.fill();

    // Cap
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(60, 40, 18, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(40, 39, 40, 7);

    // Cap brim
    ctx.fillRect(38, 43, 48, 5);

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(53, 54, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(67, 54, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(54, 55, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(68, 55, 2, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(60, 58, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  selectSkin(card) {
    const color = card.dataset.color;
    const skin = card.dataset.skin;
    const price = card.querySelector('.skin-price').textContent;
    const cost = parseInt(price.replace(/[^0-9]/g, '')) || 0;

    if (cost > 0 && this.readyCoins < cost) {
      alert(`Not enough Ready Coins! You need ${cost}🪙 but only have ${this.readyCoins}🪙.`);
      return;
    }

    if (cost > 0 && !card.dataset.owned) {
      this.readyCoins -= cost;
      card.dataset.owned = '1';
      card.querySelector('.skin-price').textContent = 'OWNED';
      if (this.readyCoinsVal) this.readyCoinsVal.textContent = this.readyCoins;
    }

    document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    this.currentSkin = { name: skin, color };

    // Apply to 3D character
    if (this.game && this.game.torso) {
      const hexColor = parseInt(color.replace('#', ''), 16);
      this.game.torso.material.color.setHex(hexColor);
      this.game.leftArm.material.color.setHex(hexColor);
      this.game.rightArm.material.color.setHex(hexColor);
    }

    this.drawAvatarPreview();
    sound.playPickup();
  }

  buyUpgrade(btn) {
    if (btn.classList.contains('bought')) return;
    const upgrade = btn.dataset.upgrade;
    const cost = parseInt(btn.dataset.cost);

    if (this.readyCoins < cost) {
      alert(`Not enough Ready Coins! You need ${cost}🪙.`);
      return;
    }

    this.readyCoins -= cost;
    this.upgrades[upgrade] = true;
    btn.textContent = '✓ Equipped';
    btn.classList.add('bought');
    if (this.readyCoinsVal) this.readyCoinsVal.textContent = this.readyCoins;

    // Apply upgrade to game
    if (upgrade === 'speed') {
      this.game.speed = 13; // +25% from base 10.5
    } else if (upgrade === 'stack') {
      this.game.maxStack = 8; // up from default 6 (handled in addToCart)
    }
    sound.playCashRegister();
  }

  /* ============================================================
   FEATURE 2: MY ORDERS DELIVERY TRACKER
   ============================================================ */
  openOrdersModal() {
    this.renderOrdersTracker();
    this.ordersModal.classList.add('active');
  }

  renderOrdersTracker() {
    if (!this.ordersTrackerList) return;
    this.ordersTrackerList.innerHTML = '';

    if (this.myOrders.length === 0) {
      if (this.ordersEmptyState) this.ordersEmptyState.style.display = 'block';
      return;
    }
    if (this.ordersEmptyState) this.ordersEmptyState.style.display = 'none';

    const stepDefs = [
      { icon: '✅', label: 'Payment Confirmed', sub: 'MTN MoMo authorized' },
      { icon: '📦', label: 'Stall Packaging', sub: (o) => `${o.storeName} is packing your order` },
      { icon: '🛵', label: 'Rider Dispatched', sub: 'Motorbike en route' },
      { icon: '🏠', label: 'Delivered', sub: (o) => `Delivered to ${o.address}` }
    ];

    this.myOrders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-tracker-card';

      const stepsHtml = stepDefs.map((step, idx) => {
        let stateClass;
        if (idx < order.currentStep) stateClass = 'done';
        else if (idx === order.currentStep) stateClass = 'active';
        else stateClass = 'pending';

        const sub = typeof step.sub === 'function' ? step.sub(order) : step.sub;
        const icon = stateClass === 'done' ? '✓' : (stateClass === 'active' ? step.icon : '○');

        return `<div class="stepper-step ${stateClass}">
          <div class="step-dot">${icon}</div>
          <div>
            <div class="step-label">${step.label}</div>
            <div class="step-sub">${sub}</div>
          </div>
        </div>`;
      }).join('');

      card.innerHTML = `
        <div class="order-tracker-header">
          <div>
            <div class="order-id-badge">#${order.id}</div>
          </div>
          <div style="text-align:right;">
            <div class="order-store-name">${order.storeIcon} ${order.storeName}</div>
            <div class="order-amount">GHS ${order.total.toFixed(2)} • ${order.items.length} item(s)</div>
          </div>
        </div>
        <div class="delivery-stepper">${stepsHtml}</div>
        ${order.currentStep < 3 ? `<div style="font-size:0.72rem;color:var(--text-muted);text-align:center;margin-top:4px;">Delivery in progress • Refreshes automatically</div>` : ''}
      `;
      this.ordersTrackerList.appendChild(card);
    });
  }

  /* ============================================================
   FEATURE 5: MERCHANT PRODUCT UPLOADER
   ============================================================ */
  publishNewProduct() {
    const name = document.getElementById('np-name').value.trim();
    const price = parseFloat(document.getElementById('np-price').value);
    const stock = parseInt(document.getElementById('np-stock').value);
    const desc = document.getElementById('np-desc').value.trim();
    const stall = document.getElementById('np-stall').value;
    const variants = document.getElementById('np-variants').value
      .split(',').map(v => v.trim()).filter(Boolean);

    if (!name || !price || !stock) {
      alert('Please fill in product name, price, and stock quantity.');
      return;
    }

    const newProduct = {
      id: 'prod-custom-' + Date.now(),
      storeId: stall,
      name,
      description: desc || 'Fresh product from our stall!',
      price,
      stock,
      variants: variants.length > 0 ? variants : undefined,
      boxColor: parseInt(this.selectedProductColor.replace('#',''), 16),
      image: 'https://via.placeholder.com/120x80/1e293b/f59e0b?text=' + encodeURIComponent(name.slice(0, 12))
    };

    // Add to products array
    this.products.push(newProduct);

    // Persist new product to Firestore Database
    addProduct(newProduct).catch(err => {
      console.warn("Could not save product to Firestore:", err);
    });

    // Show success
    if (this.npSuccessMsg) this.npSuccessMsg.classList.remove('hidden');
    setTimeout(() => { if (this.npSuccessMsg) this.npSuccessMsg.classList.add('hidden'); }, 4000);

    // Reset form
    document.getElementById('np-name').value = '';
    document.getElementById('np-price').value = '';
    document.getElementById('np-stock').value = '';
    document.getElementById('np-desc').value = '';
    document.getElementById('np-variants').value = '';

    sound.playCashRegister();
  }
}
