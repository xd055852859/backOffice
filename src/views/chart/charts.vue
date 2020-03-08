<template>
  <div class="chart" id="chart" v-loading="loading">
    <div class="left">
      <div class="chart-title">
        <div class="chart-subtitle">{{nowTime}} 时光平台总用户</div>
        <div
          class="chart-num"
          @mouseenter="()=>{this.dataImg=require('@/assets/overDataIcon.svg')}"
          @mouseleave="()=>{this.dataImg=require('@/assets/dataIcon.svg')}"
        >
          {{navArray[0].total}}
          <img :src="dataImg" @click="showDataMsg" />
        </div>
      </div>
      <div id="chart_map"></div>
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item,index) in navArray" :key="index">
          <div
            class="chart-nav"
            @click="changeStatisticalCharts(index)"
            :style="{backgroundImage: 'url('+ item.checkIcon+')',backgroundRepeat: 'no-repeat',backgroundPosition: '95% 95%',backgroundSize:'40%'}"
          >
            <!-- :style="chartType===index?'background: #E9F6FF':'background: #fff'" -->
            <div class="chart-nav-title">{{item.title}}</div>
            <div class="chart-nav-info">
              <div class="chart-text">
                <div>
                  <div style="fontSize: 16px;marginBottom:3px">{{item.total}}</div>
                  <div style="fontSize: 10px">{{item.name}}</div>
                </div>
                <div>
                  <div style="fontSize: 16px;marginBottom:3px">{{item.todayAdd}}</div>
                  <div style="fontSize: 10px">今日新增</div>
                </div>
              </div>
              <!-- <div class="chartIcon-container">
                <img :src="chartType===index?item.checkIcon:item.uncheckIcon" class="chartIcon">
              </div>-->
            </div>
          </div>
        </el-col>
      </el-row>
      <el-date-picker
        v-model="timeValue"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="getChartTime"
        style="marginTop:16px"
      ></el-date-picker>
      <div id="chart_example"></div>
      <!-- <el-row :gutter="20" class="chart-info">
        <el-col :span="8">
          <div class="chart-info-item">
            <div class="chart-info-title">活跃用户</div>
            <div class="chart-info-userinfo" v-for="(item,index) in 5" :key="index">
              <div class="chart-info-user">
                <img :src="require('@/assets/avatar.jpg')" class="chart-info-avatar">
                <div>郑天龙</div>
              </div>
              <div>2919</div>
              <div>2919</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-info-item">
            <div class="chart-info-title">热门微站</div>
            <div class="chart-info-userinfo" v-for="(item,index) in 5" :key="index">
              <div class="chart-info-user">
                <img :src="require('@/assets/avatar.jpg')" class="chart-info-avatar">
                <div>郑天龙</div>
              </div>
              <div>2919</div>
              <div>2919</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-info-item">
            <div class="chart-info-title">热门频道</div>
            <div class="chart-info-userinfo" v-for="(item,index) in 5" :key="index">
              <div class="chart-info-user">
                <img :src="require('@/assets/avatar.jpg')" class="chart-info-avatar">
                <div>郑天龙</div>
              </div>
              <div>2919</div>
              <div>2919</div>
            </div>
          </div>
        </el-col>
      </el-row>-->
    </div>
    <div class="right">
      <div class="chart-item">
        <div class="chart-item-header">待处理事项</div>
        <div class="chart-item-container">
          <div class="chart-item-info" v-for="(item,index) in needDo" :key="index">
            <div @click="toTargetPage(item.name)">
              <div class="chart-item-num">{{item.count}}</div>
              <div class="chart-item-title">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-safe">
        <div class="chart-safe-title">
          <div class="chart-safe-title-name">安全</div>
          <div class="chart-safe-title-time">前24小时</div>
        </div>
        <div class="chart-safe-info">
          <div class="chart-safe-info-name">5</div>
          <div>
            <div
              class="chart-safe-info-container"
              v-for="(item,index) in 3"
              :key="index"
            >0 次云服务器暴力破解成功</div>
          </div>
        </div>
      </div>
      <!-- <div id="chart_middle"></div> -->
      <!-- <div class="chart_article">
        <div class="chart-info-title">热门文章</div>
        <div class="chart-info-article" v-for="(item,index) in 5" :key="index">
          <img :src="require('@/assets/avatar.jpg')" class="chart-article-picture">
          <div class="chart-info-container">
            <div class="chart-info-subtitle">情牵水乡乌镇</div>
            <div class="chart-info-username">
              <div>吴熙</div>
              <div class="chart-info-type">走在路上</div>
            </div>
            <div class="chart-info-tool">
              <div>83289</div>
              <div>83289</div>
              <div>83289</div>
            </div>
          </div>
        </div> 
      </div>-->
    </div>
    <DataMsg v-if="dataShowState" />
  </div>
