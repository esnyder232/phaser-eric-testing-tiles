import GlobalFuncs from "../global-funcs.js"
import Player from "../player.js"

export default class MyTilesetScene extends Phaser.Scene {
	constructor(config) {
		super(config);

		this.globalfuncs = new GlobalFuncs();
		
		//mapping of actions to keyboard key codes. Export this to external file and load in on game startup.
		this.playerInputKeyboardMap = {
			left: 37,
			right: 39,
			up: 38,
			down: 40,
			jump: 90,
			attackWeak: 88,
			attackStrong: 67,
			start: 13,
			select: 32
		};

		//mapping of actions to gamepad buttons. Export this to external file and load in on game startup.
		this.playerInputGamepadMap = {
			jump: 'a',
			attackWeak: 'x',
			attackStrong: 'y',
			start: 'start',
			select: 'select'
		};

		//keyboard controls to poll from if needed
		this.keyboardControls = {};

		//The actual controller used to control the player.
		this.playerController = {};

		this.player = new Player();
	}

	init() {
		console.log('init on ' + this.scene.key + ' start');

	}

	preload() {
		console.log('preload on ' + this.scene.key + ' start');
		this.load.tilemapTiledJSON("my-tilemap", "assets/tilemaps/my-tilemap.json");
		this.load.image("my-tileset", "assets/tilesets/my-tileset.png");

		this.load.spritesheet("slime", "assets/spritesheets/slime.png", {frameWidth: 16, frameHeight: 16});
		this.load.json("slime-json", "assets/spritesheets/slime.json");
	}
	  
	create() {
		console.log('create on ' + this.scene.key + ' start');

		//debug grid
		this.add.grid(0, 0, 1000, 1000, 10, 10, 0x057605);

		//aliases
		const {Body, Bodies} = Phaser.Physics.Matter.Matter;

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
		//create animations
		this.globalfuncs.createSceneAnimsFromAseprite(this, "slime", "slime-json");

		//create matter sprite
		var xPos = 96;
		var yPos = 70;
		var hitboxWidth = 10;
		var hitboxHeight = 10;

		this.sprite = this.matter.add.sprite(xPos, yPos, "slime", 0);
		var mainBody = Bodies.rectangle(xPos, yPos, hitboxWidth, hitboxHeight);
		this.sprite.setExistingBody(mainBody);
		this.sprite.setFixedRotation();		
		this.sprite.setOrigin(0.5, 0.6); //adjust the sprite drawing location a little up so it fits with the rectangle hit box
		
		//controls
		//create a virtual button for the playerController
		console.log('===Now mapping keyboard')
		for(var key in this.playerInputKeyboardMap)
		{
			var virtualButton = {
					keyCode: 0,
					phaserKeyCode: "",
					state: false,
					prevState: false,
					phaserKeyObj: {}
			};

			//find the phaserKeyCode (its innefficent I know. I don't care)
			for(var phaserKeyCode in Phaser.Input.Keyboard.KeyCodes)
			{
				if(Phaser.Input.Keyboard.KeyCodes[phaserKeyCode] == this.playerInputKeyboardMap[key])
				{
					virtualButton.phaserKeyCode = phaserKeyCode;
					break;
				}
			}

			virtualButton.keyCode = this.playerInputKeyboardMap[key];
			virtualButton.phaserKeyObj = this.input.keyboard.addKey(this.playerInputKeyboardMap[key]);

			this.playerController[key] = virtualButton;
		}

		//for each virtual button, create a listener to change the virutal button's state
		for(var key in this.playerController)
		{
			this.input.keyboard.on("keydown-"+this.playerController[key].phaserKeyCode, this.tempDown, this.playerController[key]);
			this.input.keyboard.on("keyup-"+this.playerController[key].phaserKeyCode, this.tempUp, this.playerController[key]);
		}
	}

	tempDown(e) {
		this.state = true;
	}

	tempUp(e) {
		this.state = false;
	}
	  
	update(timeElapsed, dt) {
		for(var key in this.playerController)
		{
			if(this.playerController[key].state && !this.playerController[key].prevState)
			{
				console.log(key + ' is down (rising edge)');
			}
			else if(this.playerController[key].state)
			{
				console.log(key + ' is down');
			}

			if(!this.playerController[key].state && this.playerController[key].prevState)
			{
				console.log(key + ' is up (falling edge)');
			}
		}



		//other logic here. like state logic, physics, etc...



		//update the prevState on the virtual controller for the player
		for(var key in this.playerController)
		{
			this.playerController[key].prevState = this.playerController[key].state;
		}


		// if(this.myKeyboard.D.isDown === true)
		// {
		// 	console.log('d is down');

		// 	this.sprite.x = this.sprite.x + 64 * (dt/1000);
		// 	this.sprite.anims.play("slime-walk");
		// }
		// else if(this.myKeyboard.A.isDown === true)
		// {
		// 	this.sprite.x = this.sprite.x - 64 * (dt/1000);
		// }

		// if(this.myKeyboard.W.isDown === true) 
		// {
		// 	this.sprite.y = this.sprite.y - 64 * (dt/1000);
		// }
		// else if(this.myKeyboard.S.isDown === true) 
		// {
		// 	this.sprite.y = this.sprite.y + 64 * (dt/1000);
		// }


	
	}
}

