<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="商品名称不能重复" type="info" center show-icon></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-position="top">
        <!-- Tabs栏区域 -->
        <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClickTabs">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(/kg)" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader v-model="addGoodsForm.goods_cat" :options="categoriesDate" :props="expandTrigger"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 动态参数列表数据 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-form-item>
              <el-upload class="upload-demo" :action="imgUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headerObj"
                :on-success="handSucess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce">
            </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addShopBtn" class="add-shop-btn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imageDialogVisible"
      width="30%">
      <img :src="fileRealPath" alt="" class="imgVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categories, cateAttributes, addGoods } from 'network/goods'
import _ from 'lodash'

export default {
  name: 'GoodsAdd',
  data () {
    return {
      // 图片预览对话框显示or隐藏
      imageDialogVisible: false,
      // 动态参数选择参数的id
      cateParamsList: [],
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 级联分类列表数据
      categoriesDate: [],
      // 图片真实路径
      fileRealPath: '',
      // 级联选择框配置数据
      expandTrigger: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      // 步骤条进度
      activeIndex: '0',
      // tabs栏方向
      tabPosition: 'left',
      // 图片上传路径
      imgUpload: 'http://47.115.124.102:8888/api/private/v1/upload',
      // 请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 表单数据
      addGoodsForm: {
        goods_name: '', // 商品名称
        goods_cat: '', // 以','分割的分类列表
        goods_price: 0, // 价格
        goods_number: 0, // 数量
        goods_weight: 0, // 重量
        goods_introduce: '', // 介绍
        pics: [], // 上传的图片临时路径
        attrs: [] // 商品的参数
      },
      // 表单验证
      addGoodsRules: {
        goods_name: [
          { required: true, message: '商品名称未填写', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格未填写', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量未填写', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量未填写', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '商品分类未选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击添加商品
    addShopBtn() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的输入项!')
        // 正常代码逻辑
        // 深拷贝, 解决处理数据时,与级联选择器冲突问题 
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        const res = await addGoods(form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('商品添加成功!')
        this.$router.push('/goods')
      })
    },
    // 处理图片预览效果
    handlePreview(file) {
      // 获取图片真实路径
      this.fileRealPath = file.response.data.url 
      this.imageDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 获取需要移除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中, 找到这个图片对应的索引值
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 调用splice方法, 移除图片
      this.addGoodsForm.pics.splice(i, 1)
    },
    // 图片上传成功的事件
    handSucess(res) {
      const picInfo = {
        pic: res.data.tmp_path
      }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 被选中的tabs实例
    async tabClickTabs() {
      if (this.activeIndex === '1') {
        const res = await cateAttributes(this.cateId, 'many')
        if (res.meta.status !== 200) return this.$message.error('动态分类数据获取失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const res = await cateAttributes(this.cateId, 'only')
        if (res.meta.status !== 200) return this.$message.error('静态分类数据获取失败')
        this.onlyTableData = res.data
      }
    },
    // 标签页切换事件
    beforeLeave(activeName, oldActiveName) {
      if (this.activeIndex === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('商品分类未选择!')
        return false
      }
    },
    // 级联选择框选择后
    handleChange() {
      // 判断是否选择的是三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        return
      }
    },
    // 获取分类数据
    async categories() {
      const res = await categories()
      if (res.meta.status !== 200) return this.$message.error('分类数据获取失败')
      this.categoriesDate = res.data
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      } 
      return null
    }
  },
  created () {
    this.categories()
  }
}
</script>

<style scoped>
  .el-steps {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .imgVisible {
    width: 100%;
    height: 400px;
  }

  .add-shop-btn {
    margin-top: 20px;
  }
</style>