</template>

<script>
import api from "../../api/index";
// const obj = require("../../common/walden.json");
const obj = require("../../common/chalk.json");
import moment from "moment";
import chartJson from "./chart";
import { mapState, mapActions } from "vuex";
import DataMsg from "./dataMsg/dataMsg";
export default {
  name: "Chart",
  components: {
    DataMsg
  },
  data: () => {
    return {
      dataImg: require("@/assets/dataIcon.svg"),
      startTime: new Date().setHours(0, 0, 0, 0) - 86400 * 1000 * 8,
      endTime: new Date().setHours(0, 0, 0, 0) + 86400 * 1000 * 2,
      mapData: [],
      mapNumData: [],
      mapObj: {},
      needDo: [],
      loading: true,
      navArray: [
        {
          title: "用户数",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon0.svg"),
          uncheckIcon: require("@/assets/uncheckIcon0.svg"),
          subtitle: "新增用户数"
        },
        {
          title: "登录数",
          name: "总登录",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon5.svg"),
          uncheckIcon: require("@/assets/uncheckIcon3.svg"),
          subtitle: "登录软件数"
        },
        {
          title: "文章",
          name: "总文章",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon1.svg"),
          uncheckIcon: require("@/assets/uncheckIcon1.svg"),
          subtitle: "文章数量"
        },
        {
          title: "家庭树",
          name: "总数",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon2.svg"),
          uncheckIcon: require("@/assets/uncheckIcon2.svg"),
          subtitle: "家庭树数量"
        },
        {
          title: "谱目",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon3.svg"),
          uncheckIcon: require("@/assets/uncheckIcon3.svg"),
          subtitle: "谱目数量"
        },
        {
          title: "影像文件",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon3.svg"),
          uncheckIcon: require("@/assets/uncheckIcon3.svg"),
          subtitle: "影像文件数量"
        }
      ],
      appIdArr: [],
      chartType: 0,
      timeValue: 0,
      nowTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    toTargetPage(name) {
      name === "待审核精选文章" ? this.$router.push({ name: "article" }) : null;
    },
    createChart(myChartData) {
      this.$echarts.registerTheme("chalk", obj);
      let myChart = this.$echarts.init(
        document.getElementById("chart_example"),
        "chalk"
      );
      let chartMap = this.$echarts.init(
        document.getElementById("chart_map"),
        "chalk"
      );
      // let chartMiddle = this.$echarts.init(
      //   document.getElementById("chart_middle"),
      //   "walden"
      // );
      let myChartOption = chartJson.getMyChartOption(
        this.navArray[this.chartType].subtitle,
        myChartData
      );
      // let chartMiddleOption = chartJson.getChartMiddleOption(myChartData);
      var data = this.mapNumData;
      var geoCoordMap = this.mapObj;
      let convertData = function(data) {
        let res = [];
        for (var i = 0; i < data.length; i++) {
          let geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        console.log("??", res);
        return res;
      };

      function renderItem(params, api) {
        var coords = [
          [116.7, 39.53],
          [103.73, 36.03],
          [112.91, 27.87],
          [120.65, 28.01],
          [119.57, 39.95]
        ];
        var points = [];
        for (var i = 0; i < coords.length; i++) {
          points.push(api.coord(coords[i]));
        }
        var color = api.visual("color");

        return {
          type: "polygon",
          shape: {
            points: echarts.graphic.clipPointsByRect(points, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            })
          }
          // style: api.style({
          //   fill: color,
          //   stroke: echarts.color.lift(color)
          // })
        };
      }

      let option = {
        // backgroundColor: '#404a59',
        // title: {
        //   text: "全国用户登录统计图",
        //   subtext: "login data",
        //   sublink: "http://growth.qingtime.cn",
        //   left: "center",
        //   textStyle: {
        //     color: "#fff"
        //   }
        // },
        tooltip: {
          trigger: "item"
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: "water",
                elementType: "all",
                stylers: {
                  color: "#044161"
                }
              },
              {
                featureType: "land",
                elementType: "all",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "boundary",
                elementType: "geometry",
                stylers: {
                  color: "#064f85"
                }
              },
              {
                featureType: "railway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "highway",
                elementType: "geometry",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "highway",
                elementType: "geometry.fill",
                stylers: {
                  color: "#005b96",
                  lightness: 1
                }
              },
              {
                featureType: "highway",
                elementType: "labels",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.fill",
                stylers: {
                  color: "#00508b"
                }
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "green",
                elementType: "all",
                stylers: {
                  color: "#056197",
                  visibility: "off"
                }
              },
              {
                featureType: "subway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "manmade",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "local",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "labels",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "boundary",
                elementType: "geometry.fill",
                stylers: {
                  color: "#029fd4"
                }
              },
              {
                featureType: "building",
                elementType: "all",
                stylers: {
                  color: "#1a5787"
                }
              },
              {
                featureType: "label",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              }
            ]
          }
        },
        series: [
          {
            name: "pm2.5",
            type: "scatter",
            coordinateSystem: "bmap",
            data: convertData(data),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#ddb926"
              }
            }
          },
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "bmap",
            data: convertData(
              data
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 6)
            ),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            showEffectOn: "emphasis",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#f4e925",
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            zlevel: 1
          }
          // {
          //     type: 'custom',
          //     coordinateSystem: 'bmap',
          //     renderItem: renderItem,
          //     itemStyle: {
          //         normal: {
          //             opacity: 0.5
          //         }
          //     },
          //     animation: false,
          //     silent: true,
          //     data: [0],
          //     z: -10
          // }
        ]
      };
      myChart.clear();
      chartMap.clear();
      // chartMiddle.clear();
      myChart.setOption(myChartOption);
      chartMap.setOption(option);
      // chartMiddle.setOption(chartMiddleOption);
      this.loading = false;
    },
    async getStatisticalCharts(startTime, endTime, appIdArr, chartType) {
      let myChartData = {};
      let res = await api.Home.getStatisticalCharts({
        token: localStorage.getItem("token"),
        startTime: startTime,
        endTime: endTime,
        appIdArr: appIdArr,
        chartType: chartType
      });
      console.log("请求", res);
      if (res && res.msg === "OK") {
        myChartData.legendData = Object.assign(res.appNameArr);
        myChartData.xAxisData = Object.assign(Object.keys(res.result));
        myChartData.seriesData = [];
        myChartData.legendData.map((item, index) => {
          myChartData.seriesData.push({
            name: item,
            type: "line",
            stack: "总量",
            data: new Array(myChartData.xAxisData.length).fill(0)
          });
        });

        for (let key in res.result) {
          let resultIndex = res.timeArr.indexOf(key);
          res.result[key].map((item, index) => {
            if (res.appIdArr.indexOf(item.app) !== -1) {
              myChartData.seriesData[res.appIdArr.indexOf(item.app)]["data"][
                resultIndex
              ] = item.count;
            }
          });
        }
        console.dir(myChartData);
        this.createChart(myChartData);
      }
    },
    getChartTime() {
      this.startTime = this.timeValue[0].getTime();
      this.endTime = this.timeValue[1].getTime();
      this.getStatisticalCharts(
        this.timeValue[0].getTime(),
        this.timeValue[1].getTime(),
        this.appIdArr,
        this.chartType
      );
    },
    changeStatisticalCharts(type) {
      this.chartType = type;
      this.getStatisticalCharts(
        this.startTime,
        this.endTime,
        this.appIdArr,
        type
      );
    },
    showDataMsg() {
      this.$store.dispatch("changeDataShowState", true);
    }
  },
  async mounted() {
    let newObj = {};
    let newIndex = 0;
    this.nowTime = moment(new Date().getTime()).format("YYYY-MM-DD");
    let res = await api.Home.summaryStatistics({
      token: localStorage.getItem("token")
    });
    if (res && res.msg === "OK") {
      res.result.map((item, index) => {
        this.navArray[index].total = item.total;
        this.navArray[index].todayAdd = item.todayAdd;
      });
      this.needDo = res.needDo;
      console.log(this.needDo);
    }
    let mapRes = await api.Home.getUserLocation({
      token: localStorage.getItem("token")
    });
    if (mapRes && mapRes.msg === "OK") {
      let mapDataName = [
        ...new Set(
          mapRes.result.map((item, index) => {
            item = JSON.stringify(item);
            return item;
          })
        )
      ];

      mapRes.result.forEach((item, index) => {
        let newItem = JSON.stringify(item);
        if (!isNaN(item[0]) && !isNaN(item[1])) {
          if (newObj[newItem]) {
            newObj[newItem] = newObj[newItem] + 1;
          } else {
            newObj[newItem] = 1;
          }
        }
      });
      for (let key in newObj) {
        this.mapNumData.push({
          name: "用户聚集地" + newIndex,
          value: newObj[key]
        });
        this.mapObj["用户聚集地" + newIndex] = JSON.parse(key);
        newIndex++;
      }
      this.getStatisticalCharts(this.startTime, this.endTime, "", "0");
    }
    // this.$nextTick(() => {

    // })
  },
  computed: {
    ...mapState({
      dataShowState: state => state.chart.dataShowState
    })
  }
};
</script>

<style>
@import "chart.css";
</style>
