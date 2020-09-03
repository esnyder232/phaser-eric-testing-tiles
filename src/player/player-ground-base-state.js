import PlayerBaseState from "./player-base-state.js";
import PlayerAirAllState from "./player-air-all-state.js";

export default class PlayerGroundBaseState extends PlayerBaseState {
	constructor(scene, player) {
		super(scene, player);
	}

	enter(timeElapsed, dt) {
		super.enter(timeElapsed, dt);
	}

	update(timeElapsed, dt) {
		
		//transfer to in air state
		if(!this.player.botSensor.isColliding)
		{
			this.player.nextState = new PlayerAirAllState(this.scene, this.player);
		}

		//add jump force
		if(this.player.playerController.jump.state && !this.player.playerController.jump.prevState)
		{
			this.player.sprite.applyForce({x: 0, y: -0.01});
		}

		super.update(timeElapsed, dt);
	}

	exit(timeElapsed, dt) {
		super.exit(timeElapsed, dt);
	}
	
}