import PlayerGroundBaseState from "./player-ground-base-state.js";
import PlayerGroundWalkState from "./player-ground-walk-state.js";

//this state is to drive the events from the animation
export default class PlayerGroundStrongAttackState extends PlayerGroundBaseState {
	constructor(scene, player) {
		super(scene, player);
	}

	enter(timeElapsed, dt) {
		this.player.sprite.anims.play("slime-attackStrong");
		this.player.sprite.anims.setTimeScale(2/24);
		this.player.sprite.anims.setRepeat(0);
		super.enter(timeElapsed, dt);

		console.log(this.player.sprite.anims.duration)
	}

	update(timeElapsed, dt) {
		//console.log('animation progress: ' + this.player.sprite.anims.getProgress() + ", isPlaying:" + this.player.sprite.anims.isPlaying);
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