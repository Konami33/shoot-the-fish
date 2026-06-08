/**
 * Jest Setup File - Loads the game script and exposes classes globally
 */

// Read the script file contents
const fs = require('fs');
const path = require('path');

// Load the script content
const scriptPath = path.join(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Mock DOM elements
const mockImages = {
  projectile: { width: 12, height: 12 },
  gears: { width: 150, height: 150 },
  player: {},
  angler1: { width: 228, height: 169 },
  angler2: { width: 213, height: 165 },
  lucky: { width: 99, height: 95 },
  hivewhale: { width: 400, height: 227 },
  drone: { width: 115, height: 95 },
  layer1: { width: 1768, height: 500 },
  layer2: { width: 1768, height: 500 },
  layer3: { width: 1768, height: 500 },
  layer4: { width: 1760, height: 500 },
  smokeExplosion: { width: 1600, height: 200 },
  fireExplosion: { width: 1600, height: 200 }
};

// Mock canvas
const mockCanvas = {
  width: 1400,
  height: 499,
  getContext: function() {
    return {
      clearRect: function() {},
      drawImage: function() {},
      fillStyle: '',
      fillRect: function() {},
      strokeRect: function() {},
      fillText: function() {},
      save: function() {},
      restore: function() {},
      translate: function() {},
      rotate: function() {},
      font: '',
      textAlign: '',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: ''
    };
  }
};

// Create mock document.getElementById
const mockGetElementById = function(id) {
  if (id === 'canvas1') {
    return mockCanvas;
  }
  const mockImg = mockImages[id];
  if (!mockImg) {
    throw new Error(`Mock image not found for id: ${id}`);
  }
  return { ...mockImg };
};

// Set up globals
global.document = {
  getElementById: mockGetElementById
};

global.window = {
  addEventListener: function() {},
  removeEventListener: function() {},
  requestAnimationFrame: function() { return 0; }
};

// The script is wrapped in window.addEventListener('load', function() { ... });
// We need to extract class definitions and wrap them in an IIFE

// Extract everything inside the load event handler (excluding the wrapper)
// Remove: window.addEventListener('load', function() { at the start
// And: }); at the end
const loadEventStart = "window.addEventListener('load', function() {";
const loadEventEnd = '});';

const insideLoadEvent = scriptContent
  .substring(loadEventStart.length, scriptContent.length - loadEventEnd.length - 1)
  .trim();

// Remove the game instantiation and animation loop at the end
// We're looking for "const game = new Game" and everything after it
const constGameIndex = insideLoadEvent.indexOf('const game = new Game');
const classDefinitionsOnly = insideLoadEvent.substring(0, constGameIndex);

// Wrap in an IIFE and return the classes
const wrappedCode = `
(function() {
  ${classDefinitionsOnly}
  return { Game, Player, Enemy, Angler1, Angler2, LuckyFish, HiveWhale, Drone,
           Projectile, Particle, Layer, Background, Explosion, smokeExplosion,
           fireExplosion, UI, InputHandler, PowerUp };
})();
`;

// Execute and export to global
try {
  const classes = eval(wrappedCode);
  Object.keys(classes).forEach(function(key) {
    global[key] = classes[key];
  });
} catch (e) {
  console.error('Error loading game classes:', e.message);
  console.error('Stack:', e.stack);
  throw e;
}

// Verify classes are available
if (typeof global.Game === 'undefined') {
  throw new Error('Game class was not exported to global scope');
}