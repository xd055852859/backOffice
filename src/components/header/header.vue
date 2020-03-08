<template>
  <div id="header">
    <div class="header-title">你好！欢迎来到时光科技综合管理平台</div>
    <div class="header-container">
      <!-- <div class="header-search">
        <el-input
          placeholder="请输入关键词"
          v-model="searchInput"
          class="input-with-select"
          suffix-icon="el-icon-search"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择"
            :style="{color:'#fff',background:'transparent'}"
          >
            <el-option label="全部" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
        </el-input>
      </div> -->

      <!-- <el-badge class="item" :value="12" :style="{marginRight:'24px'}">
        <i class="el-icon-location"></i>
      </el-badge>
      <el-badge class="item" :value="12" :style="{marginRight:'24px'}">
        <i class="el-icon-location"></i>
      </el-badge>
      <el-badge class="item" :value="12" :style="{marginRight:'24px'}">
        <i class="el-icon-location"></i>
      </el-badge>-->

      <div class="header-userInfo">
        <img :src="profile&&profile.avatar?profile.avatar:''" class="header-userInfo-avatar">
        <div class="header-userInfo-container">
          <div
            class="header-userInfo-nickName"
          >{{profile?profile.trueName?profile.trueName:profile.nickName:""}}</div>
          <div class="header-userInfo-role">{{role?role.roleName:''}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  components: {},
  data: () => {
    return {
      searchInput: "",
      select: "",
      profile: JSON.parse(localStorage.getItem("profile")),
      role: JSON.parse(localStorage.getItem("role"))
    };
  },
  methods: {},
  mounted: function() {},
  watch: {}
};
</script>

<style scoped>
@import "header.css";
</style>
