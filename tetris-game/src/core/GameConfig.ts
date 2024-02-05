export default {
    // 游戏配置
    panelSize: {
        // 横向格子数
        width: 10,
        // 纵向格子数
        height: 20,
    },
    // 下一个方块模块配置
    nextSize: {
        width: 5,
        height: 4
    },
    // 游戏难度随分数变化
    levels: [
        { score: 0, duration: 1000 },
        { score: 100, duration: 900 },
        { score: 300, duration: 800 },
        { score: 500, duration: 700 },
        { score: 800, duration: 600 },
        { score: 1000, duration: 500 },
    ]
}