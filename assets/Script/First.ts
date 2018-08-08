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
export default class First extends cc.Component {
    private scrollView: cc.ScrollView
    private firstItem: cc.Node;
    private itemArray: Array<cc.Node> = null
    private scrollViewHeight: number
    private itemHeight: number
    private readonly contentStartY: number = 0
    private contentEndY: number;
    private simData: Array<string> = null
    private contentVisiableHeight: number
    private contentRealHeight: number
    private itemVisiableNum: number
    private itemRealNum: number
    private bufferZoneHeight: number;
    private readonly itemSpace: number = 5;
    private offsetHeight: number;
    private isDown: boolean;
    private lastContentY: number = 0

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.simData == null) {
            this.simData = new Array;
        }

        if (this.itemArray == null) {
            this.itemArray = new Array;
        }

        for(let i = 0; i< 100; i++){
            this.simData.push("模拟数据" + i);
        }

        this.scrollView = this.node.getChildByName("scrollView").getComponent(cc.ScrollView);
        this.contentVisiableHeight = this.scrollView.content.height;

        console.log("init contentX:" + this.scrollView.content.x + "contentY:" + this.scrollView.content.y);
        
        cc.loader.loadRes("prefab/item" , cc.Prefab , function(err , prefab){
            if (prefab) {
                this.firstItem = cc.instantiate(prefab);
                this.itemHeight = this.firstItem.height;
                this.itemVisiableNum = Math.ceil(this.contentVisiableHeight / (this.itemHeight + this.itemSpace));
                this.itemRealNum = this.itemVisiableNum * 2;
                this.bufferZoneHeight = this.contentVisiableHeight / 2;
                this.contentRealHeight = this.simData.length * (this.itemHeight + this.itemSpace);
                this.scrollView.content.height = this.contentRealHeight;
                this.offsetHeight = this.itemRealNum * (this.itemHeight + this.itemSpace);

                console.log("itemheight:" + this.itemHeight + "itemvisi" + this.itemVisiableNum + "itemreal:" + this.itemRealNum
                + "buffer:" + this.bufferZoneHeight + "contentvisi:" + this.contentVisiableHeight  + "contenreal:" + this.contentRealHeight);
                
                for(let i = 0; i < this.itemRealNum; i++){
                    let item = cc.instantiate(prefab);
                    item.title = item.getChildByName("title").getComponent(cc.Label);
                    item.title.string = this.simData[i];
                    item.id = i;
                    item.setPositionY(-this.itemHeight / 2 - (this.itemHeight + this.itemSpace) * i);
                    this.scrollView.content.addChild(item);
                    this.itemHeight = item.height;
                    this.itemArray.push(item);
                }
            }
        }.bind(this));
        this.scrollView.node.on("scrolling" , this.onScrolling , this);

        this.node.getChildByName("button").on(cc.Node.EventType.TOUCH_END , function(){
            this.scrollView.scrollToBottom(1 , false);
            console.log("bottom initX:" + this.scrollView.content.x + "---initY:" + this.scrollView.content.y);
        } , this);
    }

    start () {

    }

    private onScrolling(): void
    {
        // console.log("contentX:" + this.scrollView.content.x + "contentY:" + this.scrollView.content.y);
        // console.log("offset:" + this.scrollView.getScrollOffset());

        let position: cc.Vec2 = this.itemArray[0].position;
        console.log("第一个:" + position);
        let worldPosition: cc.Vec2 =  this.scrollView.content.convertToWorldSpaceAR(position);
        console.log("content world:" + worldPosition);
        let inScrollPosition: cc.Vec2 = this.scrollView.node.convertToNodeSpaceAR(worldPosition);
        console.log("in scroll:" + inScrollPosition);

        this.isDown = this.scrollView.content.y > this.lastContentY;
        
        for(let i = 0; i < this.itemArray.length; i ++){
            if (this.isDown) {
                //向下 
                let positionY: number = this.getYInScrollView(this.itemArray[i]);
                let newY = this.itemArray[i].y - this.offsetHeight;
                if (positionY > this.bufferZoneHeight && newY > - this.contentRealHeight) {
                    this.itemArray[i].setPositionY(newY);
                    let newId: number = this.itemArray[i].id + this.itemRealNum;
                    this.itemArray[i].id = newId;
                    this.itemArray[i].title.string = this.simData[newId];
                }
                }else{
                let positionY: number = this.getYscrollViewDown(this.itemArray[i]);
                let newY = this.itemArray[i].y + this.offsetHeight;
                if (positionY < -this.bufferZoneHeight && newY < 0) {
                    this.itemArray[i].setPositionY(newY);
                    let newId: number = this.itemArray[i].id - this.itemRealNum;
                    this.itemArray[i].id = newId;
                    this.itemArray[i].title.string = this.simData[newId];
                }    
             }
        }
    
        this.lastContentY = this.scrollView.content.y;
    }

    private getYInScrollView(item: cc.Node): number{
        let worldPosition: cc.Vec2 = this.scrollView.content.convertToWorldSpaceAR(item.position);
        let inScrollPosition: cc.Vec2 = this.scrollView.node.convertToNodeSpaceAR(worldPosition);
        return inScrollPosition.y + this.itemHeight / 2 - this.scrollView.node.height / 2;
    }

    private getYscrollViewDown(item: cc.Node): number{
        let worldPosition: cc.Vec2 = this.scrollView.content.convertToWorldSpaceAR(item.position);
        let inScrollPosition: cc.Vec2 = this.scrollView.node.convertToNodeSpaceAR(worldPosition);
        return inScrollPosition.y - this.itemHeight / 2 + this.scrollView.node.height / 2;
    }



    // update (dt) {
        
    // }
}
