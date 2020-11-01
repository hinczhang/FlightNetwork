<template>
  <div>
    <div id="container" style="height:500px;width:500px"></div>
  </div>
</template>

<script>
import echarts from "echarts"
import "echarts-gl"
import axios from "axios"

export default {
	data () {
    return {
      dict: ''
    }
  },
  mounted(){
    this.readData()
  },
  methods: {
    drawGlobal(){
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
        }   
      }
      var chart=echarts.init(document.getElementById("container"));
      chart.setOption(option);
    },

    readData(){
      axios.post('http://127.0.0.1:5000/api/index',{
        mode: 1
      }).then(res=>{
        this.dict=res.data.doc;
        this.drawGlobal();
        console.log(this.dict)
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