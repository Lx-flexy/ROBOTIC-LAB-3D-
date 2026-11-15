/**
 * config.js — Single source of truth for brand, palette, zone data, and hotspots.
 */
export const BRAND_NAME = 'SRI PUBLIC SCHOOL';
export const BRAND_SHORT = 'SRI';
export const LAB_TITLE = 'Robotics & Innovation Lab';

export const COLORS = {
  navy:   0x14284b,
  orange: 0xff7a00,
  cream:  0xfff1e3,
  wood:   0xdeb887,
  black:  0x1b1b1f,
  white:  0xffffff,
  green:  0x2e9e44,
  floor:  0xe9e2d8,
  sky:    0x9fd0ff,
};

export const CSS_COLORS = {
  navy:   '#14284b',
  orange: '#ff7a00',
  cream:  '#fff1e3',
};

/* Hall dimensions: 40 wide (x:-20..20), 30 deep (z:-15..15), 6 tall */
export const HALL = { w: 40, d: 30, h: 6, xMin: -20, xMax: 20, zMin: -15, zMax: 15 };

export const ZONES = [
  {
    id: 'printing',
    title: '3D Printing Zone',
    desc: 'Design → Slice → Print → Prototype. Bambu Lab style printers with multi-colour filament and a full pegboard toolset.',
    stand: [-11, -9.5],
    yaw: 0,
    center: [-11, -12],
    r: 4.5,
    icon: '🖨️',
  },
  {
    id: 'design',
    title: 'Design Zone',
    desc: 'CAD workstations with dual monitors for 3D modelling before printing or assembly.',
    stand: [0, -9.5],
    yaw: 0,
    center: [0, -12],
    r: 4,
    icon: '✏️',
  },
  {
    id: 'coding',
    title: 'Coding Zone',
    desc: 'Python, C++, Web Dev & GitHub workstations. Books, robot car, drone and mascot on display.',
    stand: [11, -9.5],
    yaw: 0,
    center: [11, -12],
    r: 4.5,
    icon: '💻',
  },
  {
    id: 'testing',
    title: 'Testing Zone',
    desc: 'Robo Race, Robo Soccer, Line Following, Obstacle Test, Drone Test & Project Testing — the arena floor.',
    stand: [-10.5, 2],
    yaw: Math.PI / 2,
    center: [-15, 2],
    r: 8,
    icon: '🏁',
  },
  {
    id: 'smartlearn',
    title: 'Smart Learning Wall',
    desc: 'Interactive smart display for Robotics, AI/ML, AR/VR, IoT and Drone classes.',
    stand: [14, 0],
    yaw: -Math.PI / 2,
    center: [18, 0],
    r: 6,
    icon: '📺',
  },
  {
    id: 'roboticslab',
    title: 'Robotics Lab Wall',
    desc: 'Maker workbench with Bambu Lab 3D printer, filament spools, parts drawers, robot cars, robotic arm, laptop and smart display.',
    stand: [16, -5.1],
    yaw: -Math.PI / 2,
    center: [19, -5.1],
    r: 6,
    icon: '🤖',
  },
];

export const HOTSPOTS = [
  { id: 'printer', pos: [-12.4, 1.5, -14.1], title: '3D Printer', desc: 'Bambu Lab style FDM printer. Prints prototypes from PLA, PETG and TPU filament in multiple colours.', zone: 'printing' },
  { id: 'spools', pos: [-11, 3, -14.5], title: 'Filament Spools', desc: 'Six colours of 1.75mm filament: orange, white, blue, black, yellow and red. Each spool holds 1 kg.', zone: 'printing' },
  { id: 'roboarm', pos: [19.38, 1.3, -5.1], title: 'Robotic Arm', desc: 'A 6-axis desktop robotic arm for pick-and-place, soldering assist, and sorting tasks.', zone: 'roboticslab' },
  { id: 'drone', pos: [-15.5, 3.5, 1], title: 'Test Drone', desc: 'A micro quadcopter used for indoor drone piloting tests and obstacle course navigation.', zone: 'testing' },
  { id: 'soccerfield', pos: [-15.5, 0.2, -5.6], title: 'Robo Soccer Field', desc: 'A regulation mini soccer pitch where autonomous bots compete in 2v2 matches.', zone: 'testing' },
  { id: 'smarttv', pos: [19.7, 2.8, -5.1], title: 'Smart Display', desc: 'Interactive 75″ smart TV for live robotics, coding, and STEM learning pathways.', zone: 'roboticslab' },
  { id: 'racetrack', pos: [-15.5, 0.1, 0.3], title: 'Robo Race Track', desc: 'Dark circuit with red/white dashed racing line. Robots compete for fastest lap time.', zone: 'testing' },
];

/* Wall text arrays for painted graphics */
export const WALL_TEXTS = {
  motto: 'Build • Learn • Compete • Innovate',
  learnMotto: 'Learn • Build • Code • Innovate',
  testMotto: 'Build • Test • Compete • Innovate',
  hexIcons: ['Python', 'C++', '</>', 'GitHub'],
  smartIcons: ['Robotics', 'AI / ML', 'AR / VR', 'IoT', 'Drones'],
  testIcons: ['Robo Race', 'Robo Soccer', 'Line Following', 'Obstacle Test', 'Drone Test', 'Project Testing'],
  sideIcons: ['Robotics', 'Coding', 'IoT', 'AR / VR'],
};
