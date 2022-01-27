class Game extends Phaser.Scene {
    constructor() {
        super()
    }
    
    preload() {
        this.load.image('tiles', '../../assets/mazes/default/tileset.png');
        this.load.image('point', '../../assets/sprites/Point.png');
        this.load.spritesheet('pacman', '../../assets/sprites/PacMan.png', { frameWidth: 85, frameHeight: 91});
        this.load.tilemapTiledJSON('maze', '../../assets/mazes/default/pacman.json');
        this.load.json('levelData', '../../assets/mazes/default/data.json');
    }

    create() {
        this.map = this.make.tilemap({ key: 'maze' });
        this.tiles = this.map.addTilesetImage('tileset', 'tiles', this.tileWidth=16, this.tileHeight=16);
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);
        this.levelData = this.cache.json.get('levelData');
        
        this.pacman = this.add.sprite(this.map.tileToWorldX(this.levelData.startsXAt)+10, this.map.tileToWorldY(this.levelData.startsYAt)+9.5, 'pacman');
        this.pacman.displayWidth = 10;
        this.pacman.displayHeight = 10.5;

        this.points = [];
        for (let i = 2; i <= 48; i++) {
            var temp = [];
            for (let j = 2; j <=48; j++) {
                if (i != 25 || j != 26) {
                    if (shouldAddPoint(this.layer.getTileAt(i, j))) {
                        temp.push(this.physics.add.image(this.map.tileToWorldX(i)+10, this.map.tileToWorldY(j)+10, 'point'));
                        temp.displayHeight = 0.1;
                        this.displayWidth = 0.1;                    //<=FIX HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                        this.physics.add.overlap(this.pacman, temp, () => {temp.destroy()});
                    }
                }
            }
        }

        this.camera = this.camera = this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.zoomTo(5);
        this.cameras.main.startFollow(this.pacman, true, 0.09, 0.09);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.pacman.moved = {
            x : 0,
            y : 0
        }
        this.pacman.direction = {
            next : 'right',
            current : 'right'
        }

        function shouldAddPoint(tile) {
            if ((tile.index != 15 || tile.rotation !=0) && (tile.index != 16 || tile.rotation !=0) && (tile.index != 24 || tile.rotation !=0) && (tile.index != 25 || tile.rotation !=0) && (tile.index != 26 || tile.rotation !=0) && (tile.index != 27 || tile.rotation !=0) && (tile.index != 28 || tile.rotation !=0)){
                return true;
            } else {
                return false;
            }
        }
    }
    update(time, delta) {
        // After 16 moved it means that we traveled a full box
        if (Math.abs(this.pacman.moved.y) == 16) {
            this.pacman.moved.y = 0;
        } 
        if (Math.abs(this.pacman.moved.x) == 16) {
            this.pacman.moved.x = 0;
        }
        
        // Here the direction is set. Only one direction is saved, i find it necessery to save it on an array
        if (this.cursors.left.isDown) {
            this.pacman.direction.next = 'left';
        }
        else if (this.cursors.right.isDown) {
            this.pacman.direction.next = 'right';
        }
        else if ((this.cursors.up.isDown)) {
            this.pacman.direction.next = 'up';
        }
        else if (this.cursors.down.isDown) {
            this.pacman.direction.next = 'down'; 
        }
        
        // Those are needed for checking collision
        var collisionTiles = {
            current : this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index,
            currentRotation : this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).rotation,
            right : this.layer.getTileAtWorldXY(this.pacman.x + 16, this.pacman.y, true, this.camera).index,
            rightRotation : this.layer.getTileAtWorldXY(this.pacman.x + 16, this.pacman.y, true, this.camera).rotation,
            down : this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y + 16, true, this.camera).index,
            downRotation : this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y + 16, true, this.camera).rotation
        }
        
        // Here we check if we can set the current direction same to the next
        if (this.pacman.direction.current != this.pacman.direction.next) {
            if ((this.pacman.direction.next == 'left' || this.pacman.direction.next == 'right') && this.pacman.moved.x == 0 && this.pacman.moved.y == 0) {
                if (canMove(this.pacman.direction.next, this.pacman.moved.y, this.pacman.moved.x, collisionTiles)) {
                    this.pacman.direction.current = this.pacman.direction.next;
                    this.pacman.moved.x = 0;
                }
            }
            else if (((this.pacman.direction.next == 'up') || (this.pacman.direction.next == 'down')) && (this.pacman.moved.y == 0) && (this.pacman.moved.x == 0)) {
                if (canMove(this.pacman.direction.next, this.pacman.moved.y, this.pacman.moved.x, collisionTiles)) {
                    this.pacman.direction.current = this.pacman.direction.next
                    this.pacman.moved.y = 0
                }
            }
        }
        
        if (canMove(this.pacman.direction.current, this.pacman.moved.y, this.pacman.moved.x, collisionTiles)) {
            if (this.pacman.direction.current == 'right') {
                this.pacman.x += 1;
                this.pacman.moved.x += 1;
            }
            else if (this.pacman.direction.current == 'left') {
                this.pacman.x -= 1;
                this.pacman.moved.x -= 1;
            }
            else if (this.pacman.direction.current == 'up') {
                this.pacman.y -= 1;
                this.pacman.moved.y -= 1;
            }
            else if (this.pacman.direction.current == 'down') {
                this.pacman.y += 1;
                this.pacman.moved.y += 1;
            }
        }
        
        function canMove(direction, movedY, movedX, collisionTiles) {
            if (moving == false) {
                return false;
            }
            if (direction == 'up') {
                if (((collisionTiles.current == 1 || collisionTiles.current == 3 || collisionTiles.current == 4 || collisionTiles.current == 9 || collisionTiles.current == 18 || collisionTiles.current == 23) && collisionTiles.currentRotation == 0) || ((collisionTiles.current == 9 || collisionTiles.current == 10) && collisionTiles.currentRotation > 4)) {
                    if ((movedY >= -16) && (movedY < 0)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true
                }
            } else if (direction == 'down') {
                if (((collisionTiles.down == 3 || collisionTiles.down == 4 || collisionTiles.down == 15 || collisionTiles.down == 16 || collisionTiles.down == 18 || collisionTiles.down == 1 || collisionTiles.down == 24 || collisionTiles.down == 25 || collisionTiles.down == 26 || collisionTiles.down == 27 || collisionTiles.down == 28) && collisionTiles.downRotation == 0) || ((collisionTiles.down == 9 || collisionTiles.down == 10) && collisionTiles.downRotation > 4)) {
                    if ((movedY <= 16) && (movedY > 0)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else if (direction == 'right') {
                if (((collisionTiles.right == 1 || collisionTiles.right == 15 || collisionTiles.right == 24) && collisionTiles.rightRotation == 0) || ((collisionTiles.right == 3 || collisionTiles.right == 4 || collisionTiles.right == 10 || collisionTiles.right == 18 || collisionTiles.right == 23) && collisionTiles.rightRotation > 4)) {
                    if ((movedX <= 16) && (movedX > 0)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else if (direction == 'left') {
                if (((collisionTiles.current == 1 || collisionTiles.current == 16 || collisionTiles.current == 28) && collisionTiles.currentRotation == 0) || ((collisionTiles.current == 3 || collisionTiles.current == 4 || collisionTiles.current == 10 || collisionTiles.current == 18) && collisionTiles.currentRotation > 4)) {
                    if ((movedX >= -16) && (movedX < 0)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        }
    }
}

var moving = false

window.addEventListener("click", () => moving = !moving)

const config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    physics: {
        default: 'arcade', //impact
        arcade: {
            gravity: 0
        }
    },
    pixelArt: true,
    scene: [ Game ]
}
const GAME = new Phaser.Game(config);
