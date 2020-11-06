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
      <el-card :body-style="{ padding: '0px' }" v-loading="loading">
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px', width: '100%' }" style="background-color: #424242">
            <div slot="header" class="date_head">
              时间：
              <span class="date">{{this.date_str.substring(0,4)+"年"+this.date_str.substring(4,6)+"月"+this.date_str.substring(6,8)+"日"}}</span>
            </div>
            
              <temporal-chart></temporal-chart>
            
          </el-card>
        </el-col>
        <el-col :span="12"><div id="container" style="height:819px;width:100%"></div></el-col>
        <el-col :span="4">
          <el-row>
            <el-card :body-style="{ padding: '0px', width: '100%' }" style="background-color: #424242">
              <div slot="header" class="date_head">空间分析面板</div>
            </el-card>
          </el-row>
          <el-row>
            <el-collapse v-model="activeNames" @change="collapseChange" accordion>
              <div class="collapse">  
                <el-collapse-item title="紧密中心性" name="1">
                  <div>某个节点到达其他节点的难易程度，也就是到其他所有结点距离的平均值的倒数。</div>
                </el-collapse-item>
                <el-collapse-item title="平均邻居度" name="2">
                  <div>返回每个节点的邻居节点的度的平均值。</div>
                </el-collapse-item>
                <el-collapse-item title="度中心性" name="3">
                  <div>是在网络分析中刻画节点中心性的最直接度量指标。一个节点的节点度越大就意味着这个节点的度中心性越高，该节点在网络中就越重要。</div>
                </el-collapse-item>
                <el-collapse-item title="PageRank" name="4">
                  <div>PageRank通过网络浩瀚的超链接关系来确定一个页面的等级。简单的说，一个高等级的页面可以使其他低等级页面的等级提升。</div>
                </el-collapse-item>
                <el-collapse-item title="HITS" name="5">
                  <div>在限定范围之后根据网页的出度和入度建立一个矩阵，通过矩阵的迭代运算和定义收敛的阈值不断对两个向量Authority和Hub值进行更新直至收敛。</div>
                </el-collapse-item>
                <el-collapse-item title="度" name="6">
                  <div>计算网络图中节点的度，即计算与某一节点相连的节点的个数。</div>
                </el-collapse-item>
              </div>
            </el-collapse>
          </el-row>
        </el-col>
      </el-card>
    </el-row>    
  </div>
</template>

<script>
import echarts from "echarts"
import "echarts-gl"
import axios from "axios"
import TemporalChart from "./TemporalChart"
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


export default {
  components:{
    TemporalChart
  },
	data () {
    return {
      routes:[],
      date:1577808000000,
      date_str:'20200101',
      date_list:[],
      value: '',
      val:'',
      pickerOptions:{
          disabledDate(time){
            let _s = 1577808000000;
            let _e = 1588262399000;
            return time.getTime() > _e || time.getTime() < _s;
        }
      },
      loading: true,
      activeNames:'1',
      activeArray:['1','2','3','4','5','6']
    }
  },
  mounted(){
    this.readData()
    
  },
  methods: {
    collapseChange (val) {
      if(this.val==val){
        return
      }
      if(this.activeArray.indexOf(val)>-1){
        this.val=val  
        this.loading=true
        axios.post('http://127.0.0.1:5000/api/index',{
          mode: 5,
          date:this.date_str,
          attribute: val
        }).then(res=>{
          this.drawGlobal(res.data.array);
          //this.loading=false;
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    drawGlobal (point) {
      var compare=this.activeNames;
      var routes=this.routes;
      var series=[{
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
        }];
      series.push({
        type: 'scatter3D',
        coordinateSystem: 'globe',
        blendMode: 'lighter',
        symbolSize: function(value,params){

          if(compare=='1'){
            return params.data.index*400;
          }else if(compare=='2'){
            return params.data.index/3;
          }else if(compare=='3'){
            return params.data.index*600;
          }else if(compare=='4'){
            return params.data.index*15000;
          }else if(compare=='5'){
            return params.data.index*10000;
          }else if(compare=='6'){
            return params.data.index;
          }
        },
        itemStyle: {
          color: 'rgb(50, 50, 150)',
          opacity: 0.3
        },
        emphasis:{
          label:{
            formatter: function(params){
              return params.data.name
            },
            textStyle:{
              color:'black'
            }
          }
        },
        data: point
      })
      var option={
        globe: {
            baseTexture: require("../assets/world.jpg"),
            heightTexture: require("../assets/world.jpg"),
            displacementScale: 0.04,
            shading: 'realistic',
            environment: 'rgba(2,55,55,1)',
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
        series: series
      }
      var chart=echarts.init(document.getElementById("container"));
      chart.setOption(option);
      this.loading=false;
    },

    date_change(e){
      e=dateFormat("YYYY-mm-dd",e);
      this.loading=true;
      this.date_str=e
      axios.post('http://127.0.0.1:5000/api/index',{
         mode: 2,
         date:e
      }).then(res=>{
        this.routes=res.data.routes;
        this.collapseChange("1");
        this.activeNames="1"
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

      
      axios.post('http://127.0.0.1:5000/api/index',{
         mode: 2,
         date:this.date_str
      }).then(res=>{
        this.routes=res.data.routes;
        this.collapseChange("1");

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
.date{
  font-family: "times new roman", times, serif;
  color:#ADAFB3;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 4.2pt;
}
.date_head{
  font-family: "times new roman", times, serif;
  color: #ADAFB3;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 4.2pt;
  word-spacing: 2.2pt;
  line-height: 1.2;
  height: 30px;
}

</style>

<style>
.father-drop .el-input__inner{
  background-color: #fff0 !important;
  border: 0px solid #dfe2ea !important;
}

.collapse .el-collapse-item__header{
  margin-left:10%;
  font-family: verdana, sans-serif;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1.6pt;
} 
.collapse .el-collapse-item__content{
  font-family: "times new roman", times, serif;
  font-size: 13px;
  text-align: left;
  margin-left: 6%;
}
</style>