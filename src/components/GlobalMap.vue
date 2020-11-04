<template>
  <div>
    <el-row class="dashboard-style">
      <el-dropdown :hide-on-click="false" trigger="click" style="float:right;top:20px;right:30px;">
        <span class="el-dropdown-link">
          <i class="el-icon-s-operation el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" style="width:350px" >
          <div class="father-drop"><el-dropdown-item>时间：
            <el-date-picker
              style="float:right;margin-bottom:8px"
              v-model="date"
              :clearable="false"
              type="date"
              placeholder="选择日期"
              @change="date_change"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-dropdown-item >
          </div>
          <el-dropdown-item :divided="true">关于</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <el-row>
      <!-- <div style="position:relative;top:180px"><el-card :body-style="{padding:'0px', height: '100px', width:'100px'}"></el-card></div> -->
      <el-card :body-style="{ padding: '0px', height:'750px' }" v-loading="loading">
        <el-col :span="7">
          <el-card :body-style="{ padding: '0px' }">
            55
          </el-card>
        </el-col>
        <el-col :span="14"><div id="container" style="height:750px;width:100%"></div></el-col>
        <el-col :span="3">dfdfddssdfdsfdsfsdfdsffdsf</el-col>
      </el-card>
    </el-row>    
  </div>
</template>

<script>
import echarts from "echarts"
import "echarts-gl"
import axios from "axios"

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt.replace(/-/g,"");
}

function setDate(date){

}

export default {
	data () {
    return {
      routes:[],
      date:1577808000000,
      date_str:'20200101',
      date_list:[],
      value: '',
      pickerOptions:{
          disabledDate(time){
            let _s = 1577808000000;
            let _e = 1588262399000;
            return time.getTime() > _e || time.getTime() < _s;
        }
      },
      loading: false
    }
  },
  mounted(){
    this.readData()
  },
  methods: {
    drawGlobal(){
      var routes=this.routes
      var option={
        globe: {
            baseTexture: require("../assets/world.jpg"),
            heightTexture: require("../assets/world.jpg"),
            displacementScale: 0.04,
            shading: 'realistic',
            environment: 'rgba(255,255,255,1)',
            realisticMaterial: {
                roughness: 0.9
            },
            postEffect: {
                enable: true
            },
            viewControl:{
              autoRotate:false
            },
            light: {
                main: {
                    intensity: 5,
                    shadow: true
                },
                ambientCubemap: {
                    texture: "../asset/pisa.hdr",
                    diffuseIntensity: 0.2
                }
            }
        },
        series: {
            type: 'lines3D',
            coordinateSystem: 'globe',
            effect: {
                show: true,
                trailWidth: 2,
                trailLength: 0.15,
                trailOpacity: 1,
                trailColor: 'rgb(30, 30, 60)'
            },

            lineStyle: {
                width: 1,
                color: 'rgb(50, 50, 150)',
                // color: 'rgb(118, 233, 241)',
                opacity: 0.1
            },
            blendMode: 'lighter',
            data: routes
        }
      }
      var chart=echarts.init(document.getElementById("container"));
      chart.setOption(option);
    },

    date_change(e){
      e=dateFormat("YYYY-mm-dd",e);
      this.loading=true;
      axios.post('http://127.0.0.1:5000/api/index',{
         mode: 2,
         date:e
      }).then(res=>{
        this.routes=res.data.routes;
        this.drawGlobal();
        this.loading=false;
      }).catch(err=>{
        console.log(err)
      })
    },

    readData(){
      axios.post('http://127.0.0.1:5000/api/index',{
         mode: 1
      }).then(res=>{
        this.date_list=res.data.date_list;
      }).catch(err=>{
        console.log(err)
      })

      this.loading=true;
      axios.post('http://127.0.0.1:5000/api/index',{
         mode: 2,
         date:this.date_str
      }).then(res=>{
        this.routes=res.data.routes;
        this.drawGlobal();
        this.loading=false;
      }).catch(err=>{
        console.log(err)
      })
    }
  }

};
</script>

<style scoped>
.amap-page-container {
  height: 100%;
}
.dashboard-style{
  background-color: rgb(55,25,15);
  height: 80px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #b6b3b3;
}
.el-dropdown{
  font-size: 40px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

</style>

<style>
.father-drop .el-input__inner{
  background-color: #fff0 !important;
  border: 0px solid #dfe2ea !important;
}
</style>