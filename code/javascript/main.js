class Game extends Phaser.Scene {
    constructor() {
        super()
    }
    
    preload() {
        this.load.image('tiles', '../../assets/tiles/tileset.png')
        this.load.spritesheet('pacman', '../../assets/sprites/PacMan.png', { frameWidth: 85, frameHeight: 91})
        this.load.tilemapTiledJSON('maze', '../../assets/tiles/pacman.json')
    }

    create() {
        this.map = this.make.tilemap({ key: 'maze' })
        this.tiles = this.map.addTilesetImage('tileset', 'tiles', this.tileWidth=16, this.tileHeight=16)
        this.layer = this.map.createLayer(0, this.tiles, 0, 0)
        
        this.pacman = this.add.sprite(this.map.tileToWorldX(25)+10, this.map.tileToWorldY(26)+10, 'pacman')
        this.pacman.displayWidth = 10
        this.pacman.displayHeight = 10.5
        
        
        this.camera = this.camera = this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.camera.zoomTo(5)
        this.cameras.main.startFollow(this.pacman, true, 0.09, 0.09)
        
        this.cursors = this.input.keyboard.createCursorKeys()
        this.pacman.moved = {
            x : 0,
            y : 0
        }
        this.pacman.direction = {
            next : 'right',
            current : 'right'
        }
        
    }
    update(time, delta) {
        // After 16 moved it means that we traveled a full box
        if (Math.abs(this.pacman.moved.y) == 16) {
            this.pacman.moved.y = 0
        } 
        if (Math.abs(this.pacman.moved.x) == 16) {
            this.pacman.moved.x = 0
        }
        
        // Here the direction is set. Only one direction is saved, i find it necessery to save it on an array
        if (this.cursors.left.isDown) {
            this.pacman.direction.next = 'left'
        }
        else if (this.cursors.right.isDown) {
            this.pacman.direction.next = 'right'
        }
        else if ((this.cursors.up.isDown)) {
            this.pacman.direction.next = 'up' 
        }
        else if (this.cursors.down.isDown) {
            this.pacman.direction.next = 'down' 
        }
        
        // Here we check if we can set the current direction same to the next
        if (this.pacman.direction.current != this.pacman.direction.next) {
            if ((this.pacman.direction.next == 'left' || this.pacman.direction.next == 'right') && this.pacman.moved.x == 0 && this.pacman.moved.y == 0) {
                if (canMove(this.pacman.direction.next, this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index)) {
                    this.pacman.direction.current = this.pacman.direction.next
                    this.pacman.moved.x = 0
                }
            }
            else if (((this.pacman.direction.next == 'up') || (this.pacman.direction.next == 'down')) && (this.pacman.moved.y == 0) && (this.pacman.moved.x == 0)) {
                if (canMove(this.pacman.direction.next, this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index)) {
                    this.pacman.direction.current = this.pacman.direction.next
                    this.pacman.moved.y = 0
                }
            }
        }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FINISH THIS! ! ! ! ! !  ! ! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const pacmanTiles = {
            current = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index
            currentRotation = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).rotation
            left = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index
            leftRotation = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).rotation
            down = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index
            downRotation = this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).rotation
        }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        
        //console.log(this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).rotation, this.layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera).index)
        if (canMove(this.pacman.direction.current, this.pacman.moved.y, this.pacman.moved.x, pacmanTiles)) {
            if (this.pacman.direction.current == 'right') {
                this.pacman.x += 1
                this.pacman.moved.x += 1
            }
            else if (this.pacman.direction.current == 'left') {
                this.pacman.x -= 1
                this.pacman.moved.x -= 1
            }
            else if (this.pacman.direction.current == 'up') {
                this.pacman.y -= 1
                this.pacman.moved.y -= 1
            }
            else if (this.pacman.direction.current == 'down') {
                this.pacman.y += 1
                this.pacman.moved.y += 1
            }
        }
        
        function canMove(direction, movedY, movedX, tile, rotation) {
            if (moving == false) {
                return false
            }
            if (direction == 'up') {
                if ((((tile == 3) || (tile == 4) || (tile == 9) || (tile == 1) || (tile == 18)) && (rotation == 0)) || (((tile == 9) || (tile == 10)) && (rotation > 4))) {
                    if ((movedY >= -16) && (movedY < 0)) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else if (direction == 'down') {
                //let tile = layer.getTileAtWorldXY(this.pacman.x, this.pacman.y, true, this.camera)
                return true
                //if ((tile == 3) || (tile == 9) || (tile == 4) || (tile == 11)){
                    //return false
                    //} else {
                        //return true
                        //}
                    }// else if (direction == 'up')
                    //{
                        //if ((tile == 3) || (tile == 9) || (tile == 4) || (tile == 11)){
                            //return false
                            //} else {
                                //return true
                                //}
                                //} else if (direction == 'up'){
                                    //if ((tile == 3) || (tile == 9) || (tile == 4) || (tile == 11)){
                                        //return false
                                        //} else {
                                            //return true
                                            //}
                                            //}
                                            return true
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
    pixelArt: true,
    scene: [ Game ]
}
const GAME = new Phaser.Game(config)
