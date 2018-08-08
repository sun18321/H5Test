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
    private direction: number = 0
    private speed:cc.Vec2 = cc.v2(0, 0)
    private readonly maxSpeed: cc.Vec2 = cc.v2(70 , 350)
    private readonly gravity: number = -200
    private readonly drag: number = 1500
    private readonly jumpSpeed: number = 300


    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN , this.keyDown ,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP , this.keyUp ,this);
    }

    start () {

    }

    private keyDown(event): void{
        switch(event.keyCode){
            case cc.KEY.w:
                break;
            case cc.KEY.d:
                this.direction = 1;
                break;
            case cc.KEY.a:
                this.direction = -1;
                break;    
        }
    }

    private keyUp(event): void{
        switch(event.keyCode){
            case cc.KEY.a:
            case cc.KEY.d:
                this.direction = 0;
                break;
            case cc.KEY.w:

                break;    
        }
    }

    update (dt) {
        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) {
                    this.speed.x = 0;
                }
            }else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) {
                    this.speed.x = 0;
                }
            }
        }else{
            this.speed.x += this.direction * this.drag * dt;
            if (Math.abs(this.speed.x) >= this.maxSpeed.x) {
                this.speed.x = this.direction * this.maxSpeed.x;
            }
        }

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    }
}
