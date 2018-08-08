// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private speed: cc.Vec2 = cc.v2(0 , 0);
    private maxSpeed: cc.Vec2 = cc.v2(400 , 600);
    private readonly jumpSpeed: number = 1800;
    private direction: number = 0;
    private isJumping: boolean = false
    private collisionX: number = 0
    private collisionY: number = 0
    private prePosition: cc.Vec2 = cc.v2()
    private preStep: cc.Vec2 = cc.v2()
    private readonly gravity: number = -2000
    private readonly drag: number = 1500


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this)
        } , this.node);
    }

    start () {
    }

    onEnable(){
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    onDisable(){
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

    //other是产生碰撞的另一个碰撞组件，self是产生碰撞的自身的碰撞组件。
    onCollisionEnter(other , self){
        // this.node.color = cc.Color.RED;

        console.log("enter");
        let otherAabb = other.world.aabb;
        let otherPreAabb = other.world.preAabb.clone();
        let selfAabb = self.world.aabb;
        let selfPreAabb = self.world.preAabb.clone();

        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        console.log("speed x:" + this.speed.x + "self max:" + selfPreAabb.xMax + "other max:" + otherPreAabb.xMax
            + "self min:" + selfPreAabb.xMin + "other min:" + otherPreAabb.xMin + "parent:" + this.node.parent.position);

         if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                console.log("right pre:" + this.node.x + "width:" + selfPreAabb.width);
                this.node.x = otherPreAabb.xMin - selfPreAabb.width - 1 - this.node.parent.x;
                console.log("right:" + this.node.x);
                this.collisionX = 1;
            }
            this.speed.x = 0;
            other.touchingX = true;
        }

        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

         if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.isJumping = false;
                this.collisionY = -1;
            }
            else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
            }
            
            this.speed.y = 0;
            other.touchingY = true;
        }   

    }

    onCollisionStay(other , self){
        // console.log("stay");
        if (this.collisionY === -1) {
            if (other.node.group === 'Platform') {
                var motion = other.node.getComponent('PlatformMotion');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
            }
        }
    }

    onCollisionExit(other , self){
        console.log("exit");
        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.isJumping = true;
        }
    }

    private onKeyPressed(keyCode): void{
        switch(keyCode){
            case cc.KEY.left:
            case cc.KEY.a:
                this.direction = -1;
                break;
            case cc.KEY.right:
            case cc.KEY.d:
                this.direction = 1;
                break;    
            case cc.KEY.up:
            case cc.KEY.w:
                if (!this.isJumping) {
                    this.isJumping = true;
                    this.speed.y = this.jumpSpeed;
                }
                break;

        }
    }

    private onKeyReleased(keyCode): void{
        switch(keyCode){
            case cc.KEY.a:
            case cc.KEY.d:
            case cc.KEY.left:
            case cc.KEY.right:
                this.direction = 0;
            break;
        }
    }

    update (dt) {

        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x < 0) {
                    this.speed.x = 0;
                }
                }else if (this.speed.x < 0) {
                    this.speed.x += this.drag * dt;
                    if (this.speed.x > 0) {
                        this.speed.x = 0;
                    }
            }
        }else{
            this.speed.x += this.direction * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.direction * this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;

    }
}
