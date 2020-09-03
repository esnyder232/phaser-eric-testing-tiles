import PlayerGroundBaseState from "./player-ground-base-state.js";
import PlayerGroundWalkState from "./player-ground-walk-state.js";
import PlayerGroundIdleState from "./player-ground-idle-state.js";

//this state is to drive the events AND animation with dt from update
export default class PlayerGroundStrongAttackStateCopy extends PlayerGroundBaseState {
	constructor(scene, player) {
		super(scene, player);
		this.sumTime = 0;
		this.actionFrameStart = 0;  //frame num of animation for start of action
		this.actionFrameEnd = 0;	//frame num of animation for end of action
		this.totalDuration = 10000; //total duration of the animation in ms
		this.totalFrames = 1; //total number of frames in animation
		
		this.msPerFrame = 1000; //calculated duration of each frame in ms
		this.currentAnimFrame = 0; //current frame of the attack

		this.swingState = 0; //0 - swing up. 1 - action. 2 - swing down
		this.animationDone = false;
	}

	enter(timeElapsed, dt) {
		this.player.sprite.anims.play("slime-attackStrong");
		
		this.player.sprite.anims.pause(this.player.sprite.anims.currentAnim.frames[this.currentAnimFrame]);
		this.totalFrames = this.player.sprite.anims.getTotalFrames();
		this.actionFrameStart = 1; //hard coded for now
		this.actionFrameEnd = 2; //hard coded for now
		this.totalDuration = 1000; //hard coded for now

		this.msPerFrame = this.totalDuration/this.totalFrames;

		super.enter(timeElapsed, dt);
	}

	update(timeElapsed, dt) {
		this.sumTime += dt;
		if(this.sumTime >= this.msPerFrame)
		{
			var temp = Math.floor(this.sumTime / this.msPerFrame);
			this.sumTime %= this.msPerFrame;
			this.currentAnimFrame += temp;
			if(this.currentAnimFrame >= this.totalFrames && this.swingState == 2)
			{
				this.currentAnimFrame = this.totalFrames - 1;
				this.animationDone = true;
			}
			else if (this.currentAnimFrame >= this.totalFrames)
			{
				this.currentAnimFrame = this.totalFrames - 1;
			}
			this.player.sprite.anims.pause(this.player.sprite.anims.currentAnim.frames[this.currentAnimFrame]);
		}

		switch(this.swingState)
		{
			case 0:
				//enter action
				if(this.currentAnimFrame >= this.actionFrameStart)
				{
					this.currentAnimFrame = this.actionFrameStart;
					this.player.sprite.anims.pause(this.player.sprite.anims.currentAnim.frames[this.currentAnimFrame]);
					this.swingState = 1;

					//create hitbox here
					this.createHitbox();
				}
				break;
			case 1:
				//exit action
				if(this.currentAnimFrame >= this.actionFrameEnd)
				{
					this.currentAnimFrame = this.actionFrameEnd;
					this.player.sprite.anims.pause(this.player.sprite.anims.currentAnim.frames[this.currentAnimFrame]);
					this.swingState = 2;

					//delete hitbox here
					this.deleteHitbox();
				}
				break;
			case 2:
				if(this.animationDone)
				{
					this.player.sprite.anims.stop();
					this.player.nextState = new PlayerGroundIdleState(this.scene, this.player)
				}
				break;
		}

		super.update(timeElapsed, dt);
	}

	exit(timeElapsed, dt) {
		this.player.sprite.anims.stop();
		this.deleteHitbox();
		super.exit(timeElapsed, dt);
	}

	createHitbox() {
		
	}

	deleteHitbox() {

	}
}