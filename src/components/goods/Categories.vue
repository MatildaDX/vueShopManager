<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-button type="primary">懒得写了</el-button>
      <el-table :data='categoriesData' border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
import { categories } from 'network/goods'

export default {
  name: 'Categories',
  data () {
    return {
      // 分类数据
      categoriesData: []
    }
  },
  methods: {
    async categories() {
      const res = await categories()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categoriesData = res.data
      this.$message.error('爷懒得写了')
    }
  },
  created () {
    this.categories()
  }
}
</script>

<style scoped>
  .el-table {
    margin-top: 20px;
  }
</style>
