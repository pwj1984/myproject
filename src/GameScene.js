var GameLayer = cc.Layer.extend({
    mapPanel:null, //装糖果的容器
    mapWidht:null, //容器内所有糖果的宽
    mapHeight:null, //容器内所有糖果的高
    isCanClick:true,

    gameUi:null,
    level:null,
    score:null,
    stept:null,
    targetScore:null,

    ctor:function () {
        this._super();
        this.mapWidht = Constant.Candy_width * Constant.Col;
        this.mapHeight = Constant.Candy_width * Constant.Row;
        var size = cc.winSize;

        var bg = new cc.Sprite("res/bg.jpg");
        bg.setAnchorPoint(new cc.Point(0,0));
        this.addChild(bg,0);


        this.level = Storage.getLevel();
        this.score = Storage.getScore();
        this.stept = Constant.levels[this.level].limitStep;
        this.targetScore = Constant.levels[this.level].targetScore;
        this.gameUi = new GameUi();
        this.addChild(this.gameUi, 2);
        this.gameUi.setLeve(this.level + 1);
        this.gameUi.setScore(this.score);
        this.gameUi.setStept(this.stept);

        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 1);
        this.mapPanel = new cc.Layer();
        this.mapPanel.setPositionY((size.height - Constant.Candy_width * Constant.Row)/2);
        this.mapPanel.setPositionX((size.width - Constant.Candy_width * Constant.Col)/2);
        clippingPanel.addChild(this.mapPanel);

        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this.mapPanel.x,this.mapPanel.y),
            cc.p(this.mapPanel.x+Constant.Candy_width*Constant.Col,this.mapPanel.y+Constant.Candy_width*Constant.Row),
            cc.color(0,0,0), 1, cc.color(0,0,0));
        clippingPanel.stencil = stencil;

        if("touches" in cc.sys.capabilities){
            console.log("touches in");
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this._onTouchBegan.bind(this)
            }, this.mapPanel);
        } else {
            console.log("MOUSE in");
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this._onMouseDown.bind(this)
            }, this.mapPanel);
        }


        return true
    },



    onEnter:function () {
        console.log("onEnter");
        this._super()
        this.initCandy();
    },

    _onTouchBegan: function (touch, event) {
        console.log("_onTouchBegan");
        this.removeCandy(touch.getLocationX()-this.mapPanel.x, touch.getLocationY()-this.mapPanel.y);
        return true;
    },

    _onMouseDown: function (event) {
        //console.log("_onMouseDown event.x is %f", event.getLocationX() );
        if(!this.isCanClick) return;
        this.removeCandy(event.getLocationX()-this.mapPanel.x, event.getLocationY()-this.mapPanel.y);
    },

    removeCandy:function (x,y) {
        if(x>=0 && x<=this.mapWidht && y>=0 && y<=this.mapHeight){
            var row = Math.floor(y/Constant.Candy_width);
            var col = Math.floor(x/Constant.Candy_width);
            //console.log("row is %d,  col id %d", row, col);
            var targetCandy = this.map[row][col];
            //console.log(" targetCandy row is %d,  col id %d", targetCandy.mRow, targetCandy.mCol);

            var candysToDelete = [targetCandy];
            var i = 0;
            while (i < candysToDelete.length){
                var candy = candysToDelete[i];//目前用于检查的糖果，要分析它的上下左右的糖果是否有相同。
                var candyTemp = null;
                //上
                if(candy.mRow < (Constant.Row-1)){
                    //console.log("candy.mRow is%d,  (Constant.Row-1)is%d", candy.mRow, (Constant.Row-1) );
                    candyTemp = this.map[candy.mRow + 1][candy.mCol];
                    if((candyTemp.mType == candy.mType) && (candysToDelete.indexOf(candyTemp)<0) ){
                        candysToDelete.push(candyTemp);
                    }
                }
                //下
                if(candy.mRow > 0){
                    //console.log("candy.mRow is%d", candy.mRow);
                    candyTemp = this.map[candy.mRow - 1][candy.mCol];
                    if((candyTemp.mType == candy.mType) && (candysToDelete.indexOf(candyTemp)<0) ){
                        candysToDelete.push(candyTemp);
                    }
                }
                //左
                if(candy.mCol > 0){
                    candyTemp = this.map[candy.mRow][candy.mCol-1];
                    if((candyTemp.mType == candy.mType) && (candysToDelete.indexOf(candyTemp)<0) ){
                        candysToDelete.push(candyTemp);
                    }
                }
                //右
                if(candy.mCol < (Constant.Col-1) ){
                    candyTemp = this.map[candy.mRow][candy.mCol+1];
                    if((candyTemp.mType == candy.mType) && (candysToDelete.indexOf(candyTemp)<0) ){
                        candysToDelete.push(candyTemp);
                    }
                }
                i ++;
            }

            //console.log("remove arr length is:%d", candysToDelete.length);

            //删除candysToDelete里的成员
            if(candysToDelete.length > 1){
                for(i=0; i<candysToDelete.length; i++){
                    var candyTemp = candysToDelete[i];
                    this.mapPanel.removeChild(candyTemp);
                    this.map[candyTemp.mRow][candyTemp.mCol] = null;
                }

                //消除后，上面的糖果掉下来
                this.fallAndCreateCandy();

                //计算得分
                this.checkWinOrFail(candysToDelete.length);
            }

        }
    },

    fallAndCreateCandy:function () {
        this.isCanClick = false;
        var theMaxDuration = 0;
        for(var c=0; c<Constant.Col; c++){
            var nullCount = 0;
            var tempCandy = null;
            for(var r=0; r<Constant.Row; r++)
            {//剩余的糖果往下移动。
                tempCandy = this.map[r][c];
                if (tempCandy == null) {
                    nullCount ++;
                }
                else
                {
                    if(nullCount != 0){
                        this.map[r-nullCount][c] = tempCandy;
                        this.map[r][c] = null;
                        tempCandy.mRow -= nullCount;
                        var duration = Math.sqrt(2*nullCount/Constant.FALL_ACCELERATION);
                        var action = cc.moveTo(duration, tempCandy.x, Constant.Candy_width*(r-nullCount+0.5)).easing(cc.easeIn(2));
                        tempCandy.runAction(action);
                    }
                }
            }

            {//根据nullCount，创建新的糖果，并实现下落动作
                for(var i=0; i<nullCount; i++){
                    var newCandy = Candy.createCandy(Constant.Row-nullCount+i, c);
                    newCandy.x = (c + 0.5) * Constant.Candy_width;
                    newCandy.y = (Constant.Row+i+0.5) * Constant.Candy_width;
                    this.mapPanel.addChild(newCandy);
                    this.map[Constant.Row-nullCount+i][c] = newCandy;

                    var duration = Math.sqrt(2*nullCount/Constant.FALL_ACCELERATION);
                    if(duration > theMaxDuration) theMaxDuration = duration;
                    var action = cc.moveTo(duration, newCandy.x, (Constant.Row-nullCount+i+0.5) * Constant.Candy_width).easing(cc.easeIn(2));
                    newCandy.runAction(action);
                }
            }
        }

        this.scheduleOnce(this._finishCandyFalls.bind(this), theMaxDuration);
    },

    checkWinOrFail:function (candyLong) {
        this.score += candyLong * candyLong;
        this.stept --;
        console.log("stept is:%d", this.stept);
        this.gameUi.setScore(this.score);
        this.gameUi.setStept(this.stept);

        if(this.score >= this.targetScore)
        {//赢了
            Storage.setLevel(this.level + 1);//保存数据，关卡加1
            Storage.setScore(this.score + this.stept * 30);
            this.gameUi.showWin(this.level + 1);//这里的关卡加1，是因为数组是从0开始计，所以要加1
            this.scheduleOnce(function () {
                cc.director.runScene(new GameScene())
            }, 3);
            return;
        }

        if(this.stept <= 0)
        {//输了
            Storage.setLevel(0);
            Storage.setScore(0);
            this.gameUi.showFail();
            this.scheduleOnce(function () {
                cc.director.runScene(new GameScene())
            }, 3);
        }
    },

    _finishCandyFalls:function () {
        //console.log("_finishCandyFalls()");
        this.isCanClick = true;
    },


    initCandy:function() {
        this.map = [];
        for(var i=0; i<Constant.Row; i++){
            var row = [];
            this.map.push(row);
            for(var j=0; j<Constant.Col; j++){
                var candy = Candy.createCandy(i,j);
                row.push(candy);
                candy.setPositionX(Constant.Candy_width * (j + 0.5));
                candy.setPositionY(Constant.Candy_width * (i + 0.5));
                this.mapPanel.addChild(candy, 1);
            }

        }
    },
});

var GameScene = cc.Scene.extend({
    layer:null,
    gl:null,

    onEnter:function () {
        this._super();
        this.gl = new GameLayer();
        this.addChild(this.gl);
    },

});
