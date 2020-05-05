<template>
  <el-header class="header">
    <div class="header-logo">9yun Admin</div>
    <!-- <div class="toggle-button" @click="toggleBtn">
      <span>|||</span>
    </div> -->
    <el-menu :default-active="activeIndex"
              class="el-menu-demo menu" 
              mode="horizontal" 
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#00ac89">
      <el-menu-item >{{userData.username}}</el-menu-item>
      <el-menu-item>
        <a @click="toLogin">退出登录</a>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script scoped>
  export default {
    name: 'HeaderContent',
    data() {
      return {
        activeIndex: '',
        activeIndex2: '',
        userData: []
        // isLWeith: false
      }
    },
    methods: {
      toLogin() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 发射事件总线收起菜单栏
      // toggleBtn() {
      //   this.isLWeith = !this.isLWeith
      //   this.$bus.$emit('toggleBtn')
      // }
    },
    created () {
      this.userData = this.$store.state.userData
    }
  }
</script>

<style scoped>
  .menu {
    width: auto;
    float: right;
  }

  .header-logo {
    text-align: center;
    color: #FFF;
    font-size: 26px;
    height: 100%;
    float: left;
    width: 200px;
  }

</style>
