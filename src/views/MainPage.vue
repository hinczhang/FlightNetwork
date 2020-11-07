<template>
    <el-container>
        <el-main style="padding: 0">
            <global-map/>
        </el-main>
        <el-footer>
            <el-card :body-style="{padding:'0px'}">
                <p class="date">当前时间：{{date|formatDate(this)}}</p>
            </el-card>
        </el-footer>
    </el-container>
</template>

<script>
import GlobalMap from "../components/GlobalMap"
export default {
    components:{
        GlobalMap
    },
    data () {
        return {
            date: new Date()
        }
    },
    methods: {
        setZero(a) {//设置小于10的数字在加0
            return a < 10 ? "0" + a : a;
        },
        formatDate(date, vm) {  //当前时间格式化处理
            var str = "";
            var weekDay = [
                "星期天",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六"
            ];
            str += vm.setZero(date.getFullYear()) + "年"; //获取年份
            str += vm.setZero(date.getMonth() + 1) + "月"; //获取月份
            str += vm.setZero(date.getDate()) + "日"; //获取日
            str += " " + weekDay[date.getDay()]; //获取星期
            str += " " + vm.setZero(date.getHours()) + ":"; //获取时
            str += " " + vm.setZero(date.getMinutes()) + ":"; //获取分
            str += vm.setZero(date.getSeconds()); //获取秒
            return str;
        },
    },
    mounted () {
        var _this = this;
        this.timer = setInterval(() => {
            _this.date = new Date(); // 修改日期数据
        }, 1000);
    },
    destroyed() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除当前日期定时器
        };
    }
}
</script>