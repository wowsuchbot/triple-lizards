# Triple Lizards

A Double Dragon-style beat 'em up game built with Phaser 3.

![Game Preview](docs/images/gameplay.png)

## Features

- Classic 2.5D beat 'em up perspective
- Punching and jumping combat system
- Climbable ladders
- Collectible items (health, coins)
- Enemy AI with chase and attack behavior
- Level-based progression
- Modular level design system

## Quick Start

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Play!

For development, use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Then navigate to `http://localhost:8000`

## Controls

- **Arrow Keys**: Move (left/right for horizontal, up/down for depth)
- **Space**: Punch
- **Shift**: Jump
- **Up/Down near ladders**: Climb

## Project Structure

```
triple-lizards/
├── index.html              # Main entry point
├── src/
│   ├── game.js            # Main game configuration
│   ├── scenes/            # Game scenes
│   │   ├── MenuScene.js
│   │   └── GameScene.js
│   ├── entities/          # Game objects
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── Item.js
│   └── utils/             # Helper functions
├── assets/
│   ├── sprites/           # Character and object sprites
│   ├── tilesets/          # Tileset images
│   ├── backgrounds/       # Background images
│   ├── audio/             # Sound effects and music
│   └── fonts/             # Custom fonts
├── levels/
│   ├── level1.json        # Level data files
│   └── level2.json
└── docs/                  # Documentation
    ├── ART_GUIDE.md
    ├── LEVEL_DESIGN.md
    └── API.md
```

## Documentation

- [Art Guide](docs/ART_GUIDE.md) - Creating sprites, tilesets, and visual assets
- [Level Design Guide](docs/LEVEL_DESIGN.md) - Designing and building levels
- [API Reference](docs/API.md) - Code documentation

## Contributing

Pull requests welcome! Please read the documentation before submitting.

## License

MIT License - feel free to use this for your own projects!