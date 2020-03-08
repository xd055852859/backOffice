<template>
  <div class="home" id="home">
    <el-row :gutter="20">
      <el-col :span="4" v-for="(item,index) in navArray" :key="index">
        <div
          class="home-nav"
          @click="changeStatisticalCharts(index)"
          :style="chartType===index?'background: #E9F6FF':'background: #fff'"
        >
          <div class="home-text">
            <div style="font-size: 18px">{{item.title}}</div>
            <div>
              <div style="font-size: 16px;marginBottom:3px">{{item.total}}</div>
              <div style="font-size: 10px">{{item.name}}</div>
            </div>
            <div>
              <div style="font-size: 16px;marginBottom:3px">{{item.todayAdd}}</div>
              <div style="font-size: 10px">今日新增</div>
            </div>
          </div>
          <div class="chartIcon-container">
            <img :src="chartType===index?item.checkIcon:item.uncheckIcon" class="chartIcon">
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
      @change="getChartTime()"
      style="marginTop:16px"
    ></el-date-picker>
    <div id="chart_example"></div>
    <el-row :gutter="40">
      <el-col :span="8">
        <div class="home-chart">
          <div id="chart_left"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="home-chart">
          <div id="chart_middle"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="home-chart">
          <div id="chart_right"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  name: "Home",
  components: {},
  data: () => {
    return {
      startTime: new Date().setHours(0, 0, 0, 0) - 86400 * 1000 * 8,
      endTime: new Date().setHours(0, 0, 0, 0) + 86400 * 1000 * 2,
      navArray: [
        {
          title: "用户数",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon0.svg"),
          uncheckIcon: require("@/assets/uncheckIcon0.svg")
        },
        {
          title: "文章",
          name: "总文章",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon1.svg"),
          uncheckIcon: require("@/assets/uncheckIcon1.svg")
        },
        {
          title: "家庭树",
          name: "总数",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon2.svg"),
          uncheckIcon: require("@/assets/uncheckIcon2.svg")
        },
        {
          title: "谱目",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon3.svg"),
          uncheckIcon: require("@/assets/uncheckIcon3.svg")
        },
        {
          title: "影像文件",
          name: "总用户",
          total: 0,
          todayAdd: 0,
          checkIcon: require("@/assets/checkIcon3.svg"),
          uncheckIcon: require("@/assets/uncheckIcon3.svg")
        }
      ],
      appIdArr: [],
      chartType: 0,
      timeValue: 0,
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
    createChart(myChartData) {
      let myChart = this.$echarts.init(
        document.getElementById("chart_example"),'dark'
      );
      let chart_left = this.$echarts.init(
        document.getElementById("chart_left"),'dark'
      );
      let chart_middle = this.$echarts.init(
        document.getElementById("chart_middle"),'dark'
      );
      let chart_right = this.$echarts.init(
        document.getElementById("chart_right"),'dark'
      );
      let myChartOption = {
        title: {
          text: this.navArray[this.chartType].title
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: myChartData.legendData
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: myChartData.xAxisData,
          axisLine: {
            lineStyle: {
              color: "#57B2DE",
              width: 2
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#57B2DE",
              width: 2
            }
          }
        },
        series: myChartData.seriesData
      };
      let chartLeftOption = {
        // title: {
        //     text: '基础雷达图'
        // },
        tooltip: {},
        legend: {
          x: "right",
          y: "bottom",
          data: ["预算分配", "实际开销"]
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: "销售", max: 6500 },
            { name: "管理", max: 16000 },
            { name: "信息技术", max: 30000 },
            { name: "客服", max: 38000 },
            { name: "研发", max: 52000 },
            { name: "市场", max: 25000 }
          ]
        },
        series: [
          {
            name: "预算 vs 开销（Budget vs spending）",
            type: "radar",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: "预算分配"
              },
              {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: "实际开销"
              }
            ]
          }
        ]
      };
      let chartMiddleOption = {
        title: {
          text: "南丁格尔玫瑰图",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x: "center",
          y: "bottom",
          data: ["rose1", "rose2", "rose3", "rose4", "rose5"]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [30, 110],
            center: ["50%", "50%"],
            roseType: "area",
            data: [
              { value: 10, name: "rose1" },
              { value: 5, name: "rose2" },
              { value: 15, name: "rose3" },
              { value: 25, name: "rose4" },
              { value: 20, name: "rose5" }
            ]
          }
        ]
      };

      let chartRightOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["邮件营销", "直接访问", "搜索引擎"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value"
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        series: [
          {
            name: "邮件营销",
            type: "bar",
            stack: "总量",
            data: [320, 332, 401, 434, 490, 530, 550]
          },
          {
            name: "直接访问",
            type: "bar",
            stack: "总量",
            // label: {
            //     normal: {
            //         show: true,
            //         position: 'insideRight'
            //     }
            // },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "bar",
            stack: "总量",
            data: [520, 532, 601, 634, 690, 710, 720]
          }
        ]
      };
      myChart.clear();
      chart_left.clear();
      chart_middle.clear();
      chart_right.clear();
      myChart.setOption(myChartOption);
      chart_left.setOption(chartLeftOption);
      chart_middle.setOption(chartMiddleOption);
      chart_right.setOption(chartRightOption);
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
    }
  },
  async mounted() {
    this.getStatisticalCharts(this.startTime, this.endTime, "", "0");
    let res = await api.Home.summaryStatistics({
      token: localStorage.getItem("token")
    });
    if (res && res.msg === "OK") {
      res.result.map((item, index) => {
        this.navArray[index].total = item.total;
        this.navArray[index].todayAdd = item.todayAdd;
      });
    }
    // this.$nextTick(() => {

    // })
  }
};
</script>

<style>
@import "home.css";
</style>
