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
    private null:cc.Node = null;

    public scrollDir: ScrollDirEnum = ScrollDirEnum.Horizon;
    // public get ScrollDir() { return this.scrollDir; }
    // public set ScrollDir(val) { this.scrollDir = val; }
    private dir: number = 0;
    private coord: cc.Node
    // private aCoord: cc.Vec2 = cc.v2(100 ,100);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.null = this.node.getChildByName("null");
        let title: cc.Label = this.null.getComponent(cc.Label);
        title.string = "换字了！";

        this.coord = this.node.getChildByName("coord");

        this.scrollDir = this.dir as ScrollDirEnum;
        console.log("result:" , this.scrollDir);

        let a: cc.Vec2 = this.coord.convertToNodeSpace(cc.v2(100 ,100));
        let b: cc.Vec2 = this.coord.convertToWorldSpaceAR(cc.v2(100 ,100));
        let c: cc.Vec2 = this.node.convertToWorldSpaceAR(cc.v2(0 , 0));
        let d: cc.Vec2 = this.node.convertToWorldSpace(cc.v2(0 , 0));
        let e: cc.Vec2 = this.node.convertToNodeSpaceAR(cc.v2(0 ,  0));
        let f: cc.Vec2 = this.node.convertToNodeSpaceAR(cc.v2(360 , 640));
        let g: cc.Vec2 = this.node.convertToNodeSpace(cc.v2(360 , 640));

        console.log("a:" + a + "b:" + b + "c:" + c + "d:" + d + "e:" + e + "f:" + f + "g:" + g);

        // let someValue: any = "this is a string";
        // let strLength: number = (<string>someValue).length;
        // console.log("str length:" + strLength);

        let someValue: any = "this is a string";
        let strLength: number = (someValue as string).length;
        let originNumber: number = someValue.length;
        console.log("str length:" + strLength + "origin:" + originNumber);
    }

    start () {

    }

    // update (dt) {}
}

export enum ScrollDirEnum {
    Vertical,
    Horizon
}

