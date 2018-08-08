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

    private role: cc.Node = null;
    private rolePreX: number
    private rolePreY: number
    private diffX: number
    private diffY: number
    private deadMinX: number 
    private deadMaxX: number
    private canvasAnX: number
    private canvasAnY: number
    private mapAnX: number
    private mapAnY: number
    private mapDeadMinX: number
    private mapDeadMaxX: number
    
    onLoad () {
        this.role = this.node.getChildByName("role");
        this.rolePreX = this.role.x;
        this.rolePreY = this.role.y;
        this.canvasAnX = this.node.parent.anchorX;
        this.canvasAnY = this.node.parent.anchorY;
        this.mapAnX = this.node.anchorX;
        this.mapAnY = this.node.anchorY;
        this.deadMinX = -this.node.parent.width * this.canvasAnX;
        this.deadMaxX = this.node.parent.width  * (1 - this.canvasAnX);
        this.mapDeadMaxX = this.deadMinX + this.node.width * this.mapAnX;
        this.mapDeadMinX = this.deadMaxX - this.node.width * (1 - this.mapAnX);
        console.log("max:" + this.mapDeadMaxX + "min:" + this.mapDeadMinX);
    }

    start () {

    }

    lateUpdate () {
        this.diffX = this.role.x - this.rolePreX;
        this.diffY = this.role.y - this.rolePreY;

        let newX :number = this.node.x - this.diffX;

        if (newX >= this.mapDeadMinX && newX <= this.mapDeadMaxX) {
            this.node.x -= this.diffX;
            this.node.y -= this.diffY;
        }

        this.rolePreX = this.role.x;
        this.rolePreY = this.role.y;
    }
}
