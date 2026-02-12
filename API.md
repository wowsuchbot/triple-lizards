# Triple Lizards - API Reference

This document provides technical documentation for the game's code structure, classes, and methods.

## Table of Contents

- [Game Configuration](#game-configuration)
- [Scenes](#scenes)
- [Entities](#entities)
- [Level System](#level-system)
- [Input System](#input-system)
- [Physics & Collision](#physics--collision)
- [UI System](#ui-system)
- [Utilities](#utilities)

## Game Configuration

### Game Instance

```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);
```

### Global Constants

```javascript
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const DEPTH_SCALE_MIN = 0.6;  // Scale at far depth
const DEPTH_SCALE_MAX = 1.0;  // Scale at near depth
const DEPTH_MIN = 200;        // Top of playable area
const DEPTH_MAX = 500;        // Bottom of playable area
```

## Scenes

### GameScene

Main gameplay scene handling all game logic.

#### Constructor

```javascript
constructor()
```

Initializes scene with default properties:
- `player` - Player entity reference
- `enemies` - Phaser Group of enemy entities
- `items` - Phaser Group of collectible items
- `ladders` - Array of ladder objects
- `score` - Current score (number)
- `health` - Player health (0-100)
- `isClimbing` - Whether player is on ladder (boolean)
- `isPunching` - Whether punch animation is active (boolean)
- `canMove` - Whether player can move (boolean)

#### Methods

##### `preload()`
Load game assets (sprites, audio, levels).

```javascript
preload() {
    // Load level data
    this.load.json('level1', 'levels/level1.json');
    
    // Load sprite sheets
    this.load.spritesheet('player', 'assets/sprites/player.png', {
        frameWidth: 64,
        frameHeight: 64
    });
}
```

##### `create()`
Initialize game objects and systems.

```javascript
create() {
    this.createEnvironment();
    this.createPlayer();
    this.createEnemies();
    this.setupInput();
    this.createUI();
}
```

##### `update(time, delta)`
Called every frame. Handles game logic updates.

**Parameters:**
- `time` (number) - Total elapsed time in ms
- `delta` (number) - Time since last frame in ms

```javascript
update(time, delta) {
    this.handlePlayerMovement();
    this.updateEnemies();
    this.checkCollisions();
    this.updateDepthScaling();
}
```

##### `createEnvironment()`
Creates background, ground, and visual elements.

```javascript
createEnvironment() {
    // Background layers with parallax
    this.bg1 = this.add.tileSprite(0, 0, 1280, 720, 'bg_far');
    this.bg2 = this.add.tileSprite(0, 0, 1920, 720, 'bg_mid');
    
    // Ground platform
    this.ground = this.add.rectangle(400, 500, 3000, 32, 0x444444);
    this.physics.add.existing(this.ground, true);
}
```

##### `createPlayer()`
Creates and configures the player entity.

```javascript
createPlayer() {
    this.player = this.physics.add.sprite(100, 400, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.depth = this.player.y;
}
```

##### `createEnemies()`
Spawns enemies from level data.

```javascript
createEnemies() {
    this.enemies = this.physics.add.group();
    
    levelData.enemies.forEach(enemyData => {
        const enemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.type);
        this.enemies.add(enemy);
    });
}
```

##### `handlePlayerMovement()`
Processes player input and updates position.

```javascript
handlePlayerMovement() {
    if (!this.canMove) return;
    
    const speed = 200;
    
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
    }
    
    // Handle depth movement (up/down)
    if (this.cursors.up.isDown) {
        this.player.y -= 2;
    } else if (this.cursors.down.isDown) {
        this.player.y += 2;
    }
}
```

##### `updateDepthScaling()`
Updates sprite scales based on Y position for perspective effect.

```javascript
updateDepthScaling() {
    const depthRange = DEPTH_MAX - DEPTH_MIN;
    const depthPercent = (this.player.y - DEPTH_MIN) / depthRange;
    const scale = DEPTH_SCALE_MIN + (depthPercent * (DEPTH_SCALE_MAX - DEPTH_SCALE_MIN));
    
    this.player.setScale(scale);
    this.player.depth = this.player.y;
}
```

##### `checkCollisions()`
Handles collision detection between game objects.

```javascript
checkCollisions() {
    // Player punch vs enemies
    if (this.isPunching) {
        this.physics.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    }
    
    // Player vs items
    this.physics.overlap(this.player, this.items, this.collectItem, null, this);
}
```

##### `hitEnemy(player, enemy)`
Called when player's attack hits an enemy.

**Parameters:**
- `player` (Sprite) - Player sprite
- `enemy` (Enemy) - Enemy entity

```javascript
hitEnemy(player, enemy) {
    enemy.takeDamage(25);
    enemy.knockback(player.x < enemy.x ? 1 : -1);
    
    if (enemy.health <= 0) {
        enemy.destroy();
        this.score += 100;
    }
}
```

##### `collectItem(player, item)`
Called when player collects an item.

**Parameters:**
- `player` (Sprite) - Player sprite
- `item` (Sprite) - Item sprite

```javascript
collectItem(player, item) {
    if (item.getData('type') === 'health') {
        this.health = Math.min(100, this.health + 25);
    } else if (item.getData('type') === 'coin') {
        this.score += 10;
    }
    
    item.destroy();
}
```

### MenuScene

Title screen and main menu.

#### Methods

##### `create()`
Creates menu UI elements.

```javascript
create() {
    const title = this.add.text(400, 200, 'TRIPLE LIZARDS', {
        fontSize: '64px',
        color: '#ffff00'
    });
    
    const startButton = this.add.text(400, 400, 'START GAME', {
        fontSize: '32px',
        color: '#ffffff'
    });
    
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
        this.scene.start('GameScene');
    });
}
```

## Entities

### Player

Player character controlled by the user.

#### Properties

```javascript
{
    x: number,           // X position
    y: number,           // Y position
    health: number,      // Health points (0-100)
    speed: number,       // Movement speed (pixels/sec)
    jumpPower: number,   // Jump velocity
    attackPower: number, // Damage per hit
    isJumping: boolean,  // In mid-air
    isClimbing: boolean, // On ladder
    isPunching: boolean, // Attack animation active
    facing: string       // 'left' or 'right'
}
```

#### Methods

##### `punch()`
Executes punch attack.

```javascript
punch() {
    if (this.isPunching) return;
    
    this.isPunching = true;
    this.canMove = false;
    
    this.play('player_punch');
    
    this.once('animationcomplete', () => {
        this.isPunching = false;
        this.canMove = true;
    });
}
```

##### `jump()`
Makes player jump.

```javascript
jump() {
    if (this.isJumping || this.isClimbing) return;
    
    this.isJumping = true;
    this.setVelocityY(-400);
    this.play('player_jump');
}
```

##### `climb(direction)`
Moves player on ladder.

**Parameters:**
- `direction` (number) - 1 for up, -1 for down

```javascript
climb(direction) {
    if (!this.isClimbing) return;
    
    this.y += direction * 3;
    this.setVelocityX(0);
    this.setVelocityY(0);
}
```

### Enemy

AI-controlled hostile entity.

#### Properties

```javascript
{
    x: number,
    y: number,
    health: number,
    speed: number,
    attackRange: number,   // Distance to start attacking
    attackCooldown: number, // Time between attacks (ms)
    lastAttackTime: number, // Timestamp of last attack
    state: string,          // 'idle', 'chase', 'attack', 'hit', 'dead'
    target: Sprite          // Reference to player
}
```

#### Constructor

```javascript
constructor(scene, x, y, type) {
    super(scene, x, y, 'enemy_' + type);
    
    this.health = 50;
    this.speed = 100;
    this.attackRange = 60;
    this.attackCooldown = 1500;
    this.state = 'idle';
}
```

#### Methods

##### `update(time, delta)`
AI behavior update.

```javascript
update(time, delta) {
    switch(this.state) {
        case 'idle':
            this.updateIdle();
            break;
        case 'chase':
            this.updateChase();
            break;
        case 'attack':
            this.updateAttack();
            break;
    }
}
```

##### `updateChase()`
Pursues the player.

```javascript
updateChase() {
    const target = this.scene.player;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
    
    if (distance < this.attackRange) {
        this.state = 'attack';
        return;
    }
    
    // Move towards player
    if (this.x < target.x) {
        this.setVelocityX(this.speed);
    } else {
        this.setVelocityX(-this.speed);
    }
    
    // Match player depth
    if (Math.abs(this.y - target.y) > 20) {
        this.y += (target.y > this.y) ? 2 : -2;
    }
}
```

##### `takeDamage(amount)`
Reduces health and handles death.

**Parameters:**
- `amount` (number) - Damage to apply

```javascript
takeDamage(amount) {
    this.health -= amount;
    this.state = 'hit';
    
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
        this.clearTint();
    });
    
    if (this.health <= 0) {
        this.state = 'dead';
        this.destroy();
    }
}
```

##### `knockback(direction)`
Pushes enemy away from attack.

**Parameters:**
- `direction` (number) - 1 for right, -1 for left

```javascript
knockback(direction) {
    this.setVelocityX(direction * 300);
    
    this.scene.time.delayedCall(200, () => {
        this.setVelocityX(0);
        this.state = 'chase';
    });
}
```

## Level System

### LevelLoader

Loads and parses level JSON files.

#### Methods

##### `loadLevel(key)`
Loads level data from JSON file.

**Parameters:**
- `key` (string) - Level identifier

**Returns:** Promise<LevelData>

```javascript
loadLevel(key) {
    return this.scene.cache.json.get(key);
}
```

##### `parseLevel(data)`
Converts level data into game objects.

**Parameters:**
- `data` (object) - Level JSON data

```javascript
parseLevel(data) {
    // Create platforms
    data.platforms.forEach(platform => {
        this.createPlatform(platform);
    });
    
    // Spawn enemies
    data.enemies.forEach(enemy => {
        this.spawnEnemy(enemy);
    });
    
    // Place items
    data.items.forEach(item => {
        this.placeItem(item);
    });
}
```

## Input System

### InputManager

Handles keyboard and gamepad input.

#### Methods

##### `setupInput(scene)`
Initializes input handlers.

**Parameters:**
- `scene` (Scene) - Scene to attach input to

```javascript
setupInput(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
        punch: 'SPACE',
        jump: 'SHIFT',
        interact: 'E'
    });
}
```

##### `getMovementInput()`
Returns current movement direction.

**Returns:** { x: number, y: number }

```javascript
getMovementInput() {
    return {
        x: (this.cursors.right.isDown ? 1 : 0) - (this.cursors.left.isDown ? 1 : 0),
        y: (this.cursors.down.isDown ? 1 : 0) - (this.cursors.up.isDown ? 1 : 0)
    };
}
```

##### `isActionPressed(action)`
Checks if action button was just pressed.

**Parameters:**
- `action` (string) - Action name ('punch', 'jump', 'interact')

**Returns:** boolean

```javascript
isActionPressed(action) {
    return Phaser.Input.Keyboard.JustDown(this.keys[action]);
}
```

## Physics & Collision

### Collision Detection

#### Overlap vs Collide

```javascript
// Overlap: Objects pass through but trigger callback
this.physics.overlap(player, items, collectItem, null, this);

// Collide: Objects cannot pass through
this.physics.collide(player, platforms);
```

#### Hitbox Configuration

```javascript
// Set smaller hitbox for more precise collisions
player.body.setSize(32, 48);
player.body.setOffset(16, 16);
```

### Depth Sorting

Objects are rendered based on Y position for pseudo-3D effect.

```javascript
update() {
    // Update depth every frame
    this.player.depth = this.player.y;
    this.enemies.children.each(enemy => {
        enemy.depth = enemy.y;
    });
}
```

## UI System

### HUD

Displays health, score, and other info.

#### Methods

##### `createHUD(scene)`
Creates HUD elements.

```javascript
createHUD(scene) {
    this.healthText = scene.add.text(16, 16, 'HP: 100', {
        fontSize: '24px',
        color: '#00ff00'
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(1000);
    
    this.scoreText = scene.add.text(16, 48, 'Score: 0', {
        fontSize: '24px',
        color: '#ffff00'
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(1000);
}
```

##### `updateHUD(health, score)`
Updates HUD display.

**Parameters:**
- `health` (number) - Current health
- `score` (number) - Current score

```javascript
updateHUD(health, score) {
    this.healthText.setText('HP: ' + health);
    this.scoreText.setText('Score: ' + score);
    
    // Change color based on health
    if (health < 30) {
        this.healthText.setColor('#ff0000');
    } else if (health < 60) {
        this.healthText.setColor('#ffaa00');
    } else {
        this.healthText.setColor('#00ff00');
    }
}
```

## Utilities

### Helper Functions

#### `calculateDepthScale(y)`
Calculates sprite scale based on Y position.

**Parameters:**
- `y` (number) - Y position in world

**Returns:** number (scale factor)

```javascript
function calculateDepthScale(y) {
    const depthRange = DEPTH_MAX - DEPTH_MIN;
    const depthPercent = Math.max(0, Math.min(1, (y - DEPTH_MIN) / depthRange));
    return DEPTH_SCALE_MIN + (depthPercent * (DEPTH_SCALE_MAX - DEPTH_SCALE_MIN));
}
```

#### `isInRange(obj1, obj2, range)`
Checks if two objects are within range.

**Parameters:**
- `obj1` (object) - First object with x, y
- `obj2` (object) - Second object with x, y
- `range` (number) - Maximum distance

**Returns:** boolean

```javascript
function isInRange(obj1, obj2, range) {
    return Phaser.Math.Distance.Between(obj1.x, obj1.y, obj2.x, obj2.y) <= range;
}
```

#### `clamp(value, min, max)`
Restricts value to range.

**Parameters:**
- `value` (number) - Value to clamp
- `min` (number) - Minimum value
- `max` (number) - Maximum value

**Returns:** number

```javascript
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
```

## Events

### Custom Events

#### Scene Events

```javascript
// Level complete
this.events.emit('levelComplete', { score: this.score, time: this.time });

// Player death
this.events.emit('playerDeath', { score: this.score });

// Enemy defeated
this.events.emit('enemyDefeated', { enemyType: enemy.type, score: pointsAwarded });
```

#### Listening to Events

```javascript
this.events.on('levelComplete', (data) => {
    console.log('Level completed with score:', data.score);
    this.scene.start('MenuScene');
});
```

## Performance Tips

### Object Pooling

Reuse objects instead of creating/destroying.

```javascript
// Create pool
this.enemyPool = this.add.group({
    classType: Enemy,
    maxSize: 20,
    runChildUpdate: true
});

// Get from pool
const enemy = this.enemyPool.get(x, y);

// Return to pool
enemy.setActive(false);
enemy.setVisible(false);
```

### Limiting Physics Bodies

Only add physics to objects that need it.

```javascript
// Static objects don't need full physics
this.physics.add.existing(wall, true); // true = static body
```

### Texture Atlases

Pack sprites into atlases to reduce draw calls.

```javascript
this.load.atlas('game', 'assets/game.png', 'assets/game.json');
```

## Extending the Game

### Adding New Enemy Types

1. Create enemy data in level JSON
2. Add sprite assets
3. Extend Enemy class or create subclass
4. Register in enemy factory

```javascript
class BossEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss');
        this.health = 200;
        this.attackPower = 50;
    }
    
    updateAttack() {
        // Custom boss behavior
    }
}
```

### Adding New Items

1. Define item in level JSON
2. Add sprite asset
3. Handle in collectItem method

```javascript
collectItem(player, item) {
    const type = item.getData('type');
    
    switch(type) {
        case 'health':
            this.health += 25;
            break;
        case 'powerup':
            this.applyPowerup('strength', 10000);
            break;
    }
}
```

## Debugging

### Debug Mode

Enable physics debugging:

```javascript
physics: {
    arcade: {
        debug: true,  // Show hitboxes
        debugShowBody: true,
        debugShowStaticBody: true
    }
}
```

### Console Logging

```javascript
// Log player position
console.log('Player:', this.player.x, this.player.y);

// Log enemy states
this.enemies.children.each(enemy => {
    console.log('Enemy:', enemy.state, enemy.health);
});
```

## Further Reading

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [Beat 'em Up Game Design Patterns](https://gameprogrammingpatterns.com/)

For questions or contributions, open an issue on the repository!
