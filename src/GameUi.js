var GameUi = cc.Layer.extend({
    stept:null, //还剩下多少步
    score:null, //总得分
    leve:null, //第几关

    ctor:function () {
        this._super();
        var size = cc.director.getWinSize();

        var label = new cc.LabelTTF("leve:", "arial", 36);
        label.setColor(cc.color(0,0,0));
        label.y = size.height - 50;
        label.x = 80;
        this.addChild(label);

        this.leve = new cc.LabelTTF("", "arial", 36);
        this.leve.setColor(cc.color(0xff,0,0));
        this.leve.x = label.x;
        this.leve.y = label.y - 40;
        this.addChild(this.leve);


        label = new cc.LabelTTF("score:", "arial", 36);
        label.setColor(cc.color(0,0,0));
        label.x = 350;
        label.y = size.height - 50;
        this.addChild(label);

        this.score = new cc.LabelTTF("", "arial", 36);
        this.score.setColor(cc.color(0xff,0,0));
        this.score.x = label.x;
        this.score.y = label.y - 40;
        this.addChild(this.score);


        label = new cc.LabelTTF("step:", "arial", 36);
        label.setColor(cc.color(0,0,0));
        label.x = 620;
        label.y = size.height - 50;
        this.addChild(label);

        this.stept = new cc.LabelTTF("", "arial", 36);
        this.stept.setColor(cc.color(0xff,0,0));
        this.stept.x = label.x;
        this.stept.y = label.y - 40;
        this.addChild(this.stept);
    },

    setLeve:function (value) {
          this.leve.setString("" + value);
    },

    setScore:function (value) {
        this.score.setString("" + value);
    },

    setStept:function (value) {
        this.stept.setString("" + value);
    },

    
    showWin:function (level) {
        var size = cc.director.getWinSize();
        var bg = new cc.LayerColor(cc.color(255,255,255), 500, 500);
        bg.x = (size.width - bg.width) / 2;
        bg.y = (size.height - bg.height) / 2;
        this.addChild(bg);

        var label = new cc.LabelTTF("已通过第" + level + "关!", "arial", 50);
        label.setColor(cc.color(0,0,0));
        label.x = (size.width - label.width) / 2 + label.width / 2;
        label.y = (size.height - label.height) / 2 + label.height / 2;
        this.addChild(label);
    },
    
    showFail:function () {
        var size = cc.director.getWinSize();
        var bg = new cc.LayerColor(cc.color(255,255,255), 500, 500);
        bg.x = (size.width - bg.width) / 2;
        bg.y = (size.height - bg.height) / 2;
        this.addChild(bg);

        var label = new cc.LabelTTF("通关失败，请再来！", "arial", 50);
        label.setColor(cc.color(0,0,0));
        label.x = (size.width - label.width) / 2 + label.width / 2;;
        label.y = (size.height - label.height) / 2 + label.height / 2;
        this.addChild(label);
    }
})