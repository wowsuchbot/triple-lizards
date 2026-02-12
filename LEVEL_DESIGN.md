# Triple Lizards - Level Design Guide

This guide covers designing and building levels for Triple Lizards, including layout principles, JSON structure, and best practices.

## Level Design Philosophy

### Core Principles

1. **Readability** - Players should instantly understand where they can go
2. **Flow** - Combat areas should feel natural, not cramped
3. **Variety** - Mix elevation changes, enemy types, and hazards
4. **Pacing** - Alternate between intense fights and breathing room
5. **Exploration** - Reward players who explore with secrets and items

### Beat 'em Up Fundamentals

- **Scrolling Direction**: Left-to-right primarily (classic arcade feel)
- **Depth Movement**: Up/down movement creates tactical positioning
- **Arena Segments**: Lock players in areas during enemy waves
- **Environmental Hazards**: Pits, spikes, traffic (instant death or damage)
- **Interactive Objects**: Barrels, crates (destructible for items)

## Level Structure

### Basic Components

```
START ZONE → COMBAT AREA 1 → TRANSITION → COMBAT AREA 2 → BOSS ARENA → EXIT
```

### Zone Types

1. **Start Zone** - Safe area, no enemies, teaches controls
2. **Combat Area** - Open space, enemy spawns, items
3. **Transition** - Corridor or stairway between areas
4. **Platforming Section** - Ladders, jumps, vertical movement
5. **Boss Arena** - Large open space, special mechanics
6. **Safe Room** - Health pickups, save point (optional)
7. **Exit Zone** - End of level trigger

## Level JSON Format

Levels are defined in JSON files in the `levels/` directory.

### Schema

```json
{
  "id": "level1",
  "name": "City Streets",
  "width": 3000,
  "height": 600,
  "backgroundColor": "#334455",
  
  "tileset": {
    "name": "urban",
    "image": "assets/tilesets/urban.png",
    "tileSize": 32
  },
  
  "background": {
    "layers": [
      { "image": "assets/backgrounds/city_far.png", "scrollSpeed": 0.2 },
      { "image": "assets/backgrounds/city_mid.png", "scrollSpeed": 0.5 },
      { "image": "assets/backgrounds/city_near.png", "scrollSpeed": 0.8 }
    ]
  },
  
  "zones": [
    {
      "type": "start",
      "x": 100,
      "y": 300,
      "width": 200,
      "height": 200
    },
    {
      "type": "exit",
      "x": 2800,
      "y": 300,
      "width": 200,
      "height": 200
    }
  ],
  
  "platforms": [
    {
      "x": 0,
      "y": 500,
      "width": 3000,
      "height": 32,
      "type": "ground"
    },
    {
      "x": 800,
      "y": 350,
      "width": 200,
      "height": 32,
      "type": "platform"
    }
  ],
  
  "ladders": [
    {
      "x": 600,
      "y": 350,
      "height": 150
    }
  ],
  
  "enemies": [
    {
      "type": "grunt",
      "x": 500,
      "y": 400,
      "spawnDelay": 0
    },
    {
      "type": "grunt",
      "x": 700,
      "y": 450,
      "spawnDelay": 2
    },
    {
      "type": "boss",
      "x": 2500,
      "y": 400,
      "spawnDelay": 0,
      "triggerZone": {
        "x": 2200,
        "width": 300
      }
    }
  ],
  
  "items": [
    {
      "type": "health",
      "x": 400,
      "y": 450
    },
    {
      "type": "coin",
      "x": 850,
      "y": 330
    }
  ],
  
  "props": [
    {
      "type": "barrel",
      "x": 1000,
      "y": 470,
      "destructible": true,
      "contains": "health"
    }
  ],
  
  "camera": {
    "scrollType": "follow",
    "bounds": {
      "minX": 0,
      "maxX": 3000,
      "minY": 0,
      "maxY": 600
    },
    "deadzone": {
      "width": 400,
      "height": 200
    }
  },
  
  "music": "assets/audio/level1_theme.mp3",
  
  "ambience": [
    {
      "sound": "assets/audio/city_traffic.mp3",
      "volume": 0.3,
      "loop": true
    }
  ]
}
```

### Field Descriptions

**Top Level:**
- `id`: Unique identifier (used for loading/saving)
- `name`: Display name
- `width/height`: Level dimensions in pixels
- `backgroundColor`: Hex color for areas without background

