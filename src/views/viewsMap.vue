<template>
  <div style="width: 100%;height: 100%;overflow: hidden">
    <mapItem :option="ipcQualityOption" class="ipc-gis-chart" :style="screenStyle"></mapItem>
  </div>
</template>

<script>
  import mapItem from '@/common/map/mapItem';
  import mapStyle from './map-style';
  import qs from 'qs';
  import axios from 'axios'
  const NORMAL_COLOR = '#42c683', ALARM_COLOR = '#fd341f';
    export default {
        name: "viewsMap",
      components: {mapItem},
      data(){
          return{
            ipcQualityOption: {
              bmap: {
                zoom: 13,//默认情况下地图缩放级别
                roam: true,//用户是否可以拖放和缩放地图
                mapStyle: { //设置地图模板样式
                  styleJson: mapStyle
                }
              },
              tooltip: {//提示框
                formatter({name, value, color}) {
                  return `<span style="display: inline-block; width: 10px; height: 10px; margin-right: 5px; border-radius: 50%; background-color: ${color}"></span>${name} <br>ipc个数：${value[2]} <br>ipc告警个数：${value[3]}`;
                }
              },
              series: [{ //ECharts中的series
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                symbolSize: 20, //圆点大小
                animation: false //是否开启动画
              }]
            },
            screenStyle: {}
          }
      },
      methods:{
          getMap(){
            let _self=this;
            axios.get("static/api/map.json").then(function(res) {
             let  center=res.data.center,
                  points=res.data.points,
                  series = [{
                    data: []
                  }];
              points.forEach(point => {
                series[0].data.push({
                  name: point.policeOfficeName,
                  value: [point.lng, point.lat, point.ipcNum, point.alarmIpcNum],
                  itemStyle: {
                    color: point.alarmIpcNum > 0 ? ALARM_COLOR : NORMAL_COLOR,
                  },
                  rippleEffect: {
                    brushType: 'stroke',
                    scale: 5 - Number((1 - point.alarmIpcNum / point.ipcNum) * 3).toFixed(1),
                    period: 8 - Number(point.alarmIpcNum / point.ipcNum * 5).toFixed(1)
                  }
                });
              });
              _self.ipcQualityOption = {
                bmap: {
                  center: [center.lng, center.lat] // 当前视角中心位置的坐标
                },
                series
              };
            }).catch(function(error) {

            });
          },
          setScreenStyle() {
            const minScreenWidth = 1600, minScreenHeight = 800;
            if (window.innerWidth >= minScreenWidth) {
              this.screenStyle = {
                width: '100%',
                height: '100%',
                transform: 'none'
              }
            } else {
              this.screenStyle = {
                width: `${minScreenWidth}px`,
                height: `${minScreenHeight}px`,
                transform: `scale(${window.innerWidth / minScreenWidth}, ${window.innerHeight / minScreenHeight})`,
                marginLeft:'-'+(minScreenWidth-window.innerWidth)/2+'px',
                marginTop:'-'+Math.round((minScreenHeight-window.innerHeight)/2)+'px',
              }
            }
          },
      },
      mounted(){
        this.setScreenStyle();
        this.getMap();
        window.addEventListener('resize', this.setScreenStyle);
      }
    }
</script>

