<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" class="addRoles" @click="showAddRighetsDialog = true">添加角色</el-button>
      <!-- 表格视图区域 -->
      <el-table :data="rolesData" border>
        <el-table-column type="expand">
          <!-- 展开部分 -->
          <template slot-scope="scope">
            <!-- 循环获取一级菜单 -->
            <el-row :class="['dbButtom', i1 === 0 ? 'dbTop' : '' ]" v-for="(item1, i1) in scope.row.children" :key="i1">
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 循环获取二级菜单 -->
                <el-row v-for="(item2, i2) in item1.children" :key="i2" :class="[i2 === 0 ? '' : 'dbTop' ]">
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 循环获取三级菜单 -->
                    <el-tag  v-for="(item3, i3) in item2.children" :key="i3" type="warning" closable @close="removeRightsById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findRoles(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRighetsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="showRighetsDialog" width="30%" @close="setRightsDialogClosed">
      <el-tree :data="rightsList" :props="treeProps"
                accordion 
                show-checkbox
                node-key="id"
                ref="allotRightsRef"
                :default-checked-keys="keysArray">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRighetsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="showAddRighetsDialog" width="30%">
      <el-form :model="addRoluse" :rules="addRoluseRuls" ref="addRoluseRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoluse.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoluse.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddRighetsDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles('addRoluseRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="showEditRighetsDialog" width="30%">
      <el-form :model="editRoluse" :rules="addRoluseRuls" ref="editRoluseRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoluse.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoluse.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditRighetsDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles('editRoluseRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getRoles, 
  deleteRolesRights, 
  getRightsList, 
  allotReghts,
  addRoles,
  deleteRoles,
  editRoles,
  findRoles
  } from 'network/rights'

export default {
  name: 'Roles',
  data () {
    return {
      // 角色数据
      rolesData: [],
      // 控制分配权限对话框
      showRighetsDialog: false,
      // 控制添加角色对话框
      showAddRighetsDialog: false,
      // 控制编辑角色对话框
      showEditRighetsDialog: false,
      // 权限数据
      rightsList: [],
      // 树形控件属性绑定
      treeProps: {
          children: 'children', // 父子关系维持
          label: 'authName' // 显示什么
      },
      // 默认选中的对象
      keysArray: [],
      // id
      roleId: '',
      // 添加角色数据
      addRoluse: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色数据
      editRoluse: {},
      // 添加角色数据表单验证
      addRoluseRuls: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 添加角色
    addRoles(fromName) {
      this.$refs[fromName].validate(valid => {
        if (!valid) return this.$message.error("请检查表单是否填写正确!")
        addRoles(this.addRoluse).then(res => {
          this.showAddRighetsDialog = false
          this.getRoles()
          this.$message.success('添加成功!')
        }, err => {
          this.$message.error('网络错误,请刷新后重试!')
        })
      })
    },
    // 分配权限
    allotRights() {
      const keys = [
        ...this.$refs.allotRightsRef.getCheckedKeys(),
        ...this.$refs.allotRightsRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      allotReghts(this.roleId, idStr).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('权限分配成功!')
        // 重新拉取数据
        this.getRoles()
        // 关闭对话矿
        this.showRighetsDialog = false
      }, err => {
        this.$message.error('网络错误,请刷新后重试!')
      })
      // this.showRighetsDialog = false
    },
    // 添加权限对话框关闭事件
    setRightsDialogClosed() {
      this.keysArray = []
    },
    // 展示分配权限对话框
    showSetRighetsDialog(role) {
      getRightsList('tree').then(res => {
        if (res.meta.status !== 200) return this.$message.error('数据请求失败,请刷新重试!')
        this.rightsList = res.data
        // 存入roleId
        this.roleId = role.id
        // 通过递归将三级节点存入默认选中对象
        this.getKeysNode(role, this.keysArray)
        this.showRighetsDialog = true
      })
    },
    // 根据id删除对应权限
    removeRightsById(role, rightsId) {
      // 弹框提示用户是否删除
      this.$confirm('是否删除权限? ', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        deleteRolesRights(role.id, rightsId).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除失败,请刷新重试!')
          // 重新渲染
          role.children = res.data
          // 提示成功
          this.$message.success('删除成功')
        }, err => {
          this.$message.error('网络错误,请刷新后重试!')
        })
      }).catch(err => err)
    },
    // 编辑角色
    editRoles(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return this.$message.error('请检查表单是否填入正确!')
        editRoles(this.editRoluse).then(res => {
          this.showEditRighetsDialog = false
          // 重新拉取数据
          this.getRoles()
          // 提示
          this.$message.success('编辑成功!')
        })
      })
    },
    // 展开编辑角色
    findRoles(roleId) {
      findRoles(roleId).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoluse = res.data
      }, err => {
        this.$message.error('网络错误,请刷新重试!')
      })
      this.showEditRighetsDialog = true
    },
    // 删除角色
    deleteRoles(roleId) {
      this.$confirm('删除的数据将无法恢复,是否继续? ', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(roleId).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRoles()
          this.$message.success('删除成功')
        }, err => {
          this.$message.error("网络不稳定,请刷新重试")
        })
      }).catch(err => err)
    },
    // 查询所有角色列表
    getRoles() {
      getRoles().then(res => {
        if (res.meta.status !== 200) return this.$message.error('数据请失败,请刷新网络后重试!')
        this.rolesData = res.data
      }, err => {
        this.$message.error('网络错误,请刷新重试!')
      })
    },
    // 获取三级节点id, 并保存到数组中
    getKeysNode(node, arr) {
      // 如果没有 children ,则是三级的节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果有就往下一层递归
      node.children.forEach(item => this.getKeysNode(item, arr))
    } 
  }
}
</script>

<style>
  .addRoles {
    margin-bottom: 20px;
  }

  .el-tag {
    margin: 10px;
  }

  .dbButtom {
    border-bottom: 1px solid #eee;
  }

  .dbTop {
    border-top: 1px solid #eee;
  }

  .el-row {
    align-items: center;
    display: flex;
  }
</style>
