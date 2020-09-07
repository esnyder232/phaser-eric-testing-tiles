import GlobalFuncs from "../global-funcs.js"
import PlayerGroundIdleState from "./player-ground-idle-state.js";

//the player class
export default class Player {
	constructor(scene) {
		this.scene = scene;
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

		//other variables
		this.debugCounter = 0;
		this.walkSpeed = 64;
		this.state = null; 
		this.nextState = null;

		this.frameNum = 0;

		//the bottom sensor used to tell if the sprite is on the ground or not
		this.botSensor = {
			isColliding: false,
			body: null,
			unregisterFunctions: [],
			arrBodiesColliding: [] //currently colliding bodies
		};
	}

	create() {
		//aliases
		const {Body, Bodies} = Phaser.Physics.Matter.Matter;

		//create animations
		this.globalfuncs.createSceneAnimsFromAseprite(this.scene, "slime", "slime-json");

		//create matter sprite
		var xPos = 96;
		var yPos = 70;
		var hitboxWidth = 10;
		var hitboxHeight = 10;

		this.sprite = this.scene.matter.add.sprite(xPos, yPos, "slime", 0);
		this.sprite.label = "player";
		
		//controls
		//create a virtual button for the playerController
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
			virtualButton.phaserKeyObj = this.scene.input.keyboard.addKey(this.playerInputKeyboardMap[key]);

			this.playerController[key] = virtualButton;
		}

		//for each virtual button, create a listener to change the virutal button's state
		for(var key in this.playerController)
		{
			this.scene.input.keyboard.on("keydown-"+this.playerController[key].phaserKeyCode, this.tempDown, this.playerController[key]);
			this.scene.input.keyboard.on("keyup-"+this.playerController[key].phaserKeyCode, this.tempUp, this.playerController[key]);
		}
		console.log(this.sprite);


		//initial state
		this.state = new PlayerGroundIdleState(this.scene, this);
		this.state.enter();

		//collision
		var sensorThickness = 4;
		var top = yPos - (hitboxHeight/2);
		var bot = yPos + (hitboxHeight/2);
		var left = xPos - (hitboxWidth/2);
		var right = xPos + (hitboxWidth/2);

		this.mainBody = Bodies.rectangle(xPos, yPos, hitboxWidth, hitboxHeight);
		this.botSensor.body = Bodies.rectangle(xPos, bot, hitboxWidth, sensorThickness, {isSensor: true});

		this.compoundBody = Body.create({
			parts: [this.mainBody, this.botSensor.body],
			frictionStatic: 0,
			frictionAir: 0.02,
			friction: 0.1
		});

		this.sprite.setExistingBody(this.compoundBody);

		this.botSensor.unregisterFunctions.push(this.scene.matterCollision.addOnCollideStart({
			objectA: this.botSensor.body,
			callback: this.onCollideBotSensorStart,
			context: this
		}));

		this.botSensor.unregisterFunctions.push(this.scene.matterCollision.addOnCollideEnd({
			objectA: this.botSensor.body,
			callback: this.onCollideBotSensorEnd,
			context: this
		}));

		this.sprite.setScale(2, 2);
		this.sprite.setFixedRotation();
		this.sprite.setOrigin(0.5, 0.55); //adjust the sprite drawing location a little up so it fits with the rectangle hit box
		this.sprite.setPosition(xPos, yPos);


		
	}

	onCollideBotSensorStart(e) {
		this.botSensor.arrBodiesColliding.push(e.bodyB);
		this.botSensor.isColliding = true;
	}

	
	onCollideBotSensorEnd(e) {
		var objIndex = this.botSensor.arrBodiesColliding.findIndex((x) => {return x === e.bodyB;});
		if(objIndex >= 0)
		{
			this.botSensor.arrBodiesColliding.splice(objIndex, 1);
		}

		if(this.botSensor.arrBodiesColliding.length > 0)
		{
			this.botSensor.isColliding = true;
		}
		else
		{
			this.botSensor.isColliding = false;
		}
		
	}

	
	tempDown(e) {
		this.state = true;
	}

	tempUp(e) {
		this.state = false;
	}
	

	update(timeElapsed, dt) {
		// console.log("===UPDATE STARTED  " + this.frameNum);
		// var direction = 0;

		// if(this.playerController.right.state)
		// {
		// 	this.sprite.anims.play("slime-walk");
		// 	this.sprite.flipX = false;
		// 	direction = 1;
		// }
		// else if(this.playerController.left.state)
		// {
		// 	this.sprite.anims.play("slime-walk");
		// 	this.sprite.flipX = true;
		// 	direction = -1;
		// }
		// else {
		// 	this.sprite.anims.play("slime-idle");
		// 	this.sprite.flipX = false;
		// 	direction = 0;
		// }
		

		// this.sprite.setVelocityX(direction * this.walkSpeed * (dt/1000))

		// if(this.playerController.up.state && !this.playerController.up.prevState)
		// {
		// 	var force = -0.002
		// 	this.sprite.setVelocityY(0);
		// 	var f = new Phaser.Math.Vector2(0, force);
		// 	this.sprite.applyForce(f);
		// }

		// this.debugCounter += dt;
		// if(this.debugCounter >= 1000)
		// {
		// 	console.log(this.sprite.x + ", " + this.sprite.y);
		// 	this.debugCounter %= 1000;
		// }

		this.state.update(timeElapsed, dt);
		
		//update the prevState on the virtual controller for the player
		for(var key in this.playerController)
		{
			this.playerController[key].prevState = this.playerController[key].state;
		}



		


		//change states if needed
		if(this.nextState)
		{
			this.state.exit();
			this.nextState.enter();

			this.state = this.nextState;
			this.nextState = null;
		}

		this.frameNum++;

	
	}
}