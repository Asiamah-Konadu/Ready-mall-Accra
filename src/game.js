import * as THREE from 'three';
import { PRODUCTS, STORES } from './data.js';
import { sound } from './sound.js';

export class MallGame {
  constructor(canvasContainer, onProximityChange, onOpenProduct, onOpenCheckout, onOpenStallCatalog, onOpenExitPrompt) {
    this.container = canvasContainer;
    this.onProximityChange = onProximityChange;
    this.onOpenProduct = onOpenProduct;
    this.onOpenCheckout = onOpenCheckout;
    this.onOpenStallCatalog = onOpenStallCatalog;
    this.onOpenExitPrompt = onOpenExitPrompt;

    // GTA Glowing Cylinders list
    this.glowingCylinders = [];

    // Movement state
    this.keys = { w: false, a: false, s: false, d: false, Up: false, Down: false, Left: false, Right: false };
    this.joystickVector = { x: 0, y: 0 };
    this.clickTarget = null;
    this.speed = 10.5;
    this.isMoving = false;

    // Cart / Carried boxes
    this.stackedBoxes = [];
    this.stackGroup = new THREE.Group();

    // Interaction triggers
    this.triggers = [];
    this.currentTrigger = null;

    // Three.js core
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.stepTimer = 0;

    this.initRenderer();
    this.initCamera();
    this.initLighting();
    this.buildMallEnvironment();
    this.buildSquareStalls();
    this.buildPlayer();
    this.buildTriggers();
    this.bindEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);
  }

  initCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;
    const isPortrait = aspect < 1;
    const fov = isPortrait ? 50 : 36;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.cameraOffset = isPortrait ? new THREE.Vector3(0, 24, 24) : new THREE.Vector3(0, 22, 22);
    this.camera.position.copy(this.cameraOffset);
    this.camera.lookAt(0, 0, 0);
  }

  initLighting() {
    this.scene.background = new THREE.Color(0x0f172a); // Deep twilight metropolitan sky
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.007); // Atmospheric city horizon haze

    // Warm ambient mall and city fill light
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    this.scene.add(ambientLight);

    // Main mall & surroundings sunlight / spotlight
    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.35);
    dirLight.position.set(35, 55, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 180;
    const d = 55;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Hemisphere light: gentle sky blue bounce + rich ground warmth
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x164e28, 0.45);
    this.scene.add(hemiLight);

    // Dedicated Shoe District Skylight
    const shoePlazaLight = new THREE.PointLight(0xf43f5e, 1.8, 32);
    shoePlazaLight.position.set(-13, 8, -13);
    this.scene.add(shoePlazaLight);

    // Tech District Skylight
    const techLight = new THREE.PointLight(0x38bdf8, 1.8, 32);
    techLight.position.set(15, 8, -13);
    this.scene.add(techLight);

    // Food & Market Skylights
    const foodLight = new THREE.PointLight(0xf59e0b, 1.6, 26);
    foodLight.position.set(15, 8, 12);
    this.scene.add(foodLight);

    const grocLight = new THREE.PointLight(0x10b981, 1.6, 26);
    grocLight.position.set(-15, 8, 12);
    this.scene.add(grocLight);
  }

  buildMallEnvironment() {
    // 1. Grand Polished Concourse Floor
    const floorGeo = new THREE.PlaneGeometry(74, 74);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.22,
      metalness: 0.08
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Commodity Zone Floor Pavements
    this.createZonePavement(-13, -13, 24, 24, 0xfff1f2, "👟 SHOE & SNEAKER DISTRICT");
    this.createZonePavement(15, -13, 20, 24, 0xf0f9ff, "📱 TECH & GADGET ALLEY");
    this.createZonePavement(-15, 12, 20, 20, 0xecfdf5, "🛒 GROCERIES BAZAAR");
    this.createZonePavement(15, 12, 20, 20, 0xfffbeb, "🍔 FOOD COURT");

    // Central Concourse Walkways
    const walkwayMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 });
    const walkwayV = new THREE.Mesh(new THREE.PlaneGeometry(8, 60), walkwayMat);
    walkwayV.rotation.x = -Math.PI / 2;
    walkwayV.position.y = 0.01;
    walkwayV.receiveShadow = true;
    this.scene.add(walkwayV);

    const walkwayH = new THREE.Mesh(new THREE.PlaneGeometry(60, 8), walkwayMat);
    walkwayH.rotation.x = -Math.PI / 2;
    walkwayH.position.y = 0.01;
    walkwayH.receiveShadow = true;
    this.scene.add(walkwayH);

    // Outer Mall Panoramic Glass Walls
    this.buildOuterWalls();

    // Central Fountain & Indoor Palms
    this.buildLobbyDecor();

    // Cashier Checkout Counter
    this.buildCashierCounter();

    // Grand Automatic Exit Door Portal (Leaves Mall to Accra City)
    this.buildExitPortal();

    // Outer World Surroundings: City Skyline, Roads, Palms, Billboards
    this.buildSurroundings();

    // Interior Concourse Planters & Benches
    this.buildInteriorGreenery();
  }

  createZonePavement(x, z, w, d, hexColor, label) {
    const geo = new THREE.PlaneGeometry(w, d);
    const mat = new THREE.MeshStandardMaterial({
      color: hexColor,
      roughness: 0.3,
      metalness: 0.05
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.02, z);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  buildOuterWalls() {
    // Modern Architectural Glass Curtain Walls - allows looking out at the city & palms!
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.25,
      roughness: 0.08,
      metalness: 0.85
    });
    const mullionMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });

    const createGlassWall = (length, isHorizontal, x, z) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Lower concrete curb
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 0.8, 0.8, isHorizontal ? 0.8 : length),
        curbMat
      );
      curb.position.y = 0.4;
      curb.castShadow = true;
      group.add(curb);

      // Transparent glass sheet
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 0.12, 4.2, isHorizontal ? 0.12 : length),
        glassMat
      );
      glass.position.y = 2.9;
      group.add(glass);

      // Top steel beam
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 0.5, 0.4, isHorizontal ? 0.5 : length),
        mullionMat
      );
      beam.position.y = 5.0;
      beam.castShadow = true;
      group.add(beam);

      // Vertical steel pillars every 6m
      const count = Math.floor(length / 6);
      for (let i = 0; i <= count; i++) {
        const offset = -length / 2 + (i / count) * length;
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 5.0, 12),
          mullionMat
        );
        pillar.position.set(isHorizontal ? offset : 0, 2.5, isHorizontal ? 0 : offset);
        pillar.castShadow = true;
        group.add(pillar);
      }

      this.scene.add(group);
    };

    // North Glass Wall
    createGlassWall(70, true, 0, -28);
    // South Glass Wall (Left & Right wings leaving 6m doorway in center for Exit Portal)
    createGlassWall(32, true, -19, 24);
    createGlassWall(32, true, 19, 24);
    // West Glass Wall
    createGlassWall(52, false, -31, -2);
    // East Glass Wall
    createGlassWall(52, false, 31, -2);
  }

  // BUILD GRAND AUTOMATIC GLASS EXIT DOOR PORTAL
  buildExitPortal() {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, 23.8);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.8
    });

    // Portal Jambs / Frame
    const jambLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.8, 0.6), metalMat);
    jambLeft.position.set(-2.8, 2.4, 0);
    jambLeft.castShadow = true;
    portalGroup.add(jambLeft);

    const jambRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.8, 0.6), metalMat);
    jambRight.position.set(2.8, 2.4, 0);
    jambRight.castShadow = true;
    portalGroup.add(jambRight);

    // Overhead Header Beam
    const header = new THREE.Mesh(new THREE.BoxGeometry(6.1, 0.6, 0.6), metalMat);
    header.position.set(0, 4.5, 0);
    header.castShadow = true;
    portalGroup.add(header);

    // Double Sliding Glass Doors with handles
    const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.8, 0.1), glassMat);
    doorLeft.position.set(-1.25, 2.0, 0);
    portalGroup.add(doorLeft);

    const doorRight = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.8, 0.1), glassMat);
    doorRight.position.set(1.25, 2.0, 0);
    portalGroup.add(doorRight);

    // Door handles
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95 });
    [-0.2, 0.2].forEach(hx => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), handleMat);
      handle.position.set(hx, 1.8, 0.12);
      portalGroup.add(handle);
    });

    // Overhead Illuminated Neon EXIT Sign
    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.9, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0x15803d,
        emissive: 0x22c55e,
        emissiveIntensity: 0.9,
        roughness: 0.2
      })
    );
    signBox.position.set(0, 4.0, -0.2);
    signBox.castShadow = true;
    portalGroup.add(signBox);

    // Motion Sensor with Green LED Light
    const sensor = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.25, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    sensor.position.set(0, 3.4, -0.2);
    portalGroup.add(sensor);

    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    led.position.set(0, 3.4, -0.05);
    portalGroup.add(led);

    // Floor Glowing Sensor Mat / Exit Pad
    const matGeo = new THREE.PlaneGeometry(4.8, 2.8);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.7,
      metalness: 0.1
    });
    const floorMat = new THREE.Mesh(matGeo, matMat);
    floorMat.rotation.x = -Math.PI / 2;
    floorMat.position.set(0, 0.025, -1.2);
    floorMat.receiveShadow = true;
    portalGroup.add(floorMat);

    // Glowing Exit Floor Pulsing Ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    this.exitZoneRing = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.8, 32), ringMat);
    this.exitZoneRing.rotation.x = -Math.PI / 2;
    this.exitZoneRing.position.set(0, 0.04, -1.2);
    portalGroup.add(this.exitZoneRing);

    // Soft Green Exit Light Pool
    const exitLight = new THREE.PointLight(0x22c55e, 1.4, 10);
    exitLight.position.set(0, 3.2, -1.0);
    portalGroup.add(exitLight);

    this.scene.add(portalGroup);

    // Register exit trigger zone
    this.triggers.push({
      type: 'exit_door',
      id: 'mall-exit-portal',
      position: new THREE.Vector3(0, 0, 22.4),
      radius: 2.8
    });
  }

  // BUILD SURROUNDINGS: CITY SKYLINE, ROADS, PALMS & BILLBOARDS
  buildSurroundings() {
    // 1. Vast Terrain Ground (Rich green tropical lawns)
    const terrainGeo = new THREE.PlaneGeometry(280, 280);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x143820,
      roughness: 0.9,
      metalness: 0.05
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.05;
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    // 2. Perimeter Asphalt Highways & Ring Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Gold road markings

    const createRoad = (x, z, w, d, isHorizontal) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.01, z);
      road.receiveShadow = true;
      this.scene.add(road);

      // Road dashed centerlines
      const stripeCount = Math.floor((isHorizontal ? w : d) / 6);
      for (let i = 0; i < stripeCount; i++) {
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(isHorizontal ? 2.5 : 0.4, isHorizontal ? 0.4 : 2.5),
          lineMat
        );
        stripe.rotation.x = -Math.PI / 2;
        const offset = -( (isHorizontal ? w : d) / 2) + (i + 0.5) * 6;
        stripe.position.set(
          isHorizontal ? x + offset : x,
          0.02,
          isHorizontal ? z : z + offset
        );
        this.scene.add(stripe);
      }
    };

    // North Highway
    createRoad(0, -38, 160, 14, true);
    // South Boulevard
    createRoad(0, 36, 160, 14, true);
    // West Avenue
    createRoad(-42, -1, 14, 130, false);
    // East Avenue
    createRoad(42, -1, 14, 130, false);

    // 3. Outdoor Parking Lot & Vehicles (South-West outdoor zone)
    this.buildParkingLotAndVehicles();

    // 4. Grand Arrival Plaza & Flagpoles (South entrance)
    this.buildEntrancePlaza();

    // 5. Accra Skyline High-Rises & Modern Office Towers (35+ Buildings)
    this.buildCitySkyline();

    // 6. Large Roadside Billboards
    this.buildRoadsideBillboards();

    // 7. Lush Tropical Palm Trees & Trees
    this.buildTropicalVegetation();

    // 8. Outdoor Street Lamps
    this.buildStreetLamps();
  }

  buildCitySkyline() {
    const buildingGroup = new THREE.Group();

    // Building palettes
    const palettes = [
      { wall: 0x0f172a, win: 0x38bdf8 }, // Modern glass cyan
      { wall: 0x1e293b, win: 0xfef08a }, // Amber illuminated office
      { wall: 0x334155, win: 0xa5f3fc }, // Ice blue tower
      { wall: 0x1e1e24, win: 0xfde047 }, // Warm gold penthouse
      { wall: 0x27272a, win: 0x67e8f9 }  // Slate skyscraper
    ];

    const createSkyscraper = (x, z, w, d, h, paletteIdx) => {
      const pal = palettes[paletteIdx % palettes.length];
      const towerMat = new THREE.MeshStandardMaterial({
        color: pal.wall,
        roughness: 0.25,
        metalness: 0.7
      });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), towerMat);
      tower.position.set(x, h / 2, z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      buildingGroup.add(tower);

      // Glowing window stripes / grid panels
      const winMat = new THREE.MeshStandardMaterial({
        color: pal.win,
        emissive: pal.win,
        emissiveIntensity: 0.6,
        roughness: 0.1
      });

      // Front & Back illuminated window bands
      const floors = Math.floor(h / 3);
      for (let f = 1; f < floors; f++) {
        if (f % 2 === 0) {
          const winBandF = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.8, 0.1), winMat);
          winBandF.position.set(x, f * 3, z + d / 2 + 0.05);
          buildingGroup.add(winBandF);

          const winBandB = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.8, 0.1), winMat);
          winBandB.position.set(x, f * 3, z - d / 2 - 0.05);
          buildingGroup.add(winBandB);
        }
      }

      // Rooftop Features (AC units & Red Aviation Beacon Light)
      const acUnit = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.4, 1.2, d * 0.4),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5 })
      );
      acUnit.position.set(x, h + 0.6, z);
      buildingGroup.add(acUnit);

      // Antenna with blinking beacon
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      antenna.position.set(x + w * 0.2, h + 1.75, z + d * 0.2);
      buildingGroup.add(antenna);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      beacon.position.set(x + w * 0.2, h + 3.5, z + d * 0.2);
      buildingGroup.add(beacon);
    };

    // NORTH SKYLINE (Airport City Towers & High-Rises)
    createSkyscraper(-55, -60, 18, 16, 36, 0);
    createSkyscraper(-32, -65, 14, 14, 28, 1);
    createSkyscraper(-12, -70, 22, 18, 44, 2); // Grand Center Tower
    createSkyscraper(15, -68, 16, 15, 34, 3);
    createSkyscraper(38, -62, 20, 16, 38, 4);
    createSkyscraper(60, -58, 15, 14, 26, 0);

    // WEST SKYLINE (Osu & Commercial Plaza)
    createSkyscraper(-68, -25, 16, 18, 28, 1);
    createSkyscraper(-72, 0, 15, 20, 32, 2);
    createSkyscraper(-68, 25, 18, 16, 24, 3);
    createSkyscraper(-75, 50, 14, 14, 22, 4);

    // EAST SKYLINE (East Legon Modern Towers)
    createSkyscraper(68, -25, 16, 18, 30, 2);
    createSkyscraper(74, 2, 20, 18, 35, 0);
    createSkyscraper(68, 28, 15, 16, 26, 1);
    createSkyscraper(72, 52, 16, 15, 24, 3);

    // SOUTH DISTANT SKYLINE
    createSkyscraper(-45, 75, 18, 16, 26, 4);
    createSkyscraper(45, 75, 18, 16, 28, 1);

    this.scene.add(buildingGroup);
  }

  buildRoadsideBillboards() {
    const billboardGroup = new THREE.Group();

    const createBillboard = (x, z, text, bannerColor, textColor) => {
      // Steel support pillar
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 10, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      pole.position.set(x, 5, z);
      pole.castShadow = true;
      billboardGroup.add(pole);

      // Billboard sign board
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(14, 5, 0.6),
        new THREE.MeshStandardMaterial({
          color: bannerColor,
          emissive: bannerColor,
          emissiveIntensity: 0.45,
          roughness: 0.3
        })
      );
      board.position.set(x, 10.5, z);
      board.castShadow = true;
      billboardGroup.add(board);

      // Glowing spotlight shining on billboard
      const spot = new THREE.PointLight(bannerColor, 1.5, 15);
      spot.position.set(x, 12, z + 2);
      billboardGroup.add(spot);
    };

    // MTN 5G Billboard on North-West Highway
    createBillboard(-25, -46, "MTN 5G EVERYWHERE", 0xf59e0b, 0x000000);

    // Telecel Cash Billboard on North-East Highway
    createBillboard(25, -46, "TELECEL CASH GH", 0xef4444, 0xffffff);

    this.scene.add(billboardGroup);
  }

  buildParkingLotAndVehicles() {
    const lotGroup = new THREE.Group();
    lotGroup.position.set(-16, 0.02, 52);

    // Asphalt Parking Pad
    const lotPad = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 22),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    );
    lotPad.rotation.x = -Math.PI / 2;
    lotPad.receiveShadow = true;
    lotGroup.add(lotPad);

    // White parking bay lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -14; i <= 14; i += 4.5) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 8), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(i, 0.01, -4);
      lotGroup.add(line);
    }

    // Low-Poly Ghanaian Tro-Tros & Yellow Taxis
    const createCar = (cx, cz, bodyColor, isTroTro) => {
      const car = new THREE.Group();
      car.position.set(cx, 0, cz);

      // Car body
      const w = isTroTro ? 2.4 : 2.0;
      const h = isTroTro ? 1.8 : 1.1;
      const d = isTroTro ? 4.5 : 3.8;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.2 })
      );
      body.position.y = h / 2 + 0.3;
      body.castShadow = true;
      car.add(body);

      // Cabin / Roof
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.9, h * 0.6, d * 0.55),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 })
      );
      cabin.position.set(0, h + 0.4, -0.2);
      car.add(cabin);

      // Wheels
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
      [[-w / 2, -d * 0.3], [w / 2, -d * 0.3], [-w / 2, d * 0.3], [w / 2, d * 0.3]].forEach(pos => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 8), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos[0], 0.3, pos[1]);
        car.add(wheel);
      });

      lotGroup.add(car);
    };

    // Parked Yellow Taxi with Orange Fenders
    createCar(-9, -4, 0xfacc15, false);
    // Parked White Tro-Tro with Blue Stripe
    createCar(0, -4, 0xf8fafc, true);
    // Parked Red Sedan
    createCar(9, -4, 0xef4444, false);

    this.scene.add(lotGroup);
  }

  buildEntrancePlaza() {
    const plazaGroup = new THREE.Group();
    plazaGroup.position.set(0, 0, 48);

    // Paved arrival boulevard
    const walkway = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 26),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 })
    );
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.y = 0.02;
    walkway.receiveShadow = true;
    plazaGroup.add(walkway);

    // Decorative tiered arrival fountain
    const fBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 4.0, 0.8, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    );
    fBase.position.set(0, 0.4, 0);
    fBase.castShadow = true;
    plazaGroup.add(fBase);

    const fWater = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.2, 0.1, 24),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.05, metalness: 0.9 })
    );
    fWater.position.set(0, 0.85, 0);
    plazaGroup.add(fWater);

    // 3 Ghana National Flagpoles
    const flagColors = [0xef4444, 0xfacc15, 0x15803d]; // Red, Gold, Green
    [-2.5, 0, 2.5].forEach((fx, i) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 7.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 })
      );
      pole.position.set(fx, 3.75, -8);
      pole.castShadow = true;
      plazaGroup.add(pole);

      // Fabric Flag
      const flag = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.0, 0.05),
        new THREE.MeshStandardMaterial({ color: flagColors[i] })
      );
      flag.position.set(fx + 0.8, 6.8, -8);
      plazaGroup.add(flag);
    });

    this.scene.add(plazaGroup);
  }

  buildTropicalVegetation() {
    const vegGroup = new THREE.Group();

    // 1. Realistic Palm Tree Builder
    const createPalm = (px, pz, scale = 1.0) => {
      const palm = new THREE.Group();
      palm.position.set(px, 0, pz);
      palm.scale.set(scale, scale, scale);

      // Curved segmented trunk
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      for (let s = 0; s < 5; s++) {
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.28 - s * 0.02, 0.32 - s * 0.02, 1.4, 8), trunkMat);
        seg.position.set(Math.sin(s * 0.3) * 0.25, 0.7 + s * 1.3, Math.cos(s * 0.3) * 0.15);
        seg.rotation.z = -0.08 * s;
        seg.castShadow = true;
        palm.add(seg);
      }

      // Tropical Palm Canopy (9 fronds)
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 5), frondMat);
        frond.position.set(Math.cos(angle) * 1.5 + 0.4, 7.0, Math.sin(angle) * 1.5);
        frond.rotation.x = Math.sin(angle) * 0.65;
        frond.rotation.z = -Math.cos(angle) * 0.65;
        frond.castShadow = true;
        palm.add(frond);
      }

      vegGroup.add(palm);
    };

    // 2. Broadleaf Shade Tree Builder
    const createBroadleaf = (bx, bz, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(bx, 0, bz);
      tree.scale.set(scale, scale, scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 3.0, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
      );
      trunk.position.y = 1.5;
      trunk.castShadow = true;
      tree.add(trunk);

      // Foliage spheres
      const folMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
      const f1 = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), folMat);
      f1.position.y = 3.6;
      f1.castShadow = true;
      tree.add(f1);

      const f2 = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), folMat);
      f2.position.set(0.6, 4.4, 0.4);
      tree.add(f2);

      vegGroup.add(tree);
    };

    // Line of Palms along North Highway
    for (let x = -50; x <= 50; x += 14) {
      createPalm(x, -31, 0.95);
      createPalm(x + 5, -45, 1.1);
    }

    // Line of Palms along South Boulevard & Entrance Allée
    for (let z = 28; z <= 68; z += 10) {
      createPalm(-9, z, 1.0);
      createPalm(9, z, 1.0);
      createPalm(-26, z, 0.9);
      createPalm(26, z, 0.9);
    }

    // Palms along West & East Avenues
    for (let z = -25; z <= 25; z += 12) {
      createPalm(-35, z, 1.05);
      createPalm(-50, z, 0.9);
      createPalm(35, z, 1.05);
      createPalm(50, z, 0.9);
    }

    // Broadleaf trees clustered in green lawn parks
    createBroadleaf(-48, -15, 1.2);
    createBroadleaf(-52, 10, 1.1);
    createBroadleaf(48, -15, 1.2);
    createBroadleaf(52, 10, 1.1);
    createBroadleaf(-20, -60, 1.3);
    createBroadleaf(20, -60, 1.3);

    this.scene.add(vegGroup);
  }

  buildStreetLamps() {
    const lampGroup = new THREE.Group();

    const createLamp = (lx, lz) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 6.0, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      pole.position.set(lx, 3, lz);
      pole.castShadow = true;
      lampGroup.add(pole);

      // Lantern head
      const lantern = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.3, 0.8),
        new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xfef08a,
          emissiveIntensity: 0.9
        })
      );
      lantern.position.set(lx, 6.1, lz);
      lampGroup.add(lantern);

      // Downward warm street light
      const light = new THREE.PointLight(0xffedd5, 1.1, 14);
      light.position.set(lx, 5.8, lz);
      lampGroup.add(light);
    };

    // Street lamps along North & South roads
    [-30, 0, 30].forEach(lx => {
      createLamp(lx, -33);
      createLamp(lx, 31);
    });

    this.scene.add(lampGroup);
  }

  buildInteriorGreenery() {
    const indoorGroup = new THREE.Group();

    // Modern Geometric Planter Builder
    const createPlanter = (ix, iz) => {
      const pot = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.0, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
      );
      pot.position.set(ix, 0.5, iz);
      pot.castShadow = true;
      indoorGroup.add(pot);

      // Snake plant / Indoor Ficus foliage
      const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.4, 4), plantMat);
        leaf.position.set(ix + (i - 2) * 0.18, 1.6, iz);
        leaf.rotation.z = (i - 2) * 0.12;
        indoorGroup.add(leaf);
      }
    };

    // Place indoor planters along concourse corridors
    createPlanter(-3.5, -10);
    createPlanter(3.5, -10);
    createPlanter(-3.5, 0);
    createPlanter(3.5, 0);
    createPlanter(-3.5, 10);
    createPlanter(3.5, 10);

    // Modern Wooden Concourse Benches
    const createBench = (bx, bz, rotY) => {
      const bench = new THREE.Group();
      bench.position.set(bx, 0, bz);
      bench.rotation.y = rotY;

      // Wooden seat slats
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.12, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 })
      );
      seat.position.y = 0.5;
      bench.add(seat);

      // Metal legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      [-0.9, 0.9].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.7), legMat);
        leg.position.set(lx, 0.25, 0);
        bench.add(leg);
      });

      indoorGroup.add(bench);
    };

    createBench(-2, -5, Math.PI / 2);
    createBench(2, -5, -Math.PI / 2);

    this.scene.add(indoorGroup);
  }

  buildLobbyDecor() {
    // Grand Centerpiece: Modern Geometric Planter & Fountain
    const planterBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.8, 0.8, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
    );
    planterBase.position.set(0, 0.4, -1);
    planterBase.castShadow = true;
    planterBase.receiveShadow = true;
    this.scene.add(planterBase);

    // Water pool in planter
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.2, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.05, metalness: 0.9 })
    );
    water.position.set(0, 0.8, -1);
    this.scene.add(water);

    // Palm Tree in Center
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 4.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    trunk.position.set(0, 2.7, -1);
    trunk.castShadow = true;
    this.scene.add(trunk);

    // Palm foliage
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.8, 5), foliageMat);
      leaf.position.set(Math.cos(angle) * 1.3, 5.0, -1 + Math.sin(angle) * 1.3);
      leaf.rotation.x = Math.sin(angle) * 0.55;
      leaf.rotation.z = -Math.cos(angle) * 0.55;
      leaf.castShadow = true;
      this.scene.add(leaf);
    }

    // Shoe District Grand Entrance Archway
    const archGroup = new THREE.Group();
    archGroup.position.set(-13, 0, -2.5);

    const postMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4.5, 12), postMat);
    postL.position.set(-6, 2.25, 0);
    postL.castShadow = true;
    archGroup.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4.5, 12), postMat);
    postR.position.set(6, 2.25, 0);
    postR.castShadow = true;
    archGroup.add(postR);

    // Lintel Sign
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(12.5, 1.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.35 })
    );
    signBoard.position.set(0, 4.5, 0);
    signBoard.castShadow = true;
    archGroup.add(signBoard);

    this.scene.add(archGroup);
  }

  // BUILD THE SQUARE STALLS ARCHITECTURE
  buildSquareStalls() {
    this.stallMeshes = [];

    // STALL LOCATIONS CONFIGURATION
    const stallConfigs = [
      // === SHOE & FOOTWEAR DISTRICT (4 SQUARE STALLS) ===
      {
        store: STORES.find(s => s.id === "store-shoes-1"), // Kwame's Kicks (Stall S1)
        x: -18,
        z: -19,
        w: 6.8,
        d: 6.8,
        rot: 0, // Faces South (+Z) towards internal shoe walkway
        themeColor: 0xef4444,
        stripeColor: 0xffffff,
        shelves: [
          { prodId: "prod-kwame-1", localX: -1.8, localZ: 1.2 }, // Jordan 1
          { prodId: "prod-kwame-2", localX: 1.8, localZ: 1.2 }   // Dunk Low Panda
        ]
      },
      {
        store: STORES.find(s => s.id === "store-shoes-2"), // Abena Luxury (Stall S2)
        x: -8,
        z: -19,
        w: 6.8,
        d: 6.8,
        rot: 0,
        themeColor: 0xec4899,
        stripeColor: 0xfef08a, // Gold & Pink
        shelves: [
          { prodId: "prod-abena-1", localX: -1.8, localZ: 1.2 }, // Red Sole Pumps
          { prodId: "prod-abena-2", localX: 1.8, localZ: 1.2 }   // Loafers
        ]
      },
      {
        store: STORES.find(s => s.id === "store-shoes-3"), // Osu Retro Kicks (Stall S3)
        x: -18,
        z: -8,
        w: 6.8,
        d: 6.8,
        rot: Math.PI, // Faces North (-Z) towards internal shoe walkway
        themeColor: 0x06b6d4,
        stripeColor: 0xffffff,
        shelves: [
          { prodId: "prod-osu-1", localX: -1.8, localZ: 1.2 },  // New Balance 550
          { prodId: "prod-osu-2", localX: 1.8, localZ: 1.2 }   // Samba
        ]
      },
      {
        store: STORES.find(s => s.id === "store-shoes-4"), // Slide City & Care (Stall S4)
        x: -8,
        z: -8,
        w: 6.8,
        d: 6.8,
        rot: Math.PI, // Faces North (-Z) towards internal shoe walkway
        themeColor: 0xf59e0b,
        stripeColor: 0x1e293b,
        shelves: [
          { prodId: "prod-slide-1", localX: -1.8, localZ: 1.2 }, // Foam Slides
          { prodId: "prod-slide-2", localX: 1.8, localZ: 1.2 }  // Cleaning Kit
        ]
      },

      // === TECH ALLEY STALLS ===
      {
        store: STORES.find(s => s.id === "store-tech-1"), // Kojo Tech Hub (Stall E1)
        x: 10,
        z: -15,
        w: 6.8,
        d: 6.8,
        rot: 0,
        themeColor: 0x3b82f6,
        stripeColor: 0xffffff,
        shelves: [
          { prodId: "prod-tech-1", localX: 0, localZ: 1.2 } // AirPods Pro
        ]
      },
      {
        store: STORES.find(s => s.id === "store-tech-2"), // Accra Gadget World (Stall E2)
        x: 20,
        z: -15,
        w: 6.8,
        d: 6.8,
        rot: 0,
        themeColor: 0x8b5cf6,
        stripeColor: 0xffffff,
        shelves: [
          { prodId: "prod-tech-2", localX: 0, localZ: 1.2 } // Anker Powerbank
        ]
      },

      // === GROCERIES BAZAAR STALL ===
      {
        store: STORES.find(s => s.id === "store-groc-1"), // Osu Fresh Mart (Stall G1)
        x: -15,
        z: 13,
        w: 7.2,
        d: 6.8,
        rot: 0,
        themeColor: 0x10b981,
        stripeColor: 0xfef08a,
        shelves: [
          { prodId: "prod-groc-1", localX: 0, localZ: 1.2 } // Kingsbite Chocolate
        ]
      },

      // === FOOD COURT STALL ===
      {
        store: STORES.find(s => s.id === "store-food-1"), // Chorkor Chop Bar (Stall F1)
        x: 15,
        z: 13,
        w: 7.2,
        d: 6.8,
        rot: 0,
        themeColor: 0xf97316,
        stripeColor: 0xffedd5,
        shelves: [
          { prodId: "prod-food-1", localX: 0, localZ: 1.2 } // Ghana Jollof
        ]
      }
    ];

    stallConfigs.forEach(cfg => {
      this.createSquareStall(cfg);
    });
  }

  createOwnerTexture(store) {
    const canvas = document.createElement('canvas');
    canvas.width = 1536;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Pure dark backdrop
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 1536, 240);

    // Glowing Accra Gold border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1522, 226);

    // Top gold ribbon
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(7, 7, 1522, 54);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 32px "Outfit", system-ui, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`👑  STALL OWNER  •  ${(store.stallNumber || 'STALL').toUpperCase()}`, 768, 35);

    // Big, thick, bold white owner name
    ctx.font = '900 96px "Outfit", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText((store.owner || 'Accra Merchant').toUpperCase(), 768, 148);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const maxAniso = this.renderer ? this.renderer.capabilities.getMaxAnisotropy() : 16;
    texture.anisotropy = maxAniso;
    texture.needsUpdate = true;
    return texture;
  }

  createBannerTexture(store) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const themeHex = store.hexColor || '#f59e0b';

    // Pure dark backdrop
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 2048, 360);

    // Stall theme border
    ctx.strokeStyle = themeHex;
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 2032, 344);

    // Top Owner Header Bar
    ctx.fillStyle = themeHex;
    ctx.fillRect(8, 8, 2032, 70);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 38px "Outfit", system-ui, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`👑 OWNER: ${store.owner.toUpperCase()}  •  ${store.stallNumber.toUpperCase()}`, 1024, 43);

    // Store Name with Icon - extra bold and crisp
    ctx.font = '900 135px "Outfit", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${store.icon} ${store.name.toUpperCase()}`, 1024, 220);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const maxAniso = this.renderer ? this.renderer.capabilities.getMaxAnisotropy() : 16;
    texture.anisotropy = maxAniso;
    texture.needsUpdate = true;
    return texture;
  }

  createSquareStall(cfg) {
    const { store, x, z, w, d, rot, themeColor, stripeColor, shelves } = cfg;
    if (!store) return;

    const stallGroup = new THREE.Group();
    stallGroup.position.set(x, 0, z);
    stallGroup.rotation.y = rot;

    // 1. Interior Floor Mat / Rug
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(w - 0.2, d - 0.2),
      new THREE.MeshStandardMaterial({
        color: themeColor,
        roughness: 0.8,
        metalness: 0.1
      })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 0.025;
    rug.receiveShadow = true;
    stallGroup.add(rug);

    // 2. Square Enclosing Walls (Back Wall, Left Wall, Right Wall)
    const wallThickness = 0.25;
    const wallHeight = 3.4;
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Premium dark booth shell
      roughness: 0.35,
      metalness: 0.2
    });

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, wallHeight, wallThickness), wallMat);
    backWall.position.set(0, wallHeight / 2, -d / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    stallGroup.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, d), wallMat);
    leftWall.position.set(-w / 2, wallHeight / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    stallGroup.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, d), wallMat);
    rightWall.position.set(w / 2, wallHeight / 2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    stallGroup.add(rightWall);

    // 3. Front Corner Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    [-w / 2, w / 2].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, wallHeight, 12), pillarMat);
      pillar.position.set(px, wallHeight / 2, d / 2);
      pillar.castShadow = true;
      stallGroup.add(pillar);
    });

    // 4. Striped Canopy / Awning Overhang on Front
    const awningGroup = new THREE.Group();
    awningGroup.position.set(0, wallHeight, d / 2);

    const stripeWidth = (w + 0.4) / 6;
    for (let i = 0; i < 6; i++) {
      const stripeMat = new THREE.MeshStandardMaterial({
        color: (i % 2 === 0) ? themeColor : stripeColor,
        roughness: 0.6
      });
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(stripeWidth, 0.12, 1.4), stripeMat);
      stripe.position.set(-w / 2 + (i + 0.5) * stripeWidth, 0, 0.6);
      stripe.rotation.x = 0.2; // Angled awning
      stripe.castShadow = true;
      awningGroup.add(stripe);
    }
    stallGroup.add(awningGroup);



    // 5. Overhead 3D Merchant Signboard & Top Owner Plaque
    const bannerTexture = this.createBannerTexture(store);
    const ownerTexture = this.createOwnerTexture(store);

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.35,
      metalness: 0.6
    });

    const bannerMat = new THREE.MeshStandardMaterial({
      map: bannerTexture,
      roughness: 0.25,
      metalness: 0.1,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: bannerTexture,
      emissiveIntensity: 0.2
    });

    // Main Banner - 1.15m height, tilted toward overhead camera for crisp legibility
    const signBoardMaterials = [sideMat, sideMat, sideMat, sideMat, bannerMat, bannerMat];
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 1.15, 0.2), signBoardMaterials);
    signBoard.position.set(0, wallHeight + 0.85, d / 2 + 0.2);
    signBoard.rotation.x = -0.26;
    signBoard.castShadow = true;
    stallGroup.add(signBoard);

    // 5B. Owner's Name Plaque mounted ON TOP of the Stall's Banner - 0.75m height for clear visibility
    const ownerMat = new THREE.MeshStandardMaterial({
      map: ownerTexture,
      roughness: 0.25,
      metalness: 0.1,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: ownerTexture,
      emissiveIntensity: 0.25
    });

    const ownerMaterials = [sideMat, sideMat, sideMat, sideMat, ownerMat, ownerMat];
    const ownerPlaque = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.75, 0.16), ownerMaterials);
    ownerPlaque.position.set(0, wallHeight + 1.88, d / 2 + 0.46);
    ownerPlaque.rotation.x = -0.26;
    ownerPlaque.castShadow = true;
    stallGroup.add(ownerPlaque);

    // Dual Golden Struts Connecting Owner Plaque to Main Banner
    [-w * 0.25, w * 0.25].forEach(sx => {
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.45, 10),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.1 })
      );
      strut.position.set(sx, wallHeight + 1.48, d / 2 + 0.35);
      strut.rotation.x = -0.26;
      stallGroup.add(strut);
    });

    // 6. Vendor NPC standing inside behind back counter
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(0, 0, -d / 2 + 1.2);

    // Counter Desk
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.0, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    desk.position.set(0, 0.5, 0);
    desk.castShadow = true;
    vendorGroup.add(desk);

    // Vendor Body
    const vendorBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.3, 0.9, 8, 16),
      new THREE.MeshStandardMaterial({ color: themeColor })
    );
    vendorBody.position.set(0, 1.1, -0.6);
    vendorBody.castShadow = true;
    vendorGroup.add(vendorBody);

    // Vendor Head
    const vendorHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b3f24 })
    );
    vendorHead.position.set(0, 1.9, -0.6);
    vendorGroup.add(vendorHead);

    stallGroup.add(vendorGroup);

    // 7. Interior Warm Spotlight
    const stallLight = new THREE.PointLight(themeColor, 1.4, 9);
    stallLight.position.set(0, 2.8, 0);
    stallGroup.add(stallLight);

    this.scene.add(stallGroup);

    // 8. Place Shelves / Display Podiums inside the Stall
    shelves.forEach(sh => {
      const prod = PRODUCTS.find(p => p.id === sh.prodId);
      if (!prod) return;

      // Compute world position for the shelf based on stall position & rotation
      const localVec = new THREE.Vector3(sh.localX, 0, sh.localZ);
      localVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
      const worldPos = new THREE.Vector3(x + localVec.x, 0, z + localVec.z);

      this.createDisplayShelf(worldPos, prod, themeColor);
    });

    // 9. Place GTA-Style Glowing Cylinder right in front of stall entrance
    const localCyl = new THREE.Vector3(0, 0, d / 2 + 0.6);
    localCyl.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
    const cylWorldPos = new THREE.Vector3(x + localCyl.x, 0, z + localCyl.z);
    this.createGlowingCylinder(cylWorldPos, 1.35, 2.7, themeColor, store);
  }

  createDisplayShelf(worldPos, product, themeColor) {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.copy(worldPos);

    // Multi-tier display table
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.2, 0.9, 16),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.4
      })
    );
    table.position.y = 0.45;
    table.castShadow = true;
    table.receiveShadow = true;
    shelfGroup.add(table);

    // 3D Shoebox / Product Box Model
    const boxMat = new THREE.MeshStandardMaterial({
      color: product.boxColor || themeColor,
      roughness: 0.25,
      metalness: 0.2
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), boxMat);
    box.position.y = 1.15;
    box.castShadow = true;
    shelfGroup.add(box);

    // Rotating Gemstone
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: product.boxColor, emissiveIntensity: 0.9 })
    );
    gem.position.y = 1.95;
    shelfGroup.add(gem);
    shelfGroup.userData.gem = gem;

    // Glowing Floor Ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: product.boxColor || themeColor,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.8, 24), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    shelfGroup.add(ring);
    shelfGroup.userData.ring = ring;

    this.scene.add(shelfGroup);

    // Register trigger zone for interaction
    this.triggers.push({
      type: 'product',
      id: product.id,
      product: product,
      position: worldPos,
      radius: 2.6,
      mesh: shelfGroup
    });
  }

  buildCashierCounter() {
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, 0, 7.5);

    // Counter Desk
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(6, 1.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 })
    );
    desk.position.set(0, 0.6, 0);
    desk.castShadow = true;
    desk.receiveShadow = true;
    counterGroup.add(desk);

    // Conveyor Belt
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.1, 1),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    belt.position.set(-0.4, 1.25, 0);
    counterGroup.add(belt);

    // POS Cash Register & Screen
    const register = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    register.position.set(2, 1.5, 0);
    counterGroup.add(register);

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.6 })
    );
    screen.position.set(2, 1.9, -0.2);
    screen.rotation.x = -0.3;
    counterGroup.add(screen);

    // Cashier NPC
    const npcBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.35, 1.1, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x6366f1 })
    );
    npcBody.position.set(1.5, 1.2, -1.2);
    npcBody.castShadow = true;
    counterGroup.add(npcBody);

    const npcHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x7c2d12 })
    );
    npcHead.position.set(1.5, 2.05, -1.2);
    counterGroup.add(npcHead);

    // Glowing Checkout Floor Zone & Grand Gold GTA Cylinder
    const zoneMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    this.checkoutZoneMesh = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.4, 32), zoneMat);
    this.checkoutZoneMesh.rotation.x = -Math.PI / 2;
    this.checkoutZoneMesh.position.set(0, 0.05, 1.5);
    counterGroup.add(this.checkoutZoneMesh);

    this.scene.add(counterGroup);

    // Grand Gold GTA Cylinder at Cashier Counter
    this.createGlowingCylinder(new THREE.Vector3(0, 0, 7.5), 1.6, 2.8, 0xf59e0b, { id: 'cashier', name: 'Cashier Counter' });
  }

  createGlowingCylinder(worldPos, radius, height, colorHex, store) {
    const group = new THREE.Group();
    group.position.copy(worldPos);

    // 1. Vertical Translucent Beacon Cylinder
    const cylGeo = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    cyl.position.y = height / 2;
    group.add(cyl);

    // 2. Concentric Pulsing Floor Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const floorRingOuter = new THREE.Mesh(new THREE.RingGeometry(radius * 0.88, radius * 1.05, 32), ringMat);
    floorRingOuter.rotation.x = -Math.PI / 2;
    floorRingOuter.position.y = 0.035;
    group.add(floorRingOuter);

    const floorRingInner = new THREE.Mesh(new THREE.RingGeometry(0.1, radius * 0.35, 32), ringMat);
    floorRingInner.rotation.x = -Math.PI / 2;
    floorRingInner.position.y = 0.035;
    group.add(floorRingInner);

    // 3. Floating 3D Diamond / Beacon Marker
    const diamondGeo = new THREE.OctahedronGeometry(0.35, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: colorHex,
      emissiveIntensity: 1.0,
      roughness: 0.2
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.y = 1.35;
    group.add(diamond);

    // 4. Subtle interior glowing spotlight
    const beamLight = new THREE.PointLight(colorHex, 1.4, radius * 3.5);
    beamLight.position.y = 1.2;
    group.add(beamLight);

    this.scene.add(group);

    // Save for animation loop
    this.glowingCylinders.push({
      group,
      cyl,
      diamond,
      floorRingOuter,
      floorRingInner,
      baseRadius: radius,
      colorHex
    });

    // Register trigger zone
    const isCheckout = store.id === 'cashier';
    this.triggers.push({
      type: isCheckout ? 'checkout' : 'stall_catalog',
      id: `cyl-${store.id}`,
      store: store,
      position: worldPos,
      radius: radius + 0.4,
      mesh: group
    });
  }

  buildPlayer() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(0, 0, 1);

    // Torso (Yellow Hoodie)
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.5);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    this.torso = new THREE.Mesh(torsoGeo, torsoMat);
    this.torso.position.y = 1.1;
    this.torso.castShadow = true;
    this.playerGroup.add(this.torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x6b3f24, roughness: 0.7 });
    this.head = new THREE.Mesh(headGeo, headMat);
    this.head.position.y = 1.85;
    this.head.castShadow = true;
    this.playerGroup.add(this.head);

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 2.02, -0.05);
    this.playerGroup.add(cap);

    // Arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const armGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);

    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-0.45, 1.1, 0.25);
    this.leftArm.rotation.x = -0.5;
    this.playerGroup.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(0.45, 1.1, 0.25);
    this.rightArm.rotation.x = -0.5;
    this.playerGroup.add(this.rightArm);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const legGeo = new THREE.BoxGeometry(0.25, 0.7, 0.25);

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.2, 0.45, 0);
    this.leftLeg.castShadow = true;
    this.playerGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.2, 0.45, 0);
    this.rightLeg.castShadow = true;
    this.playerGroup.add(this.rightLeg);

    // Stack of Carried Boxes
    this.stackGroup.position.set(0, 0.8, 0.6);
    this.playerGroup.add(this.stackGroup);

    // Shadow
    const shadowGeo = new THREE.CircleGeometry(0.55, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    this.playerGroup.add(shadow);

    this.scene.add(this.playerGroup);
  }

  buildTriggers() {
    // Checkout Counter Trigger Zone
    this.triggers.push({
      type: 'checkout',
      id: 'cashier-checkout',
      position: new THREE.Vector3(0, 0, 7.5),
      radius: 3.2
    });
  }

  updateStackedBoxes(cartItems) {
    while (this.stackGroup.children.length > 0) {
      this.stackGroup.remove(this.stackGroup.children[0]);
    }

    const boxHeight = 0.32;
    const maxVisibleBoxes = 5;
    const count = Math.min(cartItems.length, maxVisibleBoxes);

    for (let i = 0; i < count; i++) {
      const item = cartItems[i];
      const boxMat = new THREE.MeshStandardMaterial({
        color: item.boxColor || 0xf59e0b,
        roughness: 0.3,
        metalness: 0.2
      });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.65, boxHeight, 0.55), boxMat);
      box.position.y = i * (boxHeight + 0.05);
      box.castShadow = true;
      this.stackGroup.add(box);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      const aspect = width / height;
      const isPortrait = aspect < 1;
      this.camera.aspect = aspect;
      this.camera.fov = isPortrait ? 50 : 36;
      if (isPortrait) {
        this.cameraOffset.set(0, 24, 24);
      } else {
        this.cameraOffset.set(0, 22, 22);
      }
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) this.keys[k] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (k === 'arrowup') this.keys.w = true;
        if (k === 'arrowdown') this.keys.s = true;
        if (k === 'arrowleft') this.keys.a = true;
        if (k === 'arrowright') this.keys.d = true;
      }
      if (e.key === 'e' || e.key === 'E') {
        this.interactCurrentTrigger();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) this.keys[k] = false;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (k === 'arrowup') this.keys.w = false;
        if (k === 'arrowdown') this.keys.s = false;
        if (k === 'arrowleft') this.keys.a = false;
        if (k === 'arrowright') this.keys.d = false;
      }
    });

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.container.addEventListener('pointerdown', (e) => {
      if (e.target !== this.renderer.domElement) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(floorPlane, target)) {
        this.clickTarget = target;
      }
    });
  }

  setJoystickVector(x, y) {
    this.joystickVector.x = x;
    this.joystickVector.y = y;
    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
      this.clickTarget = null;
    }
  }

  triggerSprintBoost() {
    if (this.isSprinting) return;
    this.isSprinting = true;
    const baseSpeed = 10.5;
    this.speed = baseSpeed * 1.5;
    setTimeout(() => {
      this.speed = baseSpeed;
      this.isSprinting = false;
    }, 1800);
  }

  interactCurrentTrigger() {
    if (!this.currentTrigger) return;
    if (this.currentTrigger.type === 'exit_door') {
      sound.playExitDoorSound();
      this.onOpenExitPrompt();
    } else if (this.currentTrigger.type === 'stall_catalog') {
      sound.playCylinderChime();
      this.onOpenStallCatalog(this.currentTrigger.store);
    } else if (this.currentTrigger.type === 'product') {
      sound.playPickup();
      this.onOpenProduct(this.currentTrigger.product);
    } else if (this.currentTrigger.type === 'checkout') {
      sound.playCounterDing();
      this.onOpenCheckout();
    }
  }

  teleportToRoom(roomKey) {
    const coords = {
      lobby: { x: 0, z: 1 },
      shoes: { x: -13, z: -13.5 }, // Central corridor between the 4 shoe stalls!
      tech: { x: 15, z: -13.5 },
      groceries: { x: -15, z: 12 },
      food: { x: 15, z: 12 },
      checkout: { x: 0, z: 5.5 }
    };
    const c = coords[roomKey] || coords.lobby;
    this.playerGroup.position.set(c.x, 0, c.z);
    this.clickTarget = null;
    sound.playPickup();
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.updatePlayerMovement(delta, elapsedTime);
    this.updateCamera();
    this.checkProximity();
    this.animateDecorations(elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }

  updatePlayerMovement(delta, time) {
    let moveX = 0;
    let moveZ = 0;

    if (this.keys.w) moveZ -= 1;
    if (this.keys.s) moveZ += 1;
    if (this.keys.a) moveX -= 1;
    if (this.keys.d) moveX += 1;

    if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
      moveX = this.joystickVector.x;
      moveZ = this.joystickVector.y;
    }

    if (this.clickTarget && moveX === 0 && moveZ === 0) {
      const diffX = this.clickTarget.x - this.playerGroup.position.x;
      const diffZ = this.clickTarget.z - this.playerGroup.position.z;
      const dist = Math.hypot(diffX, diffZ);
      if (dist > 0.3) {
        moveX = diffX / dist;
        moveZ = diffZ / dist;
      } else {
        this.clickTarget = null;
      }
    }

    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 1) {
      moveX /= inputLen;
      moveZ /= inputLen;
    }

    this.isMoving = inputLen > 0.05;

    if (this.isMoving) {
      const step = this.speed * delta;
      this.playerGroup.position.x += moveX * step;
      this.playerGroup.position.z += moveZ * step;

      // Mall boundaries
      this.playerGroup.position.x = Math.max(-29.5, Math.min(29.5, this.playerGroup.position.x));
      this.playerGroup.position.z = Math.max(-26.5, Math.min(22.5, this.playerGroup.position.z));

      const targetAngle = Math.atan2(moveX, moveZ);
      this.playerGroup.rotation.y = targetAngle;

      const runFreq = 16;
      this.leftLeg.rotation.x = Math.sin(time * runFreq) * 0.7;
      this.rightLeg.rotation.x = -Math.sin(time * runFreq) * 0.7;
      this.torso.position.y = 1.1 + Math.abs(Math.sin(time * runFreq)) * 0.08;

      this.stackGroup.rotation.z = Math.sin(time * (runFreq / 2)) * 0.12;
      this.stackGroup.rotation.x = -Math.abs(Math.cos(time * runFreq)) * 0.06;

      this.stepTimer += delta;
      if (this.stepTimer > 0.28) {
        sound.playStep();
        this.stepTimer = 0;
      }
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.torso.position.y = 1.1 + Math.sin(time * 3) * 0.02;
      this.stackGroup.rotation.z = 0;
      this.stackGroup.rotation.x = 0;
    }
  }

  updateCamera() {
    const targetCameraPos = new THREE.Vector3(
      this.playerGroup.position.x,
      this.playerGroup.position.y + this.cameraOffset.y,
      this.playerGroup.position.z + this.cameraOffset.z
    );
    this.camera.position.lerp(targetCameraPos, 0.08);
    this.camera.lookAt(
      this.playerGroup.position.x,
      this.playerGroup.position.y + 1,
      this.playerGroup.position.z
    );
  }

  checkProximity() {
    let closestTrigger = null;
    let minDistance = Infinity;

    this.triggers.forEach(trigger => {
      const dist = this.playerGroup.position.distanceTo(trigger.position);
      if (dist < trigger.radius && dist < minDistance) {
        minDistance = dist;
        closestTrigger = trigger;
      }
    });

    if (closestTrigger !== this.currentTrigger) {
      this.currentTrigger = closestTrigger;
      this.onProximityChange(this.currentTrigger);
    }
  }

  animateDecorations(time) {
    this.triggers.forEach(t => {
      if (t.mesh && t.mesh.userData) {
        if (t.mesh.userData.gem) {
          t.mesh.userData.gem.rotation.y = time * 2;
          t.mesh.userData.gem.position.y = 1.95 + Math.sin(time * 3 + t.position.x) * 0.08;
        }
        if (t.mesh.userData.ring) {
          const s = 1 + Math.sin(time * 4) * 0.08;
          t.mesh.userData.ring.scale.set(s, s, s);
        }
      }
    });

    // Animate GTA Glowing Cylinders
    if (this.glowingCylinders) {
      this.glowingCylinders.forEach((gc, idx) => {
        gc.cyl.rotation.y = time * 0.8 + idx;
        gc.diamond.rotation.y = time * 1.5;
        gc.diamond.position.y = 1.35 + Math.sin(time * 3 + idx) * 0.12;

        const pulse = 0.35 + Math.sin(time * 3.5 + idx) * 0.12;
        gc.cyl.material.opacity = pulse;

        const ringScale = 1 + Math.sin(time * 4 + idx) * 0.06;
        gc.floorRingOuter.scale.set(ringScale, ringScale, ringScale);
      });
    }

    if (this.checkoutZoneMesh) {
      const pulse = 1 + Math.sin(time * 3) * 0.06;
      this.checkoutZoneMesh.scale.set(pulse, pulse, pulse);
    }

    if (this.exitZoneRing) {
      const pulse = 1 + Math.sin(time * 3.5) * 0.08;
      this.exitZoneRing.scale.set(pulse, pulse, pulse);
    }
  }
}
