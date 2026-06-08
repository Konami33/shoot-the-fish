# Shoot the Fish

A side-scrolling browser-based shooter game built with vanilla JavaScript, HTML5 Canvas, and CSS.

![Game Preview](Game Pictures/layer1.png)

## Overview

In this game, you control a submarine navigating through hostile waters, shooting at various enemy fish to score points. The objective is to reach the winning score of 80 points before the 35-second timer expires.

## How to Play

1. Open `index.html` in a modern web browser
2. Control your submarine to avoid enemy fish
3. Shoot projectiles at enemies to destroy them and earn points
4. Collect power-ups by destroying Lucky Fish
5. Reach 80 points before time runs out to win!

## Controls

| Key | Action |
|-----|--------|
| **Arrow Up** | Move submarine up |
| **Arrow Down** | Move submarine down |
| **Spacebar** | Shoot projectile |
| **D** | Toggle debug mode |

## Game Mechanics

### Player
- **Starting Position**: Left side of the screen
- **Movement**: Vertical only (up/down)
- **Shooting**: Fires projectiles to the right
- **Power-Up Mode**: When activated, shoots in both directions (up and down)

### Enemies

| Enemy Type | Lives | Score | Speed | Special |
|------------|-------|-------|-------|---------|
| Angler1 | 2 | 2 | Slow | - |
| Angler2 | 3 | 3 | Slow | - |
| LuckyFish | 4 | 15 | Medium | Grants power-up when destroyed |
| HiveWhale | 15 | 15 | Slow | Spawns 5 Drones on death |
| Drone | 3 | 3 | Fast | Spawned by HiveWhale |

### Power-Up System
- Destroy a **Lucky Fish** to activate power-up mode
- During power-up: Shoots in two directions (up and down)
- Ammo regenerates faster during power-up mode
- Power-up lasts for a limited time (1500ms)

### Floating Power-Ups
- Colored power-up items drift across the screen on a 6-second timer; collect them by flying into them
- **Shield** (cyan): absorbs one enemy hit
- **Double** (yellow): refills ammo and enables two projectiles per shot for ~8 seconds
- **Speed** (green): increases vertical speed by 1.8× for ~6 seconds
- Active effects appear as a top-right strip with remaining time; multiple effects can stack

### Ammo System
- **Starting Ammo**: 30
- **Maximum Ammo**: 180
- **Regeneration Rate**: +1 ammo every 350ms
- Ammo bar displayed on screen (yellow bars)

### Collision Effects
- **Player vs Enemy**: Enemy destroyed, you lose 1 point, gears explode
- **Projectile vs Enemy**: Enemy loses 1 life, gear particle spawned

## Win/Lose Conditions

- **Win**: Score reaches 80 points before time expires
- **Lose**: Timer expires before reaching 80 points

## Technical Architecture

### Class Overview

#### InputHandler
Handles keyboard input for player controls.
- Listens for ArrowUp, ArrowDown, Spacebar, and D key
- Manages key state for smooth movement

#### Projectile
Represents bullets fired by the player.
- Moves horizontally to the right
- Marked for deletion when off-screen

#### Particle
Falling gear effects on collision.
- Random size and rotation
- Gravity-affected with bounce physics
- Random horizontal speed with initial upward velocity

#### Player
Main character submarine.
- Sprite-based animation (38 frames)
- Power-up state management
- Ammo conservation during firing

#### Enemy (Base Class)
Base class for all enemy types with common properties:
- Horizontal movement
- Sprite animation
- Collision detection
- Lives and score value

**Enemy Subclasses:**
- `Angler1`: Small angler fish (2 lives)
- `Angler2`: Medium angler fish (3 lives)
- `LuckyFish`: Power-up granting fish (4 lives, 15 points)
- `HiveWhale`: Large whale that spawns drones (15 lives)
- `Drone`: Fast small enemy spawned by HiveWhale (3 lives)

#### Layer
Individual parallax background layer.
- Seamless looping background support
- Speed modifier for depth effect

#### Background
Manages all parallax background layers.
- 4 layers with different scroll speeds
- Creates underwater depth effect

#### Explosion
Base explosion animation class.
- Frame-based sprite animation
- Duration: ~267ms (8 frames at 30fps)

**Explosion Subclasses:**
- `smokeExplosion`: Smoke effect (50% spawn chance)
- `fireExplosion`: Fire effect (50% spawn chance)

#### UI
User interface elements.
- Score display
- Timer countdown
- Ammo bar indicator
- Game over messages

#### Game
Main game controller class.
- Game loop with delta time
- Collision detection system
- Enemy spawning system
- State management (score, time, ammo)

### File Structure

```
shoot-the-fish/
├── index.html          # Main HTML file with canvas and sprite images
├── script.js            # All game logic (~600 lines)
├── style.css            # Canvas styling
├── Game Pictures/
│   ├── player.png       # Submarine sprite (120x190px, 38 frames)
│   ├── projectile.png   # Bullet sprite
│   ├── gears.png        # Particle sprites (3x3 grid, 50px each)
│   ├── smokeExplosion.png   # Smoke effect sprite
│   ├── fireExplosion.png     # Fire effect sprite
│   ├── layer1.png       # Background layer 1 (far)
│   ├── layer2.png       # Background layer 2
│   ├── layer3.png       # Background layer 3
│   ├── layer4.png       # Background layer 4 (close)
│   └── Enemies/
│       ├── angler1.png  # Angler fish type 1
│       ├── angler2.png  # Angler fish type 2
│       ├── lucky.png    # Lucky fish (power-up)
│       ├── hivewhale.png # Large whale enemy
│       └── drone.png    # Fast drone enemy
└── README.md            # This documentation
```

### Technical Details

- **Canvas Size**: 1400 x 499 pixels
- **Game Time Limit**: 35 seconds (35000ms)
- **Winning Score**: 80 points
- **Starting Ammo**: 30
- **Maximum Ammo**: 180
- **Animation System**: Frame-based sprite animation
- **Game Loop**: `requestAnimationFrame` with delta time
- **Physics**: Gravity, bounce, and particle effects

## Setup Instructions

1. **Clone or download** the project
2. **Navigate** to the project directory
3. **Open** `index.html` in a web browser (Chrome, Firefox, Edge, Safari)
4. **Play**!

No build tools or dependencies required - runs entirely in the browser.

## Known Issues

The following issues exist in the current codebase:

1. **Line 132 in script.js**: Boundary check has incorrect syntax
   ```javascript
   // Current (buggy):
   if(this.y > this.game + this.game.height - this.height)
   // Should be:
   if(this.y > this.game.height - this.height)
   ```

2. **Line 187 in script.js**: Typo in variable name
   ```javascript
   // Current (buggy):
   if(this.game.amm0<this.game.maxAmmo)
   // Should be:
   if(this.game.ammo<this.game.maxAmmo)
   ```

3. **Game Over Messages**: UI messages contain placeholder names
   ```javascript
   // Line 407: "ARHAM you won!" (placeholder name)
   // Line 411: "AYAN You are loser!" (placeholder name)
   ```
   These should be changed to generic messages like "You Won!" and "Game Over".

## Debug Mode

Press **D** to toggle debug mode which displays:
- Player hitbox outline
- Enemy hitbox outlines
- Enemy lives count above each enemy

## Credits

- **Font**: Bangers (Google Fonts)
- **Game Engine**: Vanilla JavaScript with HTML5 Canvas
- **Sprites**: Custom game artwork (in Game Pictures folder)

---

*Document version: 1.0*  
*Last updated: May 2026*