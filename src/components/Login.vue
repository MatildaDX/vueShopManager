<template>
  <div id="login">
    <el-card class="box-card">
      <div class="login-title">
        <h2>用户登录</h2>
      </div>
      <el-form ref="formDate" :model="formDate" :rules="rules">
        <el-form-item label="用户名 :" prop="username">
          <el-input v-model="formDate.username"></el-input>
        </el-form-item>
        <el-form-item label="密码 :" prop="password">
          <el-input v-model="formDate.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="onSubmit('formDate')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {postLogin} from 'network/login'

  export default {
    name: 'Login',
    data () {
      return {
        formDate: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
           { required: true, message: '请输入用户名称', trigger: 'blur' }
          ],
          password: [
           { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      open(msg, type) {
        this.$message({
          duration: 1000,
          message: msg,
          type: type
        })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postLogin(this.formDate.username, this.formDate.password).then(res => {
              if (res.meta.status !== 200) return this.open('登录失败', 'warning')
              this.open('登录成功', 'success')
              window.sessionStorage.setItem('token', res.data.token)
              this.$router.push('/home')
            }, err => {
              this.open('登录失败, 请检查网络后重试', 'warning')
            })
          } else {
            this.open('登录失败, 请检查网络后重试', 'warning')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>

  #login {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  .login-title {
    width: 100%;
    height: 50px;
    text-align: center;
  }

  .box-card {
    width: 480px;
    height: auto;
  }

  .login-button {
    width: 100%;
  }
</style>
