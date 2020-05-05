<template>
  <el-container>
    <!-- 头部区域 -->
    <header-content class="header"></header-content>
    <!-- 页面主体区域 -->
    <el-container class="content-container">
      <!-- 左侧侧边栏 -->
      <aside-content class="main-aside" :menus-list="menusList"></aside-content>
      <!-- 右侧内容 -->
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 尾部内容 -->
    <el-footer>本系统由Vue, Element UI提供技术支持。</el-footer>
  </el-container>
</template>

<script>
import HeaderContent from 'views/header/Header'
import AsideContent from 'views/aside/Aside'

import {getMenus} from 'network/home'

export default {
  name: 'Home',
  data () {
    return {
      menusList: []
    }
  },
  created () {
    document.title = 'Vue电商管理系统'
    this.getMenusList()
  },
  methods: {
    getMenusList() {
      getMenus().then(res => {
        if (res.meta.status !== 200) return this.open(res.meta.msg, 'error')
        this.menusList = res.data
      }, err => {
        this.$message.error('网络出现波动, 请刷新重试')
      })
    }
  },
  components: {
    HeaderContent,
    AsideContent
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #FFF;
    color: #333;
    text-align: center;
  }
  
  .el-main {
    background-color: #e9edf1;
    color: #333;
  }

  .header {
    background-color: #545c64;
  }

  .content-container {
    height: calc(100vh - 120px);
  }

  .main {
    width: 100%
  }
</style>
