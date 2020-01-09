<template>
  <el-container class="home-contation">
    <!-- 头部 -->
    <el-header>
      <div class="home_logo">
        <img src="../../assets/img/logo1.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button class="btn" type="info" @click="LoginOut">退出</el-button>
    </el-header>

    <el-container>
      <!-- 左边导航 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">

        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router 
          :default-active="acivePath"
        >
         <div class="btn_collapse" @click="collapseClick">|||</div>
          <!-- 一级菜单栏 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"> </i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 一级菜单栏子菜单栏 -->
            <el-menu-item
              :index="'/' + itemchildren.path"
              v-for="itemchildren in item.children"
              :key="itemchildren.id"
              @click="savNavState('/' + itemchildren.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemchildren.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 图标
      iconfont: {
        '125': '',
        '103': '',
        '101': '',
        '102': '',
        '145': ''
      },
      iscollapse:false,
      acivePath:''
    }
  },
  methods: {
    // 监听 清除本地储存
    LoginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    collapseClick(){
      this.iscollapse = !this.iscollapse  
    },
    // 保存连接的激活状态
    savNavState(acivePath){
         window.sessionStorage.setItem('activePath',acivePath)
         this.acivePath = acivePath
    },





    // 获取左侧菜单数据
    async getmenulist() {
      const { data: res } = await this.$http.get('menus')
      /* console.log(res) */
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  },
  created() {
    this.getmenulist()
    this.acivePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style>
.home-contation {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
}
.el-header .home_logo {
  display: flex;
  height: 60px;
}

.el-header .home_logo img {
  display: block;
  height: 100%;
}
.el-header .home_logo span {
  display: flex;
  align-items: center;
  color: #ffffff;
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-menu{
  border: 0;
}
.el-menu .btn_collapse{
  color: #ffffff;
  line-height: 24px;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s
}
</style>
