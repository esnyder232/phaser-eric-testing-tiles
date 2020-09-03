import PlayerGroundBaseState from "./player-ground-base-state.js";
import PlayerGroundWalkState from "./player-ground-walk-state.js";

export default class PlayerGroundIdleState extends PlayerGroundBaseState {
	constructor(scene, player) {
		super(scene, player);
	}

	enter(timeElapsed, dt) {
		this.player.sprite.anims.play("slime-idle");
		this.player.sprite.anims.setTimeScale(8/24);
		super.enter(timeElapsed, dt);
	}

	update(timeElapsed, dt) {
		if(this.player.playerController.right.state || this.player.playerController.left.state)
		{
			this.player.nextState = new PlayerGroundWalkState(this.scene, this.player);
		}

		super.update(timeElapsed, dt);
	}

	exit(timeElapsed, dt) {
		this.player.sprite.anims.stop();
		super.exit(timeElapsed, dt);
	}
}