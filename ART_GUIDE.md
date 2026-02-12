# Triple Lizards - Art Guide

This guide covers creating visual assets for Triple Lizards, including sprites, tilesets, backgrounds, and UI elements.

## Art Style

Triple Lizards uses a classic beat 'em up aesthetic with:
- **2.5D perspective** - Top-down angled view (isometric-lite)
- **Pixel art or hand-drawn** - Choose your style consistently
- **Bold colors** - High contrast for visibility
- **Clear silhouettes** - Characters must be readable at small sizes

## Asset Specifications

### Character Sprites

**Dimensions:**
- Player: 64x64 pixels (32x48 visible character area)
- Enemies: 64x64 pixels
- Bosses: 128x128 pixels

**Required Animations (sprite sheets):**
- Idle: 4 frames @ 8 fps
- Walk: 6 frames @ 12 fps
- Punch: 4 frames @ 16 fps
- Jump: 3 frames (up, peak, down)
- Climb: 4 frames @ 8 fps
- Hit: 2 frames @ 12 fps
- Death: 5 frames @ 8 fps

**Sprite Sheet Format:**
```
[frame1][frame2][frame3][frame4]...
```
Horizontal strip, evenly spaced frames.

**Naming Convention:**
- `player_idle.png` (256x64 for 4 frames)
- `player_walk.png` (384x64 for 6 frames)
- `enemy_grunt_idle.png`
- `enemy_boss_punch.png`

### Items & Pickups

**Dimensions:** 32x32 pixels

**Required Items:**
- Health pack (red cross icon)
- Coin (gold circle)
- Power-up (star or lightning)
- Weapon pickups (bat, pipe, knife)

**Animation:** 
- 4-frame idle animation (subtle pulse/rotate)
- Optional: sparkle effect overlay

**Naming:** `item_health.png`, `item_coin.png`, `item_bat.png`

### Tilesets

**Tile Size:** 32x32 pixels

**Required Tiles:**
- Ground/floor (multiple variants for texture)
- Walls (top, middle, bottom sections)
- Ladders (top, middle, bottom)
- Platforms (left edge, middle, right edge)
- Decorations (barrels, crates, trash cans)

**Tileset Format:**
Create a tileset image with tiles arranged in a grid:
```
[tile00][tile01][tile02][tile03]
[tile04][tile05][tile06][tile07]
[tile08][tile09][tile10][tile11]
```

**Naming:** `tileset_urban.png`, `tileset_warehouse.png`

**Tileset JSON:**
Create a corresponding JSON file defining tile properties:
```json
{
  "name": "urban",
  "tileSize": 32,
  "tiles": {
    "0": { "type": "ground", "collision": false },
    "4": { "type": "wall", "collision": true },
    "8": { "type": "ladder", "climbable": true }
  }
}
```

### Backgrounds

**Dimensions:** 1280x720 pixels (or larger for parallax layers)

**Layers:**
1. **Sky/Far Background** (slowest parallax) - 1280x720
2. **Mid Background** (medium parallax) - 1920x720
3. **Near Background** (faster parallax) - 2560x720

**Style:**
- Simplified detail (focus should be on gameplay)
- Atmospheric depth (darker/desaturated as distance increases)
- Urban environments: buildings, streets, alleyways
- Industrial: warehouses, factories, docks

**Naming:** `bg_city_far.png`, `bg_city_mid.png`, `bg_city_near.png`

### UI Elements

**HUD Components:**
- Health bar: 200x20 pixels
- Character portrait: 64x64 pixels
- Score display: Bitmap font or sprite font
- Life icons: 24x24 pixels

**Menu Elements:**
- Title logo: 800x200 pixels
- Buttons: 200x60 pixels (normal, hover, pressed states)
- Panel backgrounds: 9-slice sprites (corners + edges + center)

**Naming:** `ui_health_bar.png`, `ui_button.png`, `ui_panel.png`

## Color Palette Recommendations

### Player Character
- Primary: Bold color (blue, red, green) for instant recognition
- Secondary: Contrasting trim/accent
- Avoid: Gray, brown (blends with environment)

