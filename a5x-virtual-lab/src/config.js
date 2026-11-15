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
  floor:  0xb2b2b6,
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
    title: 'Designing Zone',
    desc: '3D Modeling, Graphic Design, Photo & Illustration, Product Design & AR/VR workstations with Blender and Adobe tools.',
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
  {
    id: 'hardware',
    title: 'Hardware Zone',
    desc: 'Electronics prototyping, soldering, component bins, pegboard tools, bench power supply and oscilloscope testing station.',
    stand: [15.5, 10.85],
    yaw: -Math.PI / 2,
    center: [19.2, 10.85],
    r: 5.5,
    icon: '⚡',
  },
  {
    id: 'arvr',
    title: 'AR / VR Lab',
    desc: 'Cutting-edge AR/VR innovation hub with 24-seat teaching zone, VR equipment wall, 3.2m smart interactive display, and immersive lounge.',
    stand: [26.8, 6.2],
    yaw: 0,
    center: [26.8, 9.4],
    r: 8.5,
    icon: '🥽',
  },
];

export const HOTSPOTS = [
  { id: 'printer', pos: [-11.0, 1.4, -14.1], title: 'Hero 3D Printer', desc: 'Precision FDM desktop 3D printer with multi-filament AMS unit, heated bed, and automatic bed levelling.', zone: 'printing' },
  { id: 'spools', pos: [-13.1, 2.7, -14.6], title: 'Filament Spools', desc: 'Six colours of 1.75mm PLA filament: orange, white, blue, black, yellow and red mounted on the tool rack.', zone: 'printing' },
  { id: 'roboarm', pos: [19.38, 1.3, -5.1], title: 'Robotic Arm', desc: 'A 6-axis desktop robotic arm for pick-and-place, soldering assist, and sorting tasks.', zone: 'roboticslab' },
  { id: 'drone', pos: [-12.5, 2.2, 10.0], title: 'Test Drone', desc: 'A micro quadcopter used for indoor drone piloting tests and obstacle course navigation.', zone: 'testing' },
  { id: 'soccerfield', pos: [-15.5, 0.2, -5.6], title: 'Robo Soccer Field', desc: 'A regulation mini soccer pitch where autonomous bots compete in 2v2 matches.', zone: 'testing' },
  { id: 'smarttv', pos: [19.7, 2.8, -5.1], title: 'Smart Display', desc: 'Interactive 75″ smart TV for live robotics, coding, and STEM learning pathways.', zone: 'roboticslab' },
  { id: 'racetrack', pos: [-15.5, 0.1, 0.3], title: 'Robo Race Track', desc: 'Dark circuit with red/white dashed racing line. Robots compete for fastest lap time.', zone: 'testing' },
  { id: 'hw_soldering', pos: [19.1, 1.05, 10.0], title: 'Soldering & Rework Station', desc: 'Temperature-controlled digital soldering station with heat-resistant iron stand, rosin-core solder spool, and magnifying helping-hands.', zone: 'hardware' },
  { id: 'hw_instruments', pos: [19.2, 1.25, 13.65], title: 'Test & Measurement Bench', desc: 'Dual-channel digital storage oscilloscope displaying real-time waveforms alongside a 30V / 5A precision bench DC power supply.', zone: 'hardware' },
  { id: 'hw_components', pos: [19.4, 1.65, 10.85], title: 'Component Storage Rack', desc: '12 organized transparent parts bins holding microcontrollers, sensors, actuators, motor drivers, communication modules, and passive components.', zone: 'hardware' },
  { id: 'hw_pegboard', pos: [19.6, 2.0, 8.15], title: 'Hardware Tool Pegboard', desc: 'Perforated tool board with pliers, precision screwdrivers, hot glue gun, digital multimeter, side cutters, and tape.', zone: 'hardware' },
  { id: 'arvr_tv', pos: [26.8, 2.05, 2.5], title: 'Main Interactive Display', desc: '3.2m wall-mounted smart display showcasing SRI AR/VR applications, 3D spatial simulations, and interactive STEM courses.', zone: 'arvr' },
  { id: 'arvr_pegboard', pos: [20.0, 2.0, 9.2], title: 'VR Headset & Controller Station', desc: 'White perforated tool pegboard with hanging VR headsets, motion controllers, and lower storage counter with 7 labeled component bins.', zone: 'arvr' },
  { id: 'arvr_display', pos: [20.0, 1.6, 12.4], title: 'Hardware Showcase Rack', desc: 'Illuminated glass display showcase holding boxed VR headsets, motion tracking pucks, and robotics accessories.', zone: 'arvr' },
  { id: 'arvr_lounge', pos: [26.8, 0.8, 14.2], title: 'Immersive Testing Lounge', desc: 'Relaxed testing area featuring green artificial turf with perimeter LED glow, navy and orange bean bags, and line-art VR headset wall art.', zone: 'arvr' },
  { id: 'arvr_desks', pos: [24.0, 1.0, 7.3], title: 'Student VR Workstations', desc: 'Two blocks of blonde wood study tables with flush power modules and 24 ergonomic task chairs with navy seats for collaborative learning.', zone: 'arvr' },
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
