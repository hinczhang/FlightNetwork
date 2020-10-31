<template>
  <div>
    <div id="container" style="height:500px;width:500px"></div>
  </div>
</template>

<script>
import echarts from "echarts"
import "echarts-gl"
export default {
	data () {
    return {

    }
  },
  mounted(){
    this.drawGlobal();
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
                    texture: '../asset/pisa.hdr',
                    diffuseIntensity: 0.2
                }
            }
        }   
      }
      var chart=echarts.init(document.getElementById("container"));
      chart.setOption(option);
    }
  }

};
</script>

<style scoped>
.amap-page-container {
  height: 100%;
}
</style>