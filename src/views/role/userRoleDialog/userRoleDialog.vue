<template>
  <div class="dialog">
    <div class="dialog-title">添加管理人员</div>
    <div class="dialog-input">
      <span class="dialog-input-title">手机号 :</span>
      <el-input v-model="phone" :placeholder="'请输入手机号'" :style="{width:'65%',marginLeft:'8px'}">
        <i slot="suffix" class="el-icon-search search-icon" @click="searchMember()"></i>
      </el-input>
    </div>
    <div class="dialog-input" v-for="(item,index) in items" :key="index">
      <span class="dialog-input-title">{{item.name}} :</span>
      <el-input
        v-model="item.value"
        :placeholder="item.name"
        :style="{width:'65%',marginLeft:'8px'}"
        :disabled="true"
      ></el-input>
    </div>
    <div class="dialog-input">
      <span class="dialog-input-title">角色 :</span>
      <el-select
        v-model="selectRole"
        slot="prepend"
        placeholder="请选择角色"
        :style="{width:'65%',marginLeft:'8px'}"
      >
        <el-option
          v-for="(item,index) in roleList"
          :key="index"
          :label="item.name"
          :value="item._key"
        ></el-option>
      </el-select>
    </div>
    <div class="dialog-footer">
      <el-button type="info" plain @click="cancelDialog()">取消</el-button>
      <el-button type="primary" @click="saveRole()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import api from "../../../api/index";
export default {
  name: "UserRoleDialog",
  components: {},
  props: {
    userData: Object
  },
  data: () => {
    return {
      input: "",
      items: [
        { name: "Home+ ID", value: "" },
        { name: "姓名", value: "" },
        { name: "性别", value: "" },
        { name: "邮箱", value: "" }
      ],
      selectRole: "",
      phone: "",
      addRoleObj: {},
      roleList: []
    };
  },
  methods: {
    cancelDialog: function() {
      console.log(this.roleUserShowState);
      this.$store.dispatch("changeUserRoleShowState", !this.roleUserShowState);
    },
    saveRole: async function() {
      console.log("xxx", this.addRoleObj);
      if (JSON.stringify(this.userData) !== "{}") {
        let res = await api.Role.editUserRole({
          token: localStorage.getItem("token"),
          adminId: this.userData._key,
          roleId: this.selectRole
        });
        if (res && res.msg === "OK") {
          this.$message.success("修改成功");
          this.$store.dispatch(
            "changeUserRoleShowState",
            !this.roleUserShowState
          );
        } else {
          this.$message.error(res.msg);
        }
      } else {
        if (JSON.stringify(this.addRoleObj) === "{}") {
          this.$message.error("请选择要添加的用户");
          return;
        }
        if (this.selectRole) {
          this.addRoleObj.roleId = this.selectRole;
          this.addRoleObj.token = localStorage.getItem("token");
          let res = await api.Role.addUserRole(this.addRoleObj);
          if (res && res.msg === "OK") {
            this.$message.success("新增成功");
            this.$store.dispatch(
              "changeUserRoleShowState",
              !this.roleUserShowState
            );
          } else {
            this.$message.error(res.msg);
          }
        } else {
          this.$message.error("请选择角色");
        }
      }
    },
    searchMember: async function() {
      let res = await api.Role.searchRoleMember({
        token: localStorage.getItem("token"),
        phone: this.phone
      });
      if (res && res.msg === "OK") {
        this.items[0].value = res.result.homeId;
        this.items[1].value = res.result.name;
        this.items[2].value = res.result.gender ? "女" : "男";
        this.items[3].value = res.result.email ? res.result.email : "无";
        this.addRoleObj = Object.assign(res.result);
        console.log(this.items);
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted: async function() {
    //   let topicType = this.$route.params.topicType;
    //   console.log(topicType);
    console.log(this.userData);
    if (JSON.stringify(this.userData) !== "{}") {
      this.items[0].value = this.userData.homeId;
      this.items[1].value = this.userData.username;
      this.items[2].value = this.userData.gender ? "女" : "男";
      this.items[3].value = this.userData.email ? this.userData.email : "无";
      this.phone = this.userData.mobile;
      this.selectRole = this.userData.roleId;
    }
    let res = await api.Role.getRoleName({
      token: localStorage.getItem("token")
    });
    console.log(res);
    if (res && res.msg === "OK") {
      this.roleList = res.list;
    }
  },
  computed: {
    ...mapState({
      roleUserShowState: state => state.role.roleUserShowState,
      userRoleId: state => state.role.userRoleId
    })
  },
  watch: {}
};
</script>

<style scoped>
@import "userRoleDialog.css";
</style>
