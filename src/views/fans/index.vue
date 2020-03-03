<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <div id="main" ref="main2" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
// 导入echarts
import echarts from 'echarts'

export default {
  name: 'Fans',
  // paintPic需要尽早被调用(以便显示图表效果)，要在mounted中调用(此时页面容器已经编译好并渲染完成了)
  mounted () {
    // 绘制图表
    this.paintPic()
  },
  data () {
    return {
      myChart: null // 接收echarts图表对象
    }
  },
  methods: {
    // 绘制图表
    paintPic () {
      let dv = this.$refs.main2
      this.myChart = echarts.init(dv)

      // 饼形图的参数项目
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      // 绘制图表
      this.myChart.setOption(option)

      // 获取数据对图表进行二次填充
      this.getFansStat()
    },
    // 获得对象的成员名称集合
    getkeys (obj) {
      var keys1 = []
      for (var p1 in obj) {
        if (obj.hasOwnProperty(p1)) { keys1.push(p1) }
      }
      return keys1
    },

    // 动态获得服务器真实粉丝数据
    getFansStat () {
      // axios发起请求(该接口不稳定，会提示404，多尝试即可)
      let pro = this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'get'
      })
      pro
        .then(result => {
          // 把粉丝数据封装为option的样子
          // age:{le18:57,le23:71……}
          // 1. 把legend的data数据通过result组织
          let keys = this.getkeys(result.data.data.age)
          // console.log(keys) // ['le18','le23'……]
          // 2. 把series的data数据通过result组织
          let dataObj = []
          let ages = result.data.data.age
          for (var k in ages) {
            // 把 成员的key和value获得出来填充到dataObj里边
            dataObj.push({ value: ages[k], name: k })
          }
          // console.log(dataObj)
          let opt = {
            legend: {
              // data: ['le18', 'le23', 'le30', 'le40', 'le50']
              data: keys
            },
            series: [
              {
                data: dataObj
              }
            ]
          }
          // echarts图表对象调用setOption()
          this.myChart.setOption(opt)
        })
        .catch(err => {
          return this.$message.error('获得粉丝统计数据失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
