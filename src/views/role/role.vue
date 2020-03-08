<template>
  <div id="role" class="main-container">
    <header class="main-header">角色权限管理</header>
    <div class="main-tool">
      <!-- +(selectKeyword==='0'?'用户名':selectKeyword==='1'?'Home ID':'手机号')" -->
      <el-input
        placeholder="请选择用户名"
        v-model="keyword"
        class="input-with-select role-input"
        clearable
      >
        <!-- <el-select
          v-model="selectKeyword"
          slot="prepend"
          placeholder="请选择"
          :style="{color:'#fff',background:'transparent'}"
        >
          <el-option label="用户名" value="0"></el-option>
          <el-option label="Home ID" value="1"></el-option>
          <el-option label="手机号" value="2"></el-option>
        </el-select>-->
        <i
          slot="suffix"
          class="el-icon-search search-icon"
          @click="()=>{this.page=1;this.getData(this.page,this.limit,this.keyword)}"
        ></i>
      </el-input>
      <div>
        <el-button type="primary" @click="showDialog()">添加角色</el-button>
        <el-button type="info" plain @click="deleteRole()">删除</el-button>
      </div>
    </div>
    <div class="table-data">
      <el-table
        ref="multipleTable"
        :data="roleData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="role" label="配置权限"></el-table-column>
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
            <el-button
              @click.native.prevent="showDialog(scope.row._key,scope.row.role,scope.row.roleName)"
              type="text"
            >编辑</el-button>
            <el-button
              @click.native.prevent="changeUserRoleStatus(scope.row._key,scope.row.status,scope.$index)"
              type="text"
            >禁用</el-button>
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
    <RoleDialog
      v-if="roleShowState"
      :targetName="targetName"
      :targetRoleArray="targetRoleArray"
      @click="showDialog()"
    />
  </div>
</template>

<script>
import RoleDialog from "./roleDialog/roleDialog";
import { mapState, mapActions } from "vuex";
import api from "../../api/index";
export default {
  name: "Role",
  components: {
    RoleDialog
  },
  data: () => {
    return {
      roleData: [],
      multipleSelection: [],
      searchInput: "",
      select: "",
      addState: false,
      page: 1,
      limit: 10,
      keyword: "",
      selectKeyword: "0",
      targetRoleArray: [],
      targetName: "",
      delArray: [],
      total: 0,
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
    showDialog(id, arr, str) {
      console.log(this.roleShowState);
      if (id) {
        this.targetRoleArray = arr.split("、");
        this.targetName = str;
        this.$store.dispatch("setRoleId", id);
      } else {
        this.$store.dispatch("setRoleId", 0);
      }
      this.$store.dispatch("changeRoleShowState", !this.roleShowState);
    },
    async getData() {
      this.loading = true;
      let res = await api.Role.getRoleList({
        token: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        keyWord: this.keyword
      });
      if (res && res.msg === "OK") {
        this.roleData = res.list;
        this.roleData.map((item, index) => {
          item.role = item.roleArray.join("、");
          item.status = item.status ? "正常" : "禁用";
        });
        this.total = res.total;
        this.loading = false;
      }
    },
    deleteRole() {
      if (this.delArray.length > 0) {
        this.$confirm("请确认是否需要删除对应权限?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await api.Role.deleteRole({
              token: localStorage.getItem("token"),
              roleIdArr: this.delArray
            });
            if (res && res.msg === "OK") {
              this.$message.success("刪除角色成功");
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
    async changeUserRoleStatus(roleId, status, index) {
      this.$confirm("请确认是否需要修改状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(status);
          let res = await api.Role.changeRoleList({
            token: localStorage.getItem("token"),
            roleId: roleId,
            status: status === "正常" ? 0 : 1
          });
          console.log("???", res);
          if (res && res.msg === "OK") {
            this.roleData[index].status = status === "正常" ? "禁用" : "正常";
            this.$message.success("修改状态成功");
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.info("取消修改状态");
        });
    }
  },
  mounted: async function() {
    this.getData();
  },
  computed: {
    ...mapState({
      roleShowState: state => state.role.roleShowState
    })
  },
  watch: {
    roleShowState(val, oldVal) {
      //普通的watch监听
      if (oldVal !== val && oldVal) {
        this.getData();
      }
    }
  }
};
</script>

<style>
@import "role.css";
</style>