**Zones:**
- `type`: "start", "exit", "combat", "safe"
- `x, y, width, height`: Position and size
- Special behaviors triggered when player enters

**Platforms:**
- `type`: "ground" (solid base), "platform" (can jump through from below)
- Defines collision geometry

**Ladders:**
- `x, y`: Bottom position
- `height`: Climbable distance upward

**Enemies:**
- `type`: "grunt", "elite", "boss" (references enemy definitions)
- `spawnDelay`: Seconds after level start before spawning
- `triggerZone`: Optional zone that triggers spawn when entered

**Items:**
- `type`: "health", "coin", "powerup"
- `x, y`: Position

**Props:**
- `type`: Visual/interactive objects
- `destructible`: Can be destroyed
- `contains`: Item spawned when destroyed

**Camera:**
- `scrollType`: "follow" (follows player), "locked" (fixed position)
- `bounds`: Min/max scroll limits
- `deadzone`: Player movement area before camera moves

## Layout Guidelines

### Depth Zones

Divide the playable area into depth bands:
```
Top (far):    y = 200-250  [60% scale, background]
Middle:       y = 300-400  [80% scale, main combat]
Bottom (near): y = 450-500 [100% scale, foreground]
```

Players move between these bands for tactical advantage.

### Combat Area Sizing

**Small Arena** (2-3 enemies):
- Width: 400-600 pixels
- Depth: 150-200 pixels

**Medium Arena** (4-6 enemies):
- Width: 600-900 pixels
- Depth: 200-250 pixels

**Large Arena** (boss, 8+ enemies):
- Width: 800-1200 pixels
- Depth: 250-300 pixels

### Elevation Changes

Use platforms and ladders to create vertical variety:
- **Low platforms** (100-150 pixels high): Quick hops, keep combat flowing
- **High platforms** (200+ pixels high): Require ladder, separate encounters
- **Drop-down platforms**: One-way platforms for surprise attacks

### Enemy Placement

**Wave Spawning:**
```json
{
  "enemies": [
    {"type": "grunt", "x": 500, "y": 400, "spawnDelay": 0},
    {"type": "grunt", "x": 600, "y": 450, "spawnDelay": 1},
    {"type": "grunt", "x": 550, "y": 425, "spawnDelay": 2},
    {"type": "elite", "x": 700, "y": 400, "spawnDelay": 4}
  ]
}
```
Stagger spawns by 1-2 seconds to avoid overwhelming the player immediately.

**Ambush Triggers:**
```json
{
  "type": "grunt",
  "x": 1200,
  "y": 400,
  "triggerZone": {"x": 1000, "width": 200}
}
```
Enemies spawn when player enters trigger zone.

**Formation Patterns:**
- **Line**: Enemies in horizontal row (easy to tackle one-by-one)
- **Semicircle**: Enemies surround player (challenging)
- **Pincer**: Enemies on both sides (tactical retreat needed)

### Item Placement

- **Health**: After tough fights, hidden in destructibles
- **Coins**: Along the main path, reward exploration
- **Power-ups**: Before boss fights, on hard-to-reach platforms

## Pacing Structure

### Example Level Flow

```
┌─────────────┐
│   START     │ Tutorial messages, no enemies
├─────────────┤
│  EASY WAVE  │ 2-3 grunts, learn combat
├─────────────┤
│ TRANSITION  │ Corridor, health pickup
├─────────────┤
│  MID WAVE   │ 4-5 enemies, mix types
├─────────────┤
│  PLATFORMING│ Ladders, jumps, coins
├─────────────┤
│  HARD WAVE  │ 6+ enemies, elites included
├─────────────┤
│  SAFE ROOM  │ Health, save point
├─────────────┤
│  BOSS ARENA │ Large space, boss enemy
├─────────────┤
│    EXIT     │ Victory trigger
└─────────────┘
```

### Difficulty Curve

- **Start**: 1-2 enemies, simple layout
- **Early**: 2-4 enemies, introduce depth movement
- **Middle**: 4-6 enemies, add elevation changes
- **Late**: 6-8 enemies, complex formations
- **Boss**: Single tough enemy or elite squad

## Advanced Techniques

### Gating & Progression

Lock areas until enemies are defeated:
```json
{
  "gates": [
    {
      "x": 1000,
      "y": 400,
      "width": 50,
      "height": 150,
      "unlockCondition": "enemiesCleared",
      "zoneId": "combat1"
    }
  ]
}
```

### Secret Areas

