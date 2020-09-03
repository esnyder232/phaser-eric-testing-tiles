import PlayerGroundBaseState from "./player-ground-base-state.js";
import PlayerGroundIdleState from "./player-ground-idle-state.js";

export default class PlayerGroundWalkState extends PlayerGroundBaseState {
	constructor(scene, player) {
		super(scene, player);
	}

	enter(timeElapsed, dt) {
		this.player.sprite.anims.play("slime-walk");
		this.player.sprite.anims.setTimeScale(8/24);
		super.enter(timeElapsed, dt);
	}

	update(timeElapsed, dt) {
		
		
		if(this.player.playerController.right.state)
		{
			this.player.sprite.flipX = false;
			this.player.sprite.setVelocityX(this.player.walkSpeed * (dt/1000));
		}
		else if(this.player.playerController.left.state)
		{
			this.player.sprite.flipX = true;
			this.player.sprite.setVelocityX(-1 * this.player.walkSpeed * (dt/1000));
		}
		else
		{
			this.player.sprite.setVelocityX(0);
			this.player.nextState = new PlayerGroundIdleState(this.scene, this.player);
		}

		super.update(timeElapsed, dt);
	}

	exit(timeElapsed, dt) {
		this.player.sprite.anims.stop();
		super.exit(timeElapsed, dt);
	}
}