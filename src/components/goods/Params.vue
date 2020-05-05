<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 提示区域 -->
      <el-alert type="warning" :closable="false" show-icon
        title="注意：只允许为第三级分类设置相关参数！">
      </el-alert>
      <!-- 头部级联选择区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader :options="cateList" :props="catePages" clearable v-model="cateSelectKeys" @change="cateSelectChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页视图区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag v-for="(tag, i) in scoped.row.attr_vals" :key="tag.attr_id" @close="closeParmasTag(i, scoped.row)" closable>
                  {{tag}}
                </el-tag>
                <!-- 添加标签 -->
                <el-input class="input-new-tag" v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scoped.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsBtn(scoped.row)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParmasBtn(scoped.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="isBtnDisable" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag v-for="(tag, i) in scoped.row.attr_vals" :key="tag.attr_id" @close="closeParmasTag(i, scoped.row)" closable>
                  {{tag}}
                </el-tag>
                <!-- 添加标签 -->
                <el-input class="input-new-tag" v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scoped.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsBtn(scoped.row)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParmasBtn(scoped.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>  
    <!-- 添加属性参数对话框 -->
    <el-dialog :title="'添加' + fullTitle" :visible.sync="addDialogVisible" width="30%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRule" ref="addFormRef">
        <el-form-item :label="fullTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑属性参数对话框 -->
    <el-dialog :title="'添加' + fullTitle" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef">
        <el-form-item :label="fullTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  categories, 
  cateAttributes, 
  addAttributes, 
  findParams, 
  editParams, 
  deleteParams, 
  editParamsTag
} from 'network/goods'

export default {
  name: 'Params',
  data () {
    return {
      // 存放的数据
      cateList: [],
      // 级联选择框对应配置
      catePages: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择器选择绑定数组
      cateSelectKeys: [],
      // 标签页显示
      activeName: 'many',
      // 动态参数数据储存
      manyTableData: [],
      // 静态参数数据储存
      onlyTableData: [],
      // 添加动态参数/静态属性对话框
      addDialogVisible: false,
      // 编辑动态静态对话框
      editDialogVisible: false,
      // 添加对话框表单
      addForm: {
        attr_name: ''
      },
      // 编辑对话框表单
      editForm: {},
      // 编辑对话框表单规则
      editFormRule: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 添加对话框表单规则
      addFormRule: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 删除标签
    async closeParmasTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.activeParams(row)
    },
    // 点击按钮, 展示文i本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick: 当页面上元素被重新渲染后, 才会指定调用方法函数代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    // 文本框失去焦点, 或者 按下回车键
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return 
      }
      // 如果输入合法, 就发送请求
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 调用编辑事件
      this.activeParams(row)
    },
    // 编辑参数下的可选项
    async activeParams(row) {
      const res = await editParamsTag(
        this.cateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(' ')
      )
      if (res.meta.status !== 200) return this.$message.error('添加失败!')
      this.$message.success('编辑成功!')
    },
    // 删除事件
    async deleteParmasBtn(scoped) {
      const comfirmResule = await this.$confirm('此操作将永久删除数据,是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmResule !== 'confirm') return this.$message.warning('用户取消了操作!')
      const res = await deleteParams(scoped.cat_id, scoped.attr_id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.cateSelectChange()
      this.$message.success('删除成功!')
    },
    // 确认编辑
    editParamsConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 
        const res = await editParams(this.editForm)
        if (res.meta.status !== 200) return this.$message.error('请求数据失败!')
        this.editDialogVisible = false
        this.cateSelectChange()
        this.$message.success('编辑成功!')
      })
    },
    // 打开编辑对话框
    async editParamsBtn(scoped) {
      const res = await findParams(scoped.cat_id, scoped.attr_id, this.activeName)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 
        const res = await addAttributes(this.cateId, this.addForm.attr_name, this.activeName, '')
        if (res.meta.status !== 201) return this.$message.error('数据请求失败')
        this.addDialogVisible = false
        this.cateSelectChange()
        this.$message.success('添加成功!')
      })
    },
    // 标签页选择
    handleClick() {
      this.cateSelectChange()
    },
    // 级联选择框每次选择后获取数据
    async cateSelectChange() {
      // 判断选择的是否为三级菜单
      if (this.cateSelectKeys.length !== 3) {
        this.cateSelectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 是三级菜单, 请求数据
      const res = await cateAttributes(this.cateId, this.activeName)
      if (res.meta.status !== 200) return this.$message.error('请求数据失败!')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 标签添加数据
        item.inputValue = ''
        // 添加标签的显示or隐藏
        item.inputVisible = false
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 获取所有分类数据
    async categories(type, pagenum, pagesize) {
      const res = await categories(type, pagenum,pagesize)
      if (res.meta.status !== 200) return this.$message.error('请求分类数据失败!')
      this.cateList = res.data
    },
    // 对话框关闭清空表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    }
  },
  computed: {
    // 按钮是否禁用
    isBtnDisable() {
      return this.cateSelectKeys.length !== 3 ? true : false
    },
    // 计算id
    cateId() {
      if (this.cateSelectKeys.length === 3) {
        return this.cateSelectKeys[2]
      }
      return null
    },
    // 判断 动态属性/静态参数
    fullTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created () {
    this.categories()
  }
}
</script>

<style scoped>
  .el-row {
    height: 20px;
    line-height: 10px;
    margin: 20px;
    margin-left: 0;
  }

  .el-table {
    margin-top: 20px;
  }

  .el-tag { 
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
  }
  
  .input-new-tag {
    margin-left: 10px;
    width: 150px;
  }
</style>
