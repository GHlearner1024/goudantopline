<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu
        background-color="#353B4E"
        text-color="#fff"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/home" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
         <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/article">文章列表</el-menu-item>
          <el-menu-item index="/comment">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="/fans" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div id="lt">
          <i
            slot="prefix"
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            style="cursor:pointer;"
            @click="isCollapse=!isCollapse"
          ></i>
          <h2 style="color:pink">哔哩哔哩拜年祭</h2>
        </div>
        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:300px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40" />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <!--给子组件设置占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入公共bus的vue对象
import bus from '@/utils/bus.js'
export default {
  data () {
    return {
      isCollapse: false, // false:展开   true:折叠
      tmpname: '', // 临时账户名称
      tmpphoto: '' // 临时账户头像
    }
  },
  // 计算属性应用
  computed: {
    // 获得账户名称
    name: function () {
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    // 获得账户头像
    photo: function () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  created () {
  // 1. 对  名称  进行更新
    bus.$on('upAccountName', nm => {
    // 更新sessionStorage中name的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = nm
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpname
      this.tmpname = nm
    })
    // 2. 对  名称  进行更新
    bus.$on('upAccountPhoto', ph => {
    // 更新sessionStorage中photo的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = ph
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpphoto
      this.tmpphoto = ph
    })
  },
  methods: {
    // 退出系统
    logout () {
      // 确认
      this.$confirm('确认要退出系统么?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清空sessionStorage数据
          window.sessionStorage.clear()
          // 导航到登录页面
          this.$router.push({ name: 'login' })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    transition: all 1s;
    background-image: url(http://i0.hdslb.com/bfs/archive/7197cae46569a49abd98e0c51348068831be6a85.png);
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px;
    height: 80px;
    #lt {
      height: 100%;
      width: 40%;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      img{border-radius: 50%;transition: all 0.2s}
      img:hover{transform: scale(1.5)}
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
    .el-main {
      background-color: #f2f3f5;
    }
  }
}
</style>