Hidden paths with rewards:
```json
{
  "secrets": [
    {
      "x": 1500,
      "y": 200,
      "width": 200,
      "height": 100,
      "hint": "Look for the cracked wall",
      "contains": ["health", "coin", "coin"]
    }
  ]
}
```

### Dynamic Events

Trigger scripted events at positions:
```json
{
  "events": [
    {
      "trigger": {"x": 1200, "width": 100},
      "action": "spawnEnemyWave",
      "params": {"waveId": "ambush1"}
    }
  ]
}
```

### Environmental Hazards

```json
{
  "hazards": [
    {
      "type": "pit",
      "x": 1500,
      "y": 500,
      "width": 100,
      "damage": 999
    },
    {
      "type": "spikes",
      "x": 2000,
      "y": 480,
      "width": 200,
      "damage": 25
    }
  ]
}
```

## Testing Checklist

### Before Releasing a Level

- [ ] Player can complete without getting stuck
- [ ] All platforms are reachable
- [ ] Ladders function correctly (top and bottom)
- [ ] Enemy spawn counts feel balanced
- [ ] Items are discoverable but not trivial
- [ ] Camera doesn't show outside level bounds
- [ ] Boss arena has enough space for combat
- [ ] Exit zone triggers level completion
- [ ] No collision detection bugs
- [ ] Performance is smooth (60 FPS target)

### Playtesting Questions

1. Did you understand where to go?
2. Were any fights too easy or too hard?
3. Did you find the hidden items?
4. How long did the level take? (target: 5-10 minutes)
5. What was your favorite part?
6. What was frustrating?

## Level Creation Workflow

1. **Sketch**: Draw level layout on paper
2. **Block Out**: Create JSON with basic geometry
3. **Test Movement**: Load in-game, verify player can navigate
4. **Add Enemies**: Place enemies, test difficulty
5. **Place Items**: Add pickups and secrets
6. **Visual Polish**: Add props, backgrounds, details
7. **Audio**: Add music and ambience
8. **Playtest**: Get feedback, iterate
9. **Balance**: Adjust enemy counts, item placement
10. **Finalize**: Lock in design, create next level

## Example Levels

### Level 1: City Streets (Tutorial)

**Theme**: Urban street at night  
**Length**: Short (3-5 minutes)  
**Enemies**: 8-10 grunts  
**Features**: Basic combat, one ladder, health pickups  
**Goal**: Teach core mechanics

### Level 2: Subway Station

**Theme**: Underground transit  
**Length**: Medium (7-10 minutes)  
**Enemies**: 12-15 grunts, 2-3 elites  
**Features**: Multiple elevations, moving platforms, ambush triggers  
**Goal**: Challenge spatial awareness

### Level 3: Rooftop Chase

**Theme**: Building tops, scaffolding  
**Length**: Long (10-15 minutes)  
**Enemies**: 15-20 mixed, 1 mini-boss  
**Features**: Jumping between buildings, hazardous gaps, wind-up enemy  
**Goal**: Test platforming and combat skill

### Level 4: Warehouse (Boss)

**Theme**: Industrial interior  
**Length**: Boss fight (5-8 minutes)  
**Enemies**: Boss + minion waves  
**Features**: Large arena, destructible cover, environmental hazards  
**Goal**: Epic final confrontation

## Tools & Resources

### Level Editors

- **Tiled**: Popular tile-based map editor (can export JSON)
- **LDtk**: Modern level editor with clean workflow
- **Ogmo Editor**: Lightweight, game-focused

### Conversion

Export from Tiled to Triple Lizards format:
1. Design level in Tiled
2. Export as JSON
3. Run converter script (coming soon)
4. Place in `levels/` directory

### Visual Planning

- **Graph paper**: Sketch layouts by hand
- **Draw.io**: Digital level flowcharts
- **Figma**: Collaborative level design mockups

## Tips & Best Practices

**DO:**
- Start simple, add complexity gradually
- Give players breathing room between fights
- Reward exploration with secrets
- Use visual cues for interactable objects
- Test levels with fresh eyes (or friends)

**DON'T:**
- Create impossible jumps or maze-like layouts
- Spam enemies without tactical variety
- Hide critical items in obscure locations
- Make levels too long (under 15 minutes ideal)
- Forget about camera bounds

## Next Steps

1. Create your first level using the JSON template
2. Test it in-game with placeholder art
3. Iterate on enemy placement and pacing
4. Add visual polish and audio
5. Playtest with others for feedback

For level design questions or to share your creations, open an issue on the repository!
