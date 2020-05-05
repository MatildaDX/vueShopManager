<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索视图 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="searchClear">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="addUserBtn" type="primary" @click="addDdialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格渲染视图 -->
      <el-table :data="userList" style="width: 100%" :lazy="true">
        <el-table-column type="index"/>
        <el-table-column prop="username" label="姓名"/>
        <el-table-column prop="role_name" label="职位"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="mobile" label="手机"/>
        <el-table-column label="状态">
          <!-- scope.row: 当前数据 -->
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findUser(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setUserInfo(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图展示 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 分页视图结束 -->
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="提示" :visible.sync="addDdialogVisible" width="30%" @close="closeAddVisible">
      <!-- 对话框表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名称:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input type="password" v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input type="email" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框表单结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddVisible()">重置</el-button>
        <el-button @click="addDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="upUserDialogVisible" width="30%"
      @close="closeUpVisible">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="用户名称:" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input type="email" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setUserRulesDialog" width="30%">
      <div class="setUserRoles">
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <span>分配新角色：</span>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesInfo"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRulesDialog = false">取 消</el-button>
        <el-button type="primary" @click="setUserRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, 
        putUserState,
        addUser, 
        findUser, 
        editUser,
        deleteUser 
} from 'network/users'
import { getRoles, setUserRole } from 'network/rights'

export default {
  name: 'User',
  data () {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      var Ereg = new RegExp("^[a-z0-9A-Z]+[-|a-z0-9A-Z._]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
      if (!Ereg.test(value)) {
        callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    // 自定义手机验证规则
    var checkMobile = (rule, value, callback) => {
      var Mreg = /^1[3-9]\d{9}$/
      if (!Mreg.test(value)) {
        callback(new Error("请输入合法的手机号码"))
      }
      callback()
    }
    return {
      // 获取用户参数
      queryInfo: {
        // 搜索参数
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 用户数据
      userList: [],
      // 总条数
      total: 0,
      // 控制添加用户对话框显示or隐藏
      addDdialogVisible: false,
      // 控制修改用户对话框显示or隐藏
      upUserDialogVisible: false,
      // 控制分配角色对话框的显示or 隐藏
      setUserRulesDialog: false,
      // 存放角色信息
      userInfo: {},
      // 查询指定用户信息表单
      editForm: {},
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile:''
      },
      // 添加表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 ~ 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '密码长度在 5 ~ 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户表单规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 ~ 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 储存所有角色
      rolesInfo: [],
      // 选择的角色
      selectRoleId: ''
    }
  },
  // 进入页面请求数据
  created () {
    this.getUsers()
  },
  methods: {
    // 分配角色
    async setUserRoles() {
      const userId = this.userInfo.id
      const res = await setUserRole(userId, this.selectRoleId)
      if(res.meta.status !==  200) return this.$message.error(res.meta.msg)
      this.setUserRulesDialog = false
      this.$message.success('分配成功')
      this.getUsers()
    },
    // 展示分配角色对话框
    async setUserInfo(userList) {
      this.userInfo = userList
      // 获取所有角色
      const {data: res} = await getRoles()
      this.rolesInfo = res
      this.setUserRulesDialog = true
    },
    // 删除用户信息
    deleteUser(id) {
      this.$confirm('此操作将永久删除数据,是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          if (res.meta.status !== 200) return  this.$message.error('删除失败!请检查网络后重试')
          // 重新请求数据
          this.getUsers()
          // 提示成功
          this.$message.success('删除成功')
        }, err => {
          this.$message.error('网络错误,请刷新重试!')
        })
      }).catch(err => err)
    },
    // 修改用户信息
    editUserInfo(fromName) {
      this.$refs[fromName].validate(valid => {
        if (!valid) return this.$message.error('请检查表单输入是否正确!')
        editUser(this.editForm)
        .then(res => {
          // 关闭对话框
          this.upUserDialogVisible = false
          // 重新获取数据
          this.getUsers()
          // 提示成功
          this.$message.success('用户数据修改成功')
        }, err => {
          this.$message.error('网络错误,请刷新重试!')
        })
      })
    },
    // 查询用户信息
    findUser(id) {
      findUser(id).then(res => {
        if (res.meta.status !== 200) return this.$message.error('请检查表单输入是否正确')
        this.editForm = res.data
        this.upUserDialogVisible = true
      }, err => {
        this.$message.error('网络错误,请刷新重试!')
      })
    },
    // 添加用户事件
    addUser(fromName) {
      this.$refs[fromName].validate(valid => {
        if (!valid) return this.$message.error('添加失败,请刷新重试')
        // 发送数据  接口问题 不做处理
        addUser(this.addForm).then(res => {
          if (res.meta.status !== 201) return this.$message.error("数据请求失败,请检查网络后重试")
          // 关闭对话框
          this.addDdialogVisible = false
          // 重新拉取数据
          this.getUsers()
          // 提示
          this.$message.success('添加成功')
        })
      })
    },
    // 监听修改用户对话矿关闭事件
    closeUpVisible() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听关闭添加用户对话框事件
    closeAddVisible() {
      this.$refs.addFormRef.resetFields()
    },
    // 清空搜索框重新发送
    searchClear() {
      this.getUsers()
    },
    // 修改用户状态值
    userStateChange(userInfo) {
      this.putUserState(userInfo)
    },
    // 当前的页数
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUsers()
    },
    // 每页展示的数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    // 搜索功能
    searchBtn() {
      this.getUsers()
    },
    // 修改用户状态值
    putUserState(userInfo) {
      // userInfo.mg_state = !userInfo.mg_state
      putUserState(userInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error('修改用户状态失败')
        this.$message.success('修改用户状态成功')
      }, err => {
        this.$message.error('网络不稳定,请刷新重试')
      })
    },
    // 发送数据请求事件
    getUsers() { 
      getUsers(this.queryInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.userList = res.data.users
        this.total = res.data.total
      }, err => {
        this.$message.error('获取用户列表失败,请刷新后重试')
      })
    }
  }
}
</script>

<style scoped>
  .setUserRoles {
    line-height: 40px;
  }
</style>
