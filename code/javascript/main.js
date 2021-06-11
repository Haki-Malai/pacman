var config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)
var controls;

function preload ()
{
    this.load.image('tiles', '../../assets/tiles/tileset.png')
    this.load.spritesheet('pacman', '../../assets/sprites/PacMan.png', { frameWidth: 85, frameHeight: 91})
    this.load.tilemapTiledJSON('maze', '../../assets/tiles/pacman.json')
}

function create ()
{
    this.map = this.make.tilemap({ key: 'maze' })
    this.tiles = this.map.addTilesetImage('tileset', 'tiles', tileWidth=16, tileHeight=16)
    this.map.createLayer(0, this.tiles, 0, 0)
    this.layer = this.map.createLayer(0, this.tiles, 0, 0)
    
    this.pacman = this.add.sprite(this.map.tileToWorldX(25)+10, this.map.tileToWorldY(26)+10, 'pacman')
    this.pacman.displayWidth = 10
    this.pacman.displayHeight = 10.5
    

    this.camera = this.camera = this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    this.camera.zoomTo(5)
    this.cameras.main.startFollow(this.pacman, true, 0.09, 0.09)

    this.cursors = this.input.keyboard.createCursorKeys()
}
function update (time, delta)
{
    if (this.cursors.left.isDown)
    {
        this.pacman.x -= 2.5
    }
    else if (this.cursors.right.isDown)
    {
        this.pacman.x += 2.5
    }

    if (this.cursors.up.isDown)
    {
        this.pacman.y -= 2.5
    }
    else if (this.cursors.down.isDown)
    {
        this.pacman.y += 2.5
    }
}
//https://phaser.io/examples/v3/view/camera/follow-zoom