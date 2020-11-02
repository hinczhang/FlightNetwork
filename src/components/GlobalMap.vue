<template>
  <div>
    <el-select v-model="value" placeholder="Please choose mode" style="position:absolute;z-index:100;left:0">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div id="container" style="height:100%;width:100%">
      
    </div>
    
  </div>
</template>

<script>
import echarts from "echarts"
import "echarts-gl"
import axios from "axios"

export default {
	data () {
    return {
      routes:[],
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
      }],
      value: ''
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

    readData(){
      axios.post('http://127.0.0.1:5000/api/index',{
        mode: 1
      }).then(res=>{
        this.routes=res.data.routes;
        this.drawGlobal();
      }).catch(err=>{
        console.log(err);
      })
    }
  }

};
</script>

<style scoped>
.amap-page-container {
  height: 100%;
}
</style>