window.addEventListener('load', function() {
    //canvas setup
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 499;


    // it will keep track of the gamer input
    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if(((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }
                else if(e.key === ' ') {
                    this.game.player.shootTop();
                }
                else if(e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }
                //console.log(this.game.keys);
            });
            window.addEventListener('keyup', e=> {
                if(this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                //console.log(this.game.keys);
            });

        }
    }
    //handle the shooting guns and movable objects
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 12;
            this.height = 12;
            this.speed = 15;
            this.markForDeletionProperty = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.speed;
            if(this.x > this.game.width*.9) {
                this.markForDeletionProperty = true;
            }
        }
        draw(context) {
            // context.fillStyle = 'yellow';
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }

    } 
    //falling screws
    class Particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * .5 + .5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3
            this.speedY = Math.random() * -15;
            this.gravity = .5;
            this.markForDeletionProperty = false;
            this.angle = 0;
            this.va = Math.random() * .2 - .1;
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 80 + 60;
        }
        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if(this.y > this.game.height + this.size || this.x<0 - this.size) {
                this.markForDeletionProperty = true;
            }
            if(this.y > this.game.height - this.bottomBounceBoundary && this.bounced<2) {
                this.bounced++;
                this.speedY *= -0.5;
            }

        }
        //sx sy, sw, sh
        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize,this.spriteSize, this.spriteSize, this.size * -.5, this.size * - 0.5, this.size, this.size);
            context.restore();
        }
    }
    //controll the main character
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;//horizontal cordinate
            this.y = 100;//vertical coordinate
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.speedY = 0;
            this.maxspeed = 3;
            this.projectiles = [];
            this.image = document.getElementById("player");
            //power up
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 1500;
        }
        update(deltaTime) {
            if(this.game.keys.includes('ArrowUp'))
                this.speedY = -this.maxspeed;
            else if(this.game.keys.includes('ArrowDown'))
                this.speedY = this.maxspeed;
            else
                this.speedY = 0;
            this.y += this.speedY;
            //vertical boundary
            if(this.y > this.game + this.game.height - this.height)
                this.y = this.game.height - this.height * 0.5;
            else if(this.y < -this.height*.5)
                this.y = -this.height * .5;
            //handleprojectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markForDeletionProperty);//this line deletes the collided projectile from the projectiles array
            //sprite animation
            if(this.frameX<this.maxFrame)
                this.frameX++;
            else
                this.frameX = 0;
            //power up
            if(this.powerUp) {
                if(this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                }
                else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += .1;
                }
            }
        }
        draw(context) {
            //context.fillStyle = 'black';
            if(this.game.debug)
                context.strokeRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image,this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        }
        shootTop() {
            if(this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x+80, this.y+30));
                this.game.ammo--;
                //console.log(this.projectiles);
            }
            if(this.powerUp)
                this.shootBottom();
        }
        shootBottom() {
            if(this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x+80, this.y+175));
            }
        }
        enterPowerUp() {
            this.powerUpTimer = 0;
            this.powerUp = true;
            if(this.game.amm0<this.game.maxAmmo)
                this.game.ammo = this.game.maxAmmo;
        }
    }
    //controlling the enemies
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - .5;
            this.markForDeletionProperty = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;

        }
        update() {
            this.x += this.speedX - this.game.speed;
            if(this.x + this.width < 0) {
                this.markForDeletionProperty = true;
            }
            //sprite animation
            if(this.frameX<this.maxFrame)
                this.frameX++;
            else
                this.frameX = 0;
        }
        draw(context) {
            //context.fillStyle = 'red';
            if(this.game.debug)
                context.strokeRect(this.x, this.y, this.width, this.height);
            //context.fillStyle = 'black';
            context.drawImage(this.image,this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            if(this.game.debug) {
                context.font = '20px Helvetica';
                context.fillText(this.lives, this.x, this.y);
            }

        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.lives = 2;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * .95 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
        }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.lives = 3;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * .95 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
        }
    }
    class LuckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.lives = 4;
            this.score = 15;
            this.y = Math.random() * (this.game.height * .95 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.type = 'lucky';
        }
    }
    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.lives = 15;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * .95 - this.height);
            this.image = document.getElementById('hivewhale');
            this.frameY = 0;
            this.type = 'hive';
            this.speedX = Math.random() * -1.2 -.2;
        }
    }
    class Drone extends Enemy {
        constructor(game,x,y) {
            super(game, x, y);
            this.width = 115;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('drone');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = this.lives;
            this.type = 'drone';
            this.speedX = Math.random() * -4.2 -.5;
        }
    }
    //handle invidual background layers
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if(this.x <= -this.width) this.x = 0;
            //else
                this.x -= this.game.speed * this.speedModifier;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }//pull all the background layers together
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById("layer1");
            this.image2 = document.getElementById("layer2");
            this.image3 = document.getElementById("layer3");
            this.image4 = document.getElementById("layer4");
            this.layer1 = new Layer(this.game, this.image1, .2);
            this.layer2 = new Layer(this.game, this.image2, .5);
            this.layer3 = new Layer(this.game, this.image3, 2);
            this.layer4 = new Layer(this.game, this.image4, 1.5);
            this.layers = [this.layer1, this.layer2, this.layer3];
        }
        update() {
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
    class Explosion {
        constructor(game, x, y) {
            this.game = game;
            this.frameX = 0;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.fps = 30;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.markForDeletionProperty = false;
            this.maxFrame = 8;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width*.5;
            this.y = y - this.height*.5;
        }
        update(deltaTime) {
            this.x -= this.game.speed;
            if(this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            }
            else {
                this.timer += deltaTime;   
            }
            if(this.frameX > this.maxFrame) {
                this.markForDeletionProperty = true;
            }
        }
        //sx sy sw sh
        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }
    class smokeExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('smokeExplosion');
        }
    }

    class fireExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('fireExplosion');
        }
    }
    //it will draw timer, live score etc
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white'; 
        }
        draw(context) {
            context.save();
            context.fillStyle = 'white';
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            //score
            context.fillText('Score: ' + this.game.score, 20, 40);
            //timer
            const fomattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + fomattedTime, 20, 100);
            //game over message
            if(this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score>this.game.winningScore) {
                    message1 = 'Nodi you won!';
                    message2 = 'Well Done!';
                }
                else {
                    message1 = 'Nodi You are loser!';
                    message2 = 'Try again next time!';
                }
                context.font = '80px ' + this.fontFamily;
                context.fillText(message1, this.game.width*.5, this.game.height*.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width*.5, this.game.height*.5 + 20);
            }
            //ammo show
            if(this.game.player.powerUp)
                context.fillStyle = '#ffffbd';
            for(let i = 0; i<this.game.ammo; i++){
                context.fillRect(20 + 5*i, 50, 3, 20);
            }
            context.restore();
            
        }
    }
    //it is the brain of the game.all the object will come here
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];//ki ki chapa hoise shegula track rakhbe
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.ammo = 30;
            this.maxAmmo = 180;
            this.ammoTimer = 0;
            this.ammoInterval = 350;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 80;
            this.gameTime = 0;
            this.timeLimit = 35000;
            this.speed = 1;
            this.debug = false;
        }
        update(deltaTime) {
            //time
            if(!this.gameOver) {
                this.gameTime += deltaTime;
            }
            if(this.gameTime > this.timeLimit) {
                this.gameOver = true;
            }
            //background update
            this.background.update();
            this.background.layer4.update();
            //player update
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInterval) {
                if(this.ammo<this.maxAmmo) {
                    this.ammo++;
                }
                this.ammoTimer = 0;
            } 
            else {
                this.ammoTimer += deltaTime;
            }
            //pariticle update
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markForDeletionProperty);
            //explsion update
            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markForDeletionProperty);
            //enemy ----
            this.enemies.forEach(enemy => {
                enemy.update();//creating enemy
                
                //checking the collision with player and enemy
                if(this.checkCollision(this.player, enemy)) {
                    enemy.markForDeletionProperty = true;
                    //add explosion effect
                    this.addExplosion(enemy);

                    //enemy er shathe collide korle 10 kore particle porbe
                    for(let i = 0; i<enemy.score;i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * .5, enemy.y + enemy.height * .5));
                    }
                    
                    if(enemy.type === 'lucky') {
                        this.player.enterPowerUp();
                    }
                    else {
                        if(!this.gameOver) {
                            this.score--;
                        }
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        //if(!this.gameOver) enemy.lives--;//eita ami likhsi
                        projectile.markForDeletionProperty = true;
                        this.particles.push(new Particle(this, enemy.x + enemy.width * .5, enemy.y + enemy.height * .5));

                        if(enemy.lives <= 0) {

                            for(let i = 0; i<enemy.score;i++) {
                                this.particles.push(new Particle(this, enemy.x + enemy.width * .5, enemy.y + enemy.height * .5));
                            }
                            enemy.markForDeletionProperty = true;
                            this.addExplosion(enemy);
                            if(enemy.type === 'hive') {
                                for(let i = 0; i<5; i++) {
                                    this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height *.5 ));
                                }
                            }              
                            if(!this.gameOver)this.score += enemy.score; 
                            // if(this.score > this.winningScore) {
                            //     this.gameOver = true;
                            // }
                        }
                    }
                });

            });

            this.enemies = this.enemies.filter(enemy => !enemy.markForDeletionProperty);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context) {
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.particles.forEach( particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.explosions.forEach(explosion => {
                explosion.draw(context);
            });
            this.background.layer4.draw(context);
        }
        addEnemy() {
            const randomize = Math.random();
            if(randomize < .3)
                this.enemies.push(new Angler1(this));
            else if(randomize < .6)
                this.enemies.push(new Angler2(this));
            else if(randomize < .8)
                this.enemies.push(new HiveWhale(this));
            else
                this.enemies.push(new LuckyFish(this));
        }
        addExplosion(enemy) {
            const randomize = Math.random();
            if(randomize<.5) {
                this.explosions.push(new smokeExplosion(this, enemy.x + enemy.width * .5, enemy.y + enemy.height * .5));
            }
            else {
                this.explosions.push(new fireExplosion(this, enemy.x + enemy.width * .5, enemy.y + enemy.height * .5));
            }
        }
        checkCollision(rect1 ,rect2) { //custome function of collision check
            return(
                rect1.x< rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y< rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            )
        }
    }
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);//function call
});