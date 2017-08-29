var Storage = {
    getLevel:function () {
        var level = cc.sys.localStorage.getItem("level") || 0;
        return parseInt(level);
    },
    setLevel:function (level) {
        cc.sys.localStorage.setItem("level", level);
    },

    getScore:function () {
        var score = cc.sys.localStorage.getItem("score") || 0;
        return parseInt(score);
    },
    setScore:function (score) {
        cc.sys.localStorage.setItem("score", score);
    }
}