<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="weidth: 400px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  import { reports } from "network/orders";

  export default {
    name: 'Reports',
    data () {
      return {
        // 需要合并的配置项
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    // 此时页面上的元素已经被渲染完毕了
    async mounted () {
      const {data: res} = await reports()
      // 2. 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 3. 准备数据和配置 
      const option = _.merge(res, this.options)
      // 4. 展示数据
      myChart.setOption(option);
    }
  }
</script>

<style>

</style>