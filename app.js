const config = {
  width: 900,
  height: 800,
  type: Phaser.AUTO,
  physics: {
     default: 'arcade',
     arcade: {
         gravity: {y:450},
         debug: false
     }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  audio: {
      disableWebAudio: true
  }
}

var game = new Phaser.Game(config)
var extraT 
var cursors
var platforms
var score = 0;
var scoreText;
var boutonFeu;
var direction = 'right';
var groupeBullets;

function preload() {

    this.load.image('monster', 'images/monster.png')
    this.load.image('bg', 'images/stars.png')
    this.load.image('asteroid', 'images/asteroid.png')
    this.load.image('meteor', 'images/meteor.png')
    this.load.image('ground', 'images/platform.png')
    this.load.audio('music', 'sound/music.mp3', 'sound/music.ogg')
   // this.load.audio('audio_asteroid', 'sound/')
   // this.load.audio('audio_meteor', 'sound/')
   // this.load.audio('gameover', 'sound/')
    this.load.image('mars', 'images/mars.png')
}

function create() {
   
    this.bg = this.add.tileSprite(0,0,900, 800,'bg').setOrigin(0);

    extraT = this.physics.add.image(100, 500, 'monster');
    extraT.body.collideWorldBounds = true;
    cursors = this.input.keyboard.createCursorKeys()
    //console.log(cursors)

    var music = this.sound.add('music');
    music.play();

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 860, 'ground').setScale(2).refreshBody();
    platforms.create(650, 540, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(850, 220, 'ground');
    this.physics.add.collider(extraT, platforms);


    asteroids = this.physics.add.group({
        key: 'asteroid',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    asteroids.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });
    this.physics.add.collider(asteroids, platforms);

    this.physics.add.overlap(extraT, asteroids, collectAsteroid, null, this);


    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#0390fc' });

    meteors = this.physics.add.group();

    this.physics.add.collider(meteors, platforms);

    this.physics.add.collider(extraT, meteors, hitMeteor, null, this);
    groupeBullets = this.physics.add.group(3);
    boutonFeu = this.input.keyboard.addKey('A');
    
    this.physics.add.overlap(groupeBullets, meteors, hit, null,this);
   
    
}

function update() {
    
    if(cursors.up.isDown){
        extraT.setVelocity(0, -300)
       }

   else if (cursors.left.isDown){
         extraT.setVelocityX(-160);
        }

    else if (cursors.right.isDown){
         extraT.setVelocityX(160);
        }

    else{
         extraT.setVelocityX(0);
        }

        if (cursors.left.isDown) {//direction monstre
            extraT.direction = 'left';
            extraT.setVelocityX(-160);
           
        }
        else if (cursors.right.isDown) {
            extraT.direction = 'right';
            extraT.setVelocityX(160);
            
        }

        if ( Phaser.Input.Keyboard.JustDown(boutonFeu)) {
            tirer(extraT, direction);
         }

}

function collectAsteroid (extraT, asteroid)
{
    asteroid.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (asteroids.countActive(true) === 0)
    {
        asteroids.children.iterate(function (child) {//reactivation 
        child.enableBody(true, child.x, 0, true, true);
        });

        var x = (extraT.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); //coordonnées

        var meteor = meteors.create(x, 16, 'meteor');//creation
        meteor.setBounce(1);
        meteor.setCollideWorldBounds(true);
        meteor.setVelocity(Phaser.Math.Between(-200, 200), 20);

        if (meteors.countActive(true) === 4)
        gameDestroy = this.add.text(240, 10, 'Appuie sur la touche A et détruis 1 météorite !', { fontSize: '20px', fill: '#f23207'});
    }
}

function tirer(extraT) {
	var coefDir;
	    if (extraT.direction == 'left') {
             coefDir = -1; 
            } else { coefDir = 1 }//symetrie balle et vitesse
        var bullet = groupeBullets.create(extraT.x + (25 * coefDir), extraT.y - 4, 'mars');
        bullet.setCollideWorldBounds(false);
        bullet.body.allowGravity =false;
        bullet.setVelocity(1000 * coefDir, 0); // vitesse de la balle
}

function hitMeteor (extraT,meteor)
{
    this.physics.pause();
    gameOver = this.add.text(240, 350, 'GAME OVER', { fontSize: '80px', fill: '#0390fc'});
}

function hit (mars, meteor) {

    if (meteors.countActive(true) === 4 ) {
    mars.destroy();
    meteor.destroy();  
    }  
}