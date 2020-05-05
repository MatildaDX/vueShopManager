<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索视图区域 -->
      <el-row :guttet="20">
        <el-col :span="7">
           <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="addGoodsBtn" type="primary" @click="addBtn">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格展示区域 -->
      <el-table :data="goodsList" border class="tableData">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="800"></el-table-column>
        <el-table-column label="商品单价">
          <template slot-scope="scoped">
            {{ scoped.row.goods_price | fullPrice }}
          </template>
        </el-table-column>
        <el-table-column label="商品重量">
          <template slot-scope="scoped">
            {{ scoped.row.goods_weight | fullWeight }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column prop="hot_mumber" label="热销数量"></el-table-column>
        <el-table-column label="上架时间" width="160">
          <template slot-scope="scoped">
            {{ scoped.row.add_time | fullFormat() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scoped.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scoped.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图 -->
      <el-pagination
        @size-change="goodsSizeChange"
        @current-change="goodsCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { goods, deleteGoods } from 'network/goods'

export default {
  name: 'Goods',
  data () {
    return {
      // 搜索数据
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 页码
        pagesize: 8 // 每页显示多少条
      },
      // 商品数据
      goodsList: [],
      // 分页数据
      total: 0
    }
  },
  methods: {
    // 跳转添加商品
    addBtn() {
      this.$router.push('/goods/add')
    },
    // 根据 id 删除商品
    async deleteGoods(row) {
      const comfirmResule = await this.$confirm('此操作将永久删除数据,是否继续?','警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmResule != 'confirm') return
      const res = await deleteGoods(row.goods_id)
      if (res.meta.status !== 200) return this.$message.error('数据请求失败')
      this.getGoods()
      this.$message.success('删除数据成功!')
    },
    // 清空
    clearSearch() {
      this.queryInfo.query = ''
      this.getGoods()
    },
    // 搜索
    searchGoods() {
      this.getGoods()
    },
    // 每页展示多少条
    goodsSizeChange(size) {
      this.queryInfo.pagesize = size
      // 重新拉取数据请求
      this.getGoods()
    },
    // 页码
    goodsCurrentChange(num) {
      this.queryInfo.pagenum = num
      // 重新拉取数据请求
      this.getGoods()
    },
    // 查询所有数据
    async getGoods() {
      const res = await goods(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    }
  },
  filters: {
    fullPrice(price) {
      return price + '$'
    },
    fullWeight(weight) {
      return weight + '/kg'
    }
  },
  created () {
    this.getGoods()
  }
}
</script>

<style scoped>
  .addGoodsBtn {
    margin-left: 20px;
  }

  .tableData {
    margin-top: 20px;
  }
</style>