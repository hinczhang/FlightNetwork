<template>
    <div>
        <div id="container1" style="height:250px;width:100%;background-color:#D4D4D4"></div>
        <div id="container2" style="height:250px;width:100%;background-color:#D4D4D4"></div>
        <div id="container3" style="height:250px;width:100%;background-color:#D4D4D4"></div>
    </div>
</template>

<script>
import echarts from "echarts"
import axios from "axios"
export default {
    data () {
        return {
            data:{},
            time:[]
        }
    },
    mounted () {
        this.readTimeData();
    },
    methods: {
        readTimeData(){
            axios.post('http://127.0.0.1:5000/api/index',{
                mode: 4
            }).then(res=>{
                this.time=res.data.date_list;
                this.readData();
            }).catch(err=>{
                console.log(err)
            })

        },
        readData(){
            axios.post('http://127.0.0.1:5000/api/index',{
                mode: 3
            }).then(res=>{
                this.data=res.data.patterns;
                this.drawChart()
            }).catch(err=>{
                console.log(err)
            })
        },
        drawChart(){
            this.drawBasicPatterns()
            this.drawClusterPatterns();
            this.drawActivityPatterns();
        },
        drawBasicPatterns(){
            //nodes and edges
            var option={
                title: {
                    text: '航班和节点日变化'
                },
                grid:{
                    left: '55px',
                    right:'55px'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['nodes', 'edges'],
                    right: 30
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.time,
                },
                yAxis: [
                    {
                        type: 'value',
                        name: 'nodes',
                        max:2500,
                    },
                    {
                        type: 'value',
                        name: 'edges',
                        
                    }
                ],
                
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: [{
                        lte: 25,
                        color: '#FFBABA'
                    }, {
                        gt: 25,
                        lte: 75,
                        color: '#87FF97'
                    }, {
                        gt: 75,
                        lte: 95,
                        color: '#80B7FF'
                    }, {
                        gt: 95,
                        color: '#87FF97'
                    }]
                },
                series: [
                    {
                        name: 'nodes',
                        type: 'bar',
                        showBackground: true,
                        data: this.data.nodes,
                    },
                    
                    {
                        name: 'edges',
                        type: 'line',
                        smooth: true,
                        data: this.data.edges,
                        yAxisIndex: 1,
                        markArea: {
                            data: [ [{
                                name: '正常模式',
                                xAxis: '01-01'
                            }, {
                                xAxis: '01-26'
                            }], [{
                                name: '疫情模式',
                                xAxis: '03-16'
                            }, {
                                xAxis: '04-05'
                            }] ]
                        }
                    }
                ]
            }
            var chart=echarts.init(document.getElementById("container1"));
            chart.setOption(option);
        },
        drawClusterPatterns(){
            //average_clustering and transitivity
            var option={
                title: {
                    text: '聚集和传递性'
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                legend:{
                    data:['average_clustering', 'transitivity'],
                    right: 30
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.time
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 10
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [
                    {
                        name: 'average_clustering',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        },
                        data: this.data.average_clustering
                    },
                    {
                        name: 'transitivity',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            color: 'green'
                        },
                        data: this.data.transitivity
                    }

                ]
            }
            var chart=echarts.init(document.getElementById("container2"));
            chart.setOption(option);
        },
        drawActivityPatterns(){
            //global_efficiency and reciprocity and average_degree
            var option={
                title: {
                    text: '航空网效益和活跃度'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    data: ['global_efficiency', 'reciprocity', 'average_degree'],
                    right: 30
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.time,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                    {
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: 'global_efficiency',
                        type: 'bar',
                        data: this.data.global_efficiency
                    },
                    {
                        name: 'reciprocity',
                        type: 'bar',
                        data: this.data.reciprocity
                    },
                    {
                        name: 'average_degree',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.data.average_degree,
                        lineStyle:{
                            color:'blue'
                        }
                    }
                ]
            }
            var chart=echarts.init(document.getElementById("container3"));
            chart.setOption(option);
        }

    }
    
}
</script>