const chart = {
  getMyChartOption(title,data) {
    return {
      title: {
        text: title,
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: data.legendData,
        x: "center",
        y: "top",
        textStyle: {
          color: "#fff"
        }
      },
      grid: {
        left: "2%",
        right: "7%",
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
        data: data.xAxisData,
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
      series: data.seriesData
    };
  },
  getChartMiddleOption(data) {
    return {
      title: {
        text: "各平台用户的占比",
        x: "left",
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   x: "center",
      //   y: "bottom",
      //   data: ["rose1", "rose2", "rose3", "rose4", "rose5"]
      // },
      toolbox: {
        show: true,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ["pie", "funnel"]
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      calculable: true,
      series: [{
        name: "用户数量",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [{
            value: 20,
            name: "home+"
          },
          {
            value: 20,
            name: "面相探索"
          },
          {
            value: 15,
            name: "时光宝库"
          },
          {
            value: 13,
            name: "姓氏宝典"
          },
          {
            value: 10,
            name: "时光慧眼"
          },
          {
            value: 9,
            name: "亲友名片"
          },
          {
            value: 7,
            name: "时光易经"
          },
          {
            value: 6,
            name: "时光基因"
          }
        ]
      }]
    };
  }
}
export default chart
