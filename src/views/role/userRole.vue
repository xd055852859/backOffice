<template>
  <div id="role" class="main-container">
    <header class="main-header">系统账号管理</header>
    <div class="main-tool">
      <el-input
        :placeholder="'请选择'+(selectKeyword==='name'?'姓名':selectKeyword==='homeId'?'Home ID':'手机号')"
        v-model="keyword"
        class="input-with-select role-input"
        clearable
      >
        <el-select
          v-model="selectKeyword"
          slot="prepend"
          placeholder="请选择"
          :style="{color:'#fff',background:'transparent'}"
        >
          <el-option label="姓名" value="name"></el-option>
          <el-option label="Home ID" value="homeId"></el-option>
          <el-option label="手机号" value="mobile"></el-option>
        </el-select>
        <i
          slot="suffix"
          class="el-icon-search search-icon"
          @click="()=>{this.page=1;this.getData()}"
        ></i>
      </el-input>
      <div>
        <el-button type="primary" @click="showDialog()">添加管理人员</el-button>
        <el-button type="info" @click="deleteAdmin()" plain>删除</el-button>
      </div>
    </div>
    <div class="table-data">
      <el-table
        ref="multipleTable"
        :data="roleUserData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="avatar" label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" class="table-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="homeId" label="homeId"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '正常' ? 'success' : 'danger'"
              close-transition
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editAdmin(scope.row)" type="text">编辑</el-button>
            <!-- <el-button type="text">操作日志</el-button> -->
            <el-button
              type="text"
              @click.native.stop.prevent="changeUserRoleStatus(scope.row._key,scope.row.roleId,scope.row.status)"
            >{{scope.row.status=== '正常'?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="日期" width="120"  sortable prop="date">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="table-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 30, 100]"
        :page-size="limit"
      ></el-pagination>
    </div>
    <UserRoleDialog v-if="roleUserShowState" @click="showDialog()" :userData="userData" />
  </div>
</template>

<script>
import UserRoleDialog from "./userRoleDialog/userRoleDialog";
import { mapState, mapActions } from "vuex";
import api from "../../api/index";
export default {
  name: "UserRole",
  components: {
    UserRoleDialog
  },
  data: () => {
    return {
      roleUserData: [],
      multipleSelection: [],
      searchInput: "",
      select: "",
      addState: false,
      page: 1,
      limit: 10,
      keyword: "",
      selectKeyword: "name",
      total: 0,
      userData: {},
      delArray: [],
      loading: true
    };
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.role === value;
    },
    handleSelectionChange(val) {
      this.delArray = [];
      this.multipleSelection = val;
      val.map((item, index) => {
        this.delArray.push(item._key);
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    deleteAdmin() {
      if (this.delArray.length > 0) {
        this.$confirm("请确认是否需要删除对应管理员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await api.Role.deleteAdmin({
              token: localStorage.getItem("token"),
              adminIdArr: this.delArray
            });
            if (res && res.msg === "OK") {
              this.$message.success("刪除管理员成功");
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      } else {
        this.$message.error("请选择要删除的角色");
      }
    },
    async changeUserRoleStatus(adminId, roleId, status) {
      this.$confirm("请确认是否需要修改状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await api.Role.editUserRole({
            token: localStorage.getItem("token"),
            adminId: adminId,
            roleId: roleId,
            status: status === "正常" ? 0 : 1
          });
          if (res && res.msg === "OK") {
            this.$message.success("修改状态成功");
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.info("取消修改状态");
        });
    },
    editAdmin(data) {
      this.userData = Object.assign(data);
      this.$store.dispatch("changeUserRoleShowState", !this.roleUserShowState);
    },
    showDialog() {
      this.$store.dispatch("changeUserRoleShowState", !this.roleUserShowState);
    },
    async getData() {
      this.loading = true;
      let obj = {
        token: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit
      };
      if (this.keyword) {
        obj.keyWord = this.keyword;
        obj.searchType = this.selectKeyword;
      }
      let res = await api.Role.getRoleUserList(obj);
      if (res && res.msg === "OK") {
        this.roleUserData = res.list;
        this.roleUserData.map((item, index) => {
          item.status = item.status ? "正常" : "禁用";
          item.avatar =
            item.avatar &&
            item.avatar !== "http://cdn-icare.qingtime.cn/undefined" &&
            item.avatar !== "//cdn-icare.qingtime.cn/undefined"
              ? item.avatar
              : require("@/assets/defaultAvatar.png");
        });
        this.total = res.total;
        this.loading = false;
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted: function() {
    this.getData();
  },
  computed: {
    ...mapState({
      roleUserShowState: state => state.role.roleUserShowState
    })
  },
  watch: {
    roleUserShowState(val, oldVal) {
      //普通的watch监听
      if (oldVal !== val && oldVal) {
        this.userData = {};
        this.getData();
      }
    }
  }
};
</script>

<style>
@import "userRole.css";
</style>