### Enemies
- Tier 1 (grunts): Red, purple
- Tier 2 (elites): Orange, yellow
- Bosses: Unique, memorable colors

### Environment
- Ground: Gray, brown, dark green
- Walls: Brick red, concrete gray, industrial blue
- Accent: Neon signs, graffiti (bright colors for pop)

## Export Settings

### For Pixel Art:
- Format: PNG-8 or PNG-24
- Filtering: None (nearest neighbor)
- Compression: High
- Transparency: Alpha channel

### For Hand-Drawn:
- Format: PNG-24
- Filtering: Bilinear or none
- Resolution: 2x for retina displays (scale down in-game)
- Transparency: Alpha channel

## Animation Guidelines

### Timing
- Idle: Slow, subtle (8 fps)
- Walk: Moderate (12 fps)
- Combat: Fast, snappy (16 fps)
- Hit reactions: Very fast (20 fps)

### Principles
- **Anticipation**: Wind-up before punch
- **Follow-through**: Recovery after action
- **Impact frames**: Hold frame on contact
- **Squash/stretch**: Subtle deformation for weight

### Attack Animation
```
Frame 1: Neutral stance
Frame 2: Wind-up (anticipation)
Frame 3: Strike (impact frame - hold 2 ticks)
Frame 4: Follow-through/recovery
```

## Perspective & Depth

### Character Scaling
Characters further "up" the screen (away from camera) should be smaller:
- Bottom of screen (near): 100% scale
- Middle of screen: 80% scale
- Top of screen (far): 60% scale

This is handled in code, but keep it in mind when drawing.

### Shadow
- Size: 80% of character width
- Opacity: 30% black
- Shape: Ellipse, positioned at character's feet
- Scales with character (larger when closer to camera)

### Depth Sorting
Render order based on Y position (higher Y = in front).
Art should account for this - design sprites so feet/base determines position.

## Tools & Resources

### Recommended Software
- **Pixel Art**: Aseprite, Pixelorama, GIMP
- **Vector/Hand-drawn**: Inkscape, Krita, Procreate
- **Tileset Creation**: Tiled Map Editor
- **Sprite Packing**: TexturePacker, Shoebox

### Inspiration
- Double Dragon (NES, Arcade)
- Streets of Rage series
- Final Fight
- River City Ransom
- Scott Pilgrim vs. The World: The Game

### Asset Generators
- **Placeholder art**: Use colored rectangles with labels
- **Character generator**: Universal LPC Sprite Sheet
- **Tile generator**: Pixeldudesmaker, Tilesetter

## Workflow

1. **Concept/Sketch**: Rough out character designs on paper
2. **Block Out**: Create simple colored shapes in-engine to test gameplay
3. **Refine**: Create clean sprite art
4. **Animate**: Build sprite sheets with proper frame counts
5. **Test**: Import and test in-game, iterate on timing/visibility
6. **Polish**: Add details, effects, polish

## Directory Structure

Place assets in the following folders:
```
assets/
├── sprites/
│   ├── player/
│   │   ├── player_idle.png
│   │   ├── player_walk.png
│   │   └── player_punch.png
│   ├── enemies/
│   │   ├── grunt_idle.png
│   │   └── boss_idle.png
│   └── items/
│       ├── health.png
│       └── coin.png
├── tilesets/
│   ├── urban.png
│   ├── urban.json
│   └── warehouse.png
├── backgrounds/
│   ├── city_far.png
│   ├── city_mid.png
│   └── city_near.png
└── ui/
    ├── health_bar.png
    ├── buttons.png
    └── font.png
```

## Performance Tips

- **Texture Atlases**: Pack related sprites into single images
- **Power-of-2 Dimensions**: Use 32, 64, 128, 256, 512, 1024 for texture dimensions
- **Minimize Transparency**: Fully opaque sprites render faster
- **Batch Similar Sprites**: Keep similar art styles together for draw call batching

## Next Steps

1. Create placeholder art using simple shapes and colors
2. Test gameplay mechanics with placeholders
3. Replace placeholders with polished art incrementally
4. Add juice (particle effects, screen shake, flashes) after core art is done

For questions or feedback on art direction, open an issue on the repository!
