<template>
  <el-container class="container">
    <el-aside width="12.5%" :style="background" id="aside">
      <div class="logo">
        <img :src="require('@/assets/logo.svg')" class="logo-icon">
        <div class="logo-title">综合管理平台</div>
      </div>
      <el-menu
        :active="activeIndex"
        :unique-opened="true"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <el-menu-item
          :index="'1'"
          v-if="roleArray.indexOf('总览')!==-1"
        >
          <template slot="title">
            <img
              :src="activeIndex==='1'?require('@/assets/indexIcon0.svg'):require('@/assets/unindexIcon0.svg')"
              class="indexIcon"
            >
            <router-link to="/index/home" class="linkName">总览</router-link>
          </template>
        </el-menu-item>
        <template v-for="(item,index) in menu">
          <el-menu-item
            :index="index+2+''"
            :key="index+1"
            v-if="item.submenuItem.length===0 &&roleArray.indexOf(item.submenu)!==-1"
          >
            <template slot="title">
              <img
                :src="activeIndex===index+2+''?item.checkIcon:item.uncheckIcon"
                class="indexIcon"
              >
              <router-link :to="{name:item.to}" class="linkName">{{item.submenu}}</router-link>
            </template>
          </el-menu-item>
          <el-submenu
            :index="index+2+''"
            :key="index+1"
            v-if="item.submenuItem.length>0 &&roleArray.indexOf(item.submenu)!==-1"
          >
            <template slot="title">
              <img
                :src="activeIndex===index+2+''?item.checkIcon:item.uncheckIcon"
                class="indexIcon"
              >
              <router-link :to="{name:item.to}" class="linkName">{{item.submenu}}</router-link>
            </template>
            <el-menu-item
              :index="(index+2)+'-'+(key+1)"
              v-for="(value,key) in item.submenuItem"
              :key="key"
            >
              <router-link
                :to="{name:value.to}"
                class="linkName"
                v-if="roleArray.indexOf(value.link)!==-1"
              >{{value.link}}</router-link>
            </el-menu-item>
          </el-submenu>
        </template>
        <div
          class="loginOut-button"
          @click="logout"
          @mouseenter="()=>{this.dataState=true}"
          @mouseleave="()=>{this.dataState=false}"
          :style="{color:dataState?'#fff':'#C8C9C9'}"
        >
          <img
            :src="dataState?require('@/assets/overLoginoutIcon.svg'):require('@/assets/loginoutIcon.svg')"
            class="loginOut-picture"
          >
          退出系统
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header :style="{height: '80px'}">
        <Header/>
      </el-header>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "../../components/header/header";
export default {
  name: "Index",
  components: {
    Header
  },
  data: () => {
    return {
      activeIndex: "1",
      dataState: false,
      menu: [
        {
          submenu: "权限管理",
          submenuItem: [
            { link: "系统账号管理", to: "userRole" },
            { link: "权限角色管理", to: "role" }
          ],
          checkIcon: require("@/assets/indexIcon1.svg"),
          uncheckIcon: require("@/assets/unindexIcon1.svg"),
          to: ""
        },
        {
          submenu: "用户管理",
          submenuItem: [],
          to: "user",
          checkIcon: require("@/assets/indexIcon2.svg"),
          uncheckIcon: require("@/assets/unindexIcon2.svg")
        },
        {
          submenu: "文章管理",
          submenuItem: [
            { link: "全部文章", to: "article" }
            // { link: "审核文章管理", to: "reviewArticle" },
            // { link: "发布文章", to: "publishArticle" }
          ],
          checkIcon: require("@/assets/indexIcon3.svg"),
          uncheckIcon: require("@/assets/unindexIcon3.svg")
        },
        // {
        //   submenu: "专辑管理",
        //   submenuItem: [],
        //   to: "album",
        //   checkIcon: require("@/assets/indexIcon4.svg"),
        //   uncheckIcon: require("@/assets/unindexIcon4.svg")
        // }
        // {
        //   submenu: "家庭树管理",
        //   submenuItem: [],
        //   icon: "",
        //   to: "familyTree",
        //   checkIcon: require("@/assets/checkIcon1.svg"),
        //   uncheckIcon: require("@/assets/uncheckIcon1.svg")
        // }
        // { submenu: "家谱管理", submenuItem: [], icon: "" },
        // { submenu: "人脉图谱管理", submenuItem: [], icon: "" },
        // { submenu: "机构管理", submenuItem: [], icon: "" },
        // { submenu: "活动管理", submenuItem: [], icon: "" },
        // { submenu: "开发管理", submenuItem: [], icon: "" },
        // { submenu: "财务管理", submenuItem: [], icon: "" },
        // { submenu: "安全管理", submenuItem: [], icon: "" }
      ],
      background: {
        backgroundImage: "url(" + require("@/assets/index-bg.png")+")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 1080px",
        color: "#C8C9C9"
      }
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(this.activeIndex);
      console.log(key, keyPath);
      this.activeIndex = parseInt(key) + "";
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = parseInt(key) + "";
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      console.log(key, keyPath);
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
      this.$message.success("退出登录成功");
    }
  },
  created() {
    this.roleArray = JSON.parse(localStorage.getItem("role")).roleArray;
    console.log("权限列表", this.roleArray);
  }
};
</script>

<style>
@import "index.css";
.el-header {
  padding: 0px !important;
}
.el-menu {
  background: transparent;
  border: 0px;
}
.el-submenu__title,
.el-menu-item {
  color: #fff;
}

.logo {
  width: 100%;
  height: 137px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  color: #fff;
}
.main {
  background-color: #04153d;
  padding: 15px;
  box-sizing: border-box;
  overflow: auto;
}

/*滚动条样式*/
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块样式*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.5);
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道样式*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
