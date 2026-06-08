# PUKU.md

This file provides guidance to puku-cli when working with code in this repository.

## Running the Game

Open `index.html` directly in any modern browser. No build tools or server required.

## Architecture Overview

This is a class-based HTML5 Canvas game where the `Game` class (lines 430-587) serves as the central controller managing all systems:

- **Game Loop**: Uses `requestAnimationFrame` with delta time calculation (line 591-600)
- **Collision Detection**: `checkCollision()` method using AABB (axis-aligned bounding box) hit detection (line 579-586)
- **Entity Management**: Arrays track enemies, projectiles, particles, and explosions with filter-based cleanup

## Class Hierarchy

```
Game (main controller)
├── Background
│   └── Layer (×4, parallax scrolling)
├── InputHandler
├── Player
│   └── Projectile[]
├── Enemy (base class)
│   ├── Angler1, Angler2
│   ├── LuckyFish (grants power-up)
│   ├── HiveWhale (spawns Drone on death)
│   └── Drone
├── PowerUp (type: 'shield' | 'double' | 'speed') — floating pickups spawned on a timer
├── Particle[] (gear debris with physics)
├── Explosion (base class)
│   └── smokeExplosion, fireExplosion
└── UI
```

## Power-up Items

The `PowerUp` class spawns collectible items on a 6-second timer (`game.powerUpInterval`).
Three types are weighted equally (~33% each):

- **Shield** (`#4dd0e1`, "SH") — cyan circle. Absorbs one enemy collision; particle burst, no score loss.
- **Double** (`#ffc107`, "2X") — yellow rounded rect. Refills ammo and enables two projectiles per shot (same effect as LuckyFish).
- **Speed** (`#9ccc65`, ">>") — green chevron. Multiplies `Player.maxspeed` by 1.8× for 6 seconds.

Active power-ups are tracked in `Player.activePowerUps` (a `{ type: { remainingMs } }` map) so multiple effects can run simultaneously. Re-picking the same type refreshes its timer; different types are independent. The `UI` class draws a top-right strip showing each active effect with a colored dot, label, and remaining seconds.

The pre-existing `Player.powerUp`/`powerUpTimer`/`powerUpLimit` fields and LuckyFish behavior are preserved (so the legacy ammo-refill animation continues to work).

## Key Patterns

- **Sprite Animation**: Frames extracted from sprite sheets using `frameX * width` calculations
- **Mark for Deletion**: Entities have `markForDeletionProperty` flag, filtered after update loops
- **Object Pooling**: New enemies spawned via `addEnemy()` with weighted random selection
- **Parallax Background**: Layers scroll at different speeds via `speedModifier` (0.2 to 2.0)

## Sprite Management

Sprites are embedded as hidden `<img>` elements in index.html and accessed via `document.getElementById()`. All sprite images are stored in `Game Pictures/` directory.

## Known Bugs to Fix

1. **Line 132**: Incorrect boundary check - `this.game + this.game.height` should be just `this.game.height`
2. **Line 187**: Variable name typo - `amm0` should be `ammo`
