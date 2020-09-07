import GlobalFuncs from "../global-funcs.js"
import Player from "../player/player.js"

export default class MyTilesetScene extends Phaser.Scene {
	constructor(config) {
		super(config);

		this.globalfuncs = new GlobalFuncs();
		this.player = new Player(this);
	}

	init() {
		console.log('init on ' + this.scene.key + ' start');
	}

	preload() {
		console.log('preload on ' + this.scene.key + ' start');
		this.load.tilemapTiledJSON("my-tilemap", "assets/tilemaps/my-tilemap.json");
		this.load.image("my-tileset", "assets/tilesets/my-tileset.png");

		this.load.spritesheet("slime", "assets/spritesheets/slime.png", {frameWidth: 64, frameHeight: 64});
		this.load.json("slime-json", "assets/spritesheets/slime.json");
	}
	  
	create() {
		console.log('create on ' + this.scene.key + ' start');
		console.log(this);
		//debug grid
		this.add.grid(0, 0, 1000, 1000, 10, 10, 0x057605);

		///////////////////////////
		// create world
		///////////////////////////		
		//load tilemap
		this.map = this.make.tilemap({key: "my-tilemap"});

		//load tileset
		this.tileset = this.map.addTilesetImage("my-tileset");

		//create layers
		this.layer1 = this.map.createStaticLayer("Tile Layer 1", this.tileset, 0, 0);

		//set collision for tile layer
		this.layer1.setCollisionByProperty({collides: true});

		//create collision boxes
		this.matter.world.convertTilemapLayer(this.layer1);


		///////////////////////////
		// create player
		///////////////////////////
		this.player.create();

	}

	  
	update(timeElapsed, dt) {

		this.player.update(timeElapsed, dt);
	
	}
}

