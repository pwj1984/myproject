var Candy = cc.Sprite.extend({
    mRow:0,
    mCol:0,
    mType:1,

    ctor:function (fileName,row, col, type) {
        this._super(fileName);
        this.init(row, col, type);
    },

    init:function (row, col, type) {
        this.mCol = col;
        this.mRow = row;
        this.mType = type;
    }
});

Candy.createCandy = function (row, col) {
    var type = parseInt(Math.random()*5) + 1;
    //console.log("now the random is %d", type);
    return new Candy("res/" + type + ".png", row, col, type);
}