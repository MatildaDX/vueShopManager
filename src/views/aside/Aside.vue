<template>
  <el-menu class="el-menu-vertical-demo" :style="isCollapse ? 'width: 66px' : 'width: 220px'"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#00ac84"
    unique-opened
    :default-active="activeState"
    router>
    <!-- 收起菜单栏 -->
    <div class="toggle-button" @click="toggleBtn">
      <span>|||</span>
    </div>
    <!-- 一级菜单 -->
    <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
      <template slot="title">
        <i :class="iconObj[item.id]"></i>
        <span>{{item.authName}}</span>
      </template> 
      <!-- 二级菜单 -->
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.id">
        <el-menu-item :index="'/' + subItem.path" @click="saveNavState(subItem.path)">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: 'Aside',
    props: {
      menusList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {
        iconObj: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-menu',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-claim',
          '145': 'el-icon-s-data',
        },
        // 菜单折叠
        isCollapse: false,
        // 保存激活状态值
        activeState: ''
      }
    },
    created () {
      this.activeState = window.sessionStorage.getItem('activePath')
    },
    methods: {
      // 保存菜单激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', '/' + activePath)
      },
      toggleBtn() {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style scoped>
  .el-aside{
    height: 100%;
    background-color: #545c64;
  }

  .el-menu {
    border-right: none;
  }

  
  .toggle-button {
    display: inline-block;
    width: 100%;
    background-color: #409eff;
    cursor: pointer;
    color: #FFF;
    text-align: center;
    letter-spacing: .1em;
    line-height: 24px;
  }

  .toggle-icon {
    font-size: 30px;
  }
</style>
