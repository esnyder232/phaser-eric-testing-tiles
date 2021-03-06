import PlayerBaseState from "./player-base-state.js";
import PlayerGroundIdleState from "./player-ground-idle-state.js";

export default class PlayerDamagedBaseState extends PlayerBaseState {
	
	constructor(scene, player) {
		super(scene, player);
		this.timer = 1000; //ms
	}

	enter(timeElapsed, dt) {
		this.player.sprite.setTint(0xff0000);
		this.player.sprite.applyForce({x: 0.01, y: -0.01});
		super.enter(timeElapsed, dt);
	}

	update(timeElapsed, dt) {
		super.update(timeElapsed, dt);
		this.timer -= dt;

		if(this.timer <= 0)
		{
			this.player.nextState = new PlayerGroundIdleState(this.scene, this.player);
		}
	}

	exit(timeElapsed, dt) {
		this.player.sprite.clearTint();
		super.exit(timeElapsed, dt);
	}
	
}