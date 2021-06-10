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
    this.load.tilemapTiledJSON('map', '../../assets/tiles/pacman.json')
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' })
    var tiles = map.addTilesetImage('tileset', 'tiles', tileWidth=16, tileHeight=16)
    var layer = map.createLayer(0, tiles, 0, 0)

    const camera = this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    camera.zoomTo(3)

    var cursors = this.input.keyboard.createCursorKeys()
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    }
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
}

function update (time, delta)
{
    controls.update(delta)
}
//https://phaser.io/examples/v3/view/camera/follow-zoom
