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
    private pool: cc.NodePool = null
    private label_add: cc.Node
    private label_put: cc.Node
    private label_get: cc.Node
    private readonly prefab_url = "prefab/item"
    private readonly blue_url = "prefab/item_blue"
    private readonly url_array: [] = ["prefab/item" , "prefab/item_blue"]
    private prefab: cc.Prefab;
    private prefab_blue: cc.Prefab
    private addNode: cc.Node
    private blueNode: cc.Node
    private label_blue: cc.Node
    private readonly Ymax = 640
    private readonly Xmax = 360
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        cc.loader.loadResArray(this.url_array , function(err , resource){
            if (resource) {
                this.prefab = resource[0];
                this.prefab_blue = resource[1];
                console.log("load over");
            }else{
                console.log("load failed" , err);
            }
        }.bind(this));

        this.label_add = this.node.getChildByName("add");
        this.label_put = this.node.getChildByName("put");
        this.label_get = this.node.getChildByName("get");
        this.label_blue = this.node.getChildByName("blue")

        if (this.pool == null) {
            this.pool = new cc.NodePool();
        }

        this.pool = new cc.NodePool()

        this.label_blue.on(cc.Node.EventType.TOUCH_END , function(){
            if (this.prefab_blue) {
                this.addNode = cc.instantiate(this.prefab_blue);
                this.node.addChild(this.addNode);
                console.log("size:" + this.pool.size());
            }
        } , this);

        this.label_add.on(cc.Node.EventType.TOUCH_END , function(){
            if (this.prefab) {
                this.addNode = cc.instantiate(this.prefab);
                this.node.addChild(this.addNode);
                console.log("size:" + this.pool.size());
            }
        } , this);

        this.label_put.on(cc.Node.EventType.TOUCH_END , function(){
            this.pool.put(this.addNode);
            console.log("size:" + this.pool.size());
        } , this);

        this.label_get.on(cc.Node.EventType.TOUCH_END , function(){
            let node = this.pool.get();
            if (!node) {
                console.log("node is null");
            }else{
                let x: number = Math.floor((Math.random() * 2 -1) * this.Xmax);
                let y: number = Math.floor((Math.random() * 2 -1) * this.Ymax);
                console.log("x:" + x + " y:" + y);
                node.setPosition(x ,y);
                this.node.addChild(node);
            }
            console.log("size:" + this.pool.size());
        } , this);

    }
    start () {

    }

    // update (dt) {}
}
