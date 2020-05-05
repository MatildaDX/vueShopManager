<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
    </el-card>
  </div>
</template>

<script>
import {getRightsList} from 'network/rights'

export default {
  name: 'Rights',
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList('list')
  },
  methods: {
    getRightsList(list) {
      getRightsList(list)
      .then(res => {
        this.rightsList = res.data
      }, err => {
        this.$message.error('网络错误,请刷新后重试!')
      })
    }
  }
}
</script>

<style>

</style>