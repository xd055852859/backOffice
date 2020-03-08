<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created: function() {
    //在页面加载时读取localStorage里的状态信息
    sessionStorage.getItem("userMsg") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(sessionStorage.getItem("userMsg"))
        )
      );

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("userMsg", JSON.stringify(this.$store.state));
    });
  }
};
</script>

<style>
@import "App.css";
.el-header {
  padding: 0px !important;
}
.el-menu {
  background: transparent !important;
  border: 0px;
  border-right: 0px !important;
}
.el-submenu__title,
.el-menu-item {
  color: #fff;
}
#aside .el-menu-item:focus,
#aside .el-menu-item:hover,
#aside .el-submenu__title:focus,
#aside .el-submenu__title:hover {
  background-color: rgba(8, 16, 63, 0.5) !important;
  color: #fff;
}
.logo {
  width: 100%;
  height: 137px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.main {
  background: #e7ebef;
  padding: 30px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
