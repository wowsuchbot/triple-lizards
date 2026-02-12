// Main gameplay scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.keys = null;
        this.enemies = null;
        this.items = null;
        this.ladders = null;
        this.score = 0;
        this.health = 100;
        this.isClimbing = false;
        this.isPunching = false;
        this.canMove = true;
    }

    preload() {
        // Assets will be loaded here
    }

    create() {
        this.createEnvironment();
        this.createZones();
        this.createLadders();
        this.createItems();
        this.createPlayer();
        this.createEnemies();
        this.setupInput();
        this.createUI();
        this.setupCollisions();
    }

    createEnvironment() {
        // Background with perspective grid
        const graphics = this.add.graphics();
        
        // Sky gradient
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0f1e, 0x0f0f1e, 1);
        graphics.fillRect(0, 0, 800, 600);
        
        // Background buildings
        for (let i = 0; i < 5; i++) {
            const x = i * 200 + 50;
            const height = 150 + Math.random() * 100;
            graphics.fillStyle(0x2a2a3e, 0.6);
            graphics.fillRect(x, 200 - height, 150, height);
        }
        
        // Perspective grid lines
        graphics.lineStyle(1, 0x444444, 0.5);
        for (let y = 200; y <= 500; y += 50) {
            graphics.lineBetween(0, y, 800, y);
        }
        
        // Ground
        this.ground = this.add.rectangle(400, 516, 3000, 32, 0x444444);
        this.physics.add.existing(this.ground, true);
    }

    createZones() {
        // Start zone (green)
        this.startZone = this.add.rectangle(150, 400, 200, 200, 0x00ff00, 0.3);
        this.add.text(100, 300, 'START', { fontSize: '24px', color: '#00ff00' });
        
        // Exit zone (blue)
        this.exitZone = this.add.rectangle(2700, 400, 200, 200, 0x0088ff, 0.3);
        this.physics.add.existing(this.exitZone, true);
        this.add.text(2650, 300, 'EXIT', { fontSize: '24px', color: '#0088ff' });
    }

    createLadders() {
        this.ladders = [];
        
        // Add ladder graphics and collision zones
        const ladder1 = this.createLadder(600, 350, 150);
        const ladder2 = this.createLadder(1200, 300, 200);
        
        this.ladders.push(ladder1, ladder2);
    }

    createLadder(x, topY, height) {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x8b4513);
        
        // Draw ladder rungs
        for (let y = 0; y < height; y += 20) {
            graphics.lineBetween(x - 15, topY + y, x + 15, topY + y);
        }
        // Draw sides
        graphics.lineBetween(x - 15, topY, x - 15, topY + height);
        graphics.lineBetween(x + 15, topY, x + 15, topY + height);
        
        return { x, y: topY, height };
    }

    createItems() {
        this.items = this.physics.add.group();
        
        // Health packs (red crosses)
        this.createItem(400, 450, 'health');
        this.createItem(1500, 450, 'health');
        
        // Coins (gold circles)
        this.createItem(800, 440, 'coin');
        this.createItem(900, 440, 'coin');
        this.createItem(1000, 440, 'coin');
    }

    createItem(x, y, type) {
        const color = type === 'health' ? 0xff0000 : 0xffdd00;
        const item = this.add.circle(x, y, 12, color);
        this.physics.add.existing(item);
        item.setData('type', type);
        
        if (type === 'health') {
            // Draw cross
            const graphics = this.add.graphics();
            graphics.lineStyle(3, 0xffffff);
            graphics.lineBetween(x - 8, y, x + 8, y);
            graphics.lineBetween(x, y - 8, x, y + 8);
        }
        
        this.items.add(item);
    }

    createPlayer() {
        this.player = this.add.rectangle(100, 400, 32, 48, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.depth = this.player.y;
    }

    createEnemies() {
        this.enemies = this.physics.add.group();
        
        // Spawn enemies at intervals
        const enemyPositions = [
            { x: 500, y: 400 },
            { x: 800, y: 450 },
            { x: 1200, y: 420 },
            { x: 1600, y: 380 },
            { x: 2000, y: 400 }
        ];
        
        enemyPositions.forEach(pos => {
            this.createEnemy(pos.x, pos.y);
        });
    }

    createEnemy(x, y) {
        const enemy = this.add.rectangle(x, y, 32, 48, 0xff0000);
        this.physics.add.existing(enemy);
        enemy.setData('health', 50);
        enemy.setData('lastAttack', 0);
        enemy.depth = enemy.y;
        this.enemies.add(enemy);
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            punch: this.input.keyboard.addKey('SPACE'),
            jump: this.input.keyboard.addKey('SHIFT')
        };
    }

    createUI() {
        this.healthText = this.add.text(16, 16, 'HP: 100', {
            fontSize: '24px',
            color: '#00ff00'
        });
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(1000);
        
        this.scoreText = this.add.text(16, 48, 'Score: 0', {
            fontSize: '24px',
            color: '#ffdd00'
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(1000);
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.enemies, this.ground);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.exitZone, this.reachExit, null, this);
    }

    update(time, delta) {
        if (!this.player) return;
        
        this.handlePlayerMovement();
        this.updateEnemies(time);
        this.checkPunchCollisions();
        this.updateDepthScaling();
        this.updateCamera();
        this.updateUI();
    }

    handlePlayerMovement() {
        if (!this.canMove) return;
        
        const speed = 200;
        
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        } else {
            this.player.body.setVelocityX(0);
        }
        
        // Depth movement (up/down)
        if (!this.isClimbing) {
            if (this.cursors.up.isDown && this.player.y > 200) {
                this.player.y -= 2;
            } else if (this.cursors.down.isDown && this.player.y < 500) {
                this.player.y += 2;
            }
        }
        
        // Check for ladder climbing
        this.checkLadders();
        
        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && !this.isClimbing) {
            this.player.body.setVelocityY(-300);
        }
        
        // Punch
        if (Phaser.Input.Keyboard.JustDown(this.keys.punch) && !this.isPunching) {
            this.executePunch();
        }
    }

    checkLadders() {
        for (const ladder of this.ladders) {
            const dist = Math.abs(this.player.x - ladder.x);
            if (dist < 30 && this.player.y >= ladder.y && this.player.y <= ladder.y + ladder.height) {
                this.isClimbing = true;
                
                if (this.cursors.up.isDown && this.player.y > ladder.y) {
                    this.player.y -= 3;
                    this.player.body.setVelocityY(0);
                } else if (this.cursors.down.isDown && this.player.y < ladder.y + ladder.height) {
                    this.player.y += 3;
                    this.player.body.setVelocityY(0);
                }
                return;
            }
        }
        this.isClimbing = false;
    }

    executePunch() {
        this.isPunching = true;
        this.canMove = false;
        
        // Visual feedback
        this.player.setScale(1.2, 1);
        
        this.time.delayedCall(200, () => {
            this.player.setScale(1, 1);
            this.isPunching = false;
            this.canMove = true;
        });
    }

    updateEnemies(time) {
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Chase player if within range
            if (distance < 300) {
                const speed = 80;
                if (Math.abs(dx) > 50) {
                    enemy.body.setVelocityX(dx > 0 ? speed : -speed);
                } else {
                    enemy.body.setVelocityX(0);
                }
                
                // Match player depth
                if (Math.abs(dy) > 20) {
                    enemy.y += dy > 0 ? 1.5 : -1.5;
                }
                
                // Attack if close enough
                if (distance < 60 && time - enemy.getData('lastAttack') > 1500) {
                    this.enemyAttack(enemy, time);
                }
            } else {
                enemy.body.setVelocityX(0);
            }
            
            enemy.depth = enemy.y;
        });
    }

    enemyAttack(enemy, time) {
        enemy.setData('lastAttack', time);
        this.health -= 10;
        
        // Visual feedback - flash player
        this.player.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            this.player.clearTint();
        });
        
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    checkPunchCollisions() {
        if (!this.isPunching) return;
        
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                enemy.x, enemy.y
            );
            
            if (distance < 60) {
                this.hitEnemy(enemy);
            }
        });
    }

    hitEnemy(enemy) {
        const health = enemy.getData('health') - 25;
        enemy.setData('health', health);
        
        // Knockback
        const direction = enemy.x > this.player.x ? 1 : -1;
        enemy.body.setVelocityX(direction * 300);
        
        // Flash red
        enemy.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            enemy.clearTint();
            enemy.body.setVelocityX(0);
        });
        
        if (health <= 0) {
            enemy.destroy();
            this.score += 100;
        }
    }

    collectItem(player, item) {
        const type = item.getData('type');
        
        if (type === 'health') {
            this.health = Math.min(100, this.health + 25);
        } else if (type === 'coin') {
            this.score += 10;
        }
        
        item.destroy();
    }

    reachExit() {
        this.add.text(300, 250, 'LEVEL COMPLETE!', {
            fontSize: '48px',
            color: '#00ff00'
        }).setScrollFactor(0).setDepth(2000);
        
        this.canMove = false;
        
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }

    updateDepthScaling() {
        // Scale based on Y position for perspective
        const depthRange = 500 - 200;
        const depthPercent = (this.player.y - 200) / depthRange;
        const scale = 0.6 + (depthPercent * 0.4);
        
        this.player.setScale(scale);
        this.player.depth = this.player.y;
        
        // Apply to enemies too
        this.enemies.children.entries.forEach(enemy => {
            const enemyDepthPercent = (enemy.y - 200) / depthRange;
            const enemyScale = 0.6 + (enemyDepthPercent * 0.4);
            enemy.setScale(enemyScale);
        });
    }

    updateCamera() {
        this.cameras.main.scrollX = Phaser.Math.Clamp(
            this.player.x - 400,
            0,
            3000 - 800
        );
    }

    updateUI() {
        this.healthText.setText('HP: ' + this.health);
        this.scoreText.setText('Score: ' + this.score);
        
        // Color health based on amount
        if (this.health < 30) {
            this.healthText.setColor('#ff0000');
        } else if (this.health < 60) {
            this.healthText.setColor('#ffaa00');
        } else {
            this.healthText.setColor('#00ff00');
        }
    }

    gameOver() {
        this.add.text(300, 250, 'GAME OVER', {
            fontSize: '48px',
            color: '#ff0000'
        }).setScrollFactor(0).setDepth(2000);
        
        this.canMove = false;
        
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }
}
