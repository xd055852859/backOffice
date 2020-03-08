<template>
  <div class="dialog">
    <div class="dialog-title">添加角色</div>
    <div class="dialog-input">
      <div class="dialog-input-title">角色名 :</div>
      <el-input v-model="roleName" :placeholder="'请输入角色名'" :style="{width:'65%',marginLeft:'8px'}"></el-input>
    </div>
    <el-checkbox-group
      v-model="roleArray"
      class="dialog-input"
      v-for="(item,index) in items"
      :key="index"
    >
      <div class="dialog-input-title">{{item.title}}</div>
      <el-checkbox :label="item.name" :style="{width:item.type===1?'50%':'65%',marginLeft:'8px'}"></el-checkbox>
    </el-checkbox-group>
    <div class="dialog-footer">
      <el-button type="info" plain @click="cancelDialog()">取消</el-button>
      <el-button type="primary" @click="saveRole()">确定</el-button>
    </div>
  </div>
</template>

<script>
import api from "../../../api/index";
import { mapState, mapActions } from "vuex";
export default {
  name: "RoleDialog",
  props: {
    targetRoleArray: Array,
    targetName: String
  },
  components: {},
  data: () => {
    return {
      items: [
        { title: "配置权限 : ", name: "总览", type: 0 },
        { title: "", name: "权限管理", type: 0 },
        { title: "", name: "系统账号管理", type: 1 },
        { title: "", name: "权限角色管理", type: 1 },
        { title: "", name: "用户管理", type: 0 },
        { title: "", name: "文章管理", type: 0 },
        { title: "", name: "全部文章", type: 1 },
        // { title: "", name: "发布文章", type: 1 },
        { title: "", name: "专辑管理", type: 0 }
        
        // { title: "", name: "家庭树管理", type: 0 },
        // { title: "", name: "家庭树编辑", type: 1 },
        // { title: "", name: "家庭树", type: 1 },
        // { title: "", name: "公开树", type: 1 },
        // { title: "", name: "家庭树审核", type: 1 },
        // { title: "", name: "家谱管理", type: 0 },
        // { title: "", name: "人脉图谱管理", type: 0 },
        // { title: "", name: "机构管理", type: 0 },
        // { title: "", name: "活动管理", type: 0 },
        // { title: "", name: "财务管理", type: 0 },
        // { title: "", name: "开发管理", type: 0 },
        // { title: "", name: "安全管理", type: 0 }
      ],
      roleName: "",
      roleArray: []
    };
  },
  methods: {
    saveRole: async function() {
      let msg = "";
      let res = {};
      console.log(this.roleId);
      if (this.roleId) {
        res = await api.Role.changeRoleList({
          token: localStorage.getItem("token"),
          roleId: this.roleId,
          roleName: this.roleName,
          roleArray: this.roleArray
        });
        msg = "编辑权限成功";
      } else {
        res = await api.Role.addRoleList({
          token: localStorage.getItem("token"),
          roleName: this.roleName,
          roleArray: this.roleArray
        });
        msg = "保存权限成功";
      }

      if (res && res.msg === "OK") {
        this.$message.success(msg);
        this.$store.dispatch("changeRoleShowState", !this.roleShowState);
      } else {
        this.$message.error(res.msg);
      }
    },
    cancelDialog: function() {
      this.$store.dispatch("changeRoleShowState", !this.roleShowState);
    }
  },
  mounted: function() {
    //   let topicType = this.$route.params.topicType;
    //   console.log(topicType);
    console.log("id", this.roleId);
    if (this.roleId) {
      console.log(this.targetRoleArray);
      this.roleArray = this.targetRoleArray;
      this.roleName = this.targetName;
    }
  },
  computed: {
    ...mapState({
      roleShowState: state => state.role.roleShowState,
      roleId: state => state.role.roleId
    })
  },
  watch: {}
};
</script>

<style scoped>
@import "roleDialog.css";
</style>
