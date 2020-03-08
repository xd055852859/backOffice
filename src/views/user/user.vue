<template>
  <div id="user" class="main-container">
    <header class="main-header">用户账号管理</header>
    <div class="main-tool">
      <el-input
        :placeholder="'请选择'+(selectKeyword==='name'?'用户名':selectKeyword==='homeId'?'Home ID':'手机号')"
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
          <el-option label="用户名" value="name"></el-option>
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
        <!-- <el-button type="primary">添加管理人员</el-button> -->
        <el-button type="info" plain @click="deleteUser()">删除</el-button>
      </div>
    </div>
    <div class="table-data">
      <el-table
        ref="multipleTable"
        :data="userData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="toTargetUser"
        @sort-change="sortTable"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="avatar" label="头像" fixed="left">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" class="table-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="homeId" label="homeId"></el-table-column>
        <!-- <el-table-column prop="area" label="国家区号"></el-table-column> -->
        <el-table-column prop="mobile" label="手机号" width="120px"></el-table-column>
        <!-- <el-table-column prop="surname" label="姓"></el-table-column> -->
        <!-- <el-table-column prop="name" label="姓名"></el-table-column> -->
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <!-- <el-table-column prop="slogan" label="slogan" width="120px"></el-table-column> -->
        <el-table-column sortable="custom" prop="loginTime" label="最新刷新时间" width="240px"></el-table-column>
        <el-table-column prop="app" label="相关应用"></el-table-column>
        <el-table-column sortable="custom" prop="createTime" label="注册时间" width="240px"></el-table-column>
        <!-- <el-table-column prop="ip" label="IP"></el-table-column> -->
        <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
        <el-table-column prop="pujuan" label="谱券"></el-table-column>
        <!-- <el-table-column prop="wallet" label="钱包"></el-table-column> -->
        <!-- <el-table-column prop="level" label="用户等级"></el-table-column> -->
        <el-table-column sortable="custom" prop="online" label="在线状态" width="120px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.online === '在线' ? 'primary' : 'info'"
              close-transition
            >{{scope.row.online}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="status" label="账户状态" width="120px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '正常' ? 'success' : 'danger'"
              close-transition
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80px">
          <template slot-scope="scope">
            <!-- <el-button @click.native.prevent="deleteRow(scope.$index, userData)" type="text">编辑</el-button>
            <el-button type="text">操作日志</el-button>-->
            <el-button
              type="text"
              @click.native.stop.prevent="changeUserStatus(scope.row.userKey,scope.row.status,scope.$index)"
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
    <!-- <RoleDialog/> -->
  </div>
</template>

<script>
import api from "../../api/index";
import moment from "moment";
export default {
  name: "User",
  components: {
    // RoleDialog
  },
  data: () => {
    return {
      userData: [],
      multipleSelection: [],
      searchInput: "",
      select: "",
      page: 1,
      limit: 10,
      keyword: "",
      selectKeyword: "name",
      delArray: [],
      total: 0,
      sortName: "",
      sortType: "",
      loading: true
    };
  },
  computed: {},
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
        this.delArray.push(item.userKey);
      });
    },
    sortTable(sortObj) {
      console.log(sortObj);
      if (sortObj.order) {
        this.sortName = sortObj.prop;
        this.sortType = sortObj.order === "ascending" ? "asc" : "desc";
      } else {
        this.sortName = "";
        this.sortType = "";
      }
      this.getData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    toTargetUser(row) {
      this.$router.push({ name: "userManage" });
      this.$store.dispatch("setTargetUserKey", row.userKey);
    },
    deleteUser() {
      if (this.delArray.length > 0) {
        this.$confirm("请确认是否需要删除对应用户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await api.User.deleteUser({
              token: localStorage.getItem("token"),
              userKeyArr: this.delArray
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
    async changeUserStatus(userKey, status, index) {
      this.$confirm("请确认是否需要修改状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(status);
          let res = await api.User.changeUserList({
            token: localStorage.getItem("token"),
            userKeyArr: [userKey],
            status: status === "正常" ? 0 : 1
          });
          if (res && res.msg === "OK") {
            this.userData[index].status = status === "正常" ? "禁用" : "正常";
            this.$message.success("修改状态成功");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.info("取消修改状态");
        });
    },
    getData: async function() {
      this.loading = true;
      let obj = {
        token: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        sort: this.sortName,
        sortType: this.sortType
      };
      if (this.keyword) {
        obj.keyWord = this.keyword;
        obj.searchType = this.selectKeyword;
      }
      let res = await api.User.getUserList(obj);
      if (res && res.msg === "OK") {
        this.userData = res.list;
        this.userData.map((item, index) => {
          item.avatar =
            item.avatar &&
            item.avatar !== "http://cdn-icare.qingtime.cn/undefined" &&
            item.avatar !== "//cdn-icare.qingtime.cn/undefined"
              ? item.avatar
              : require("@/assets/defaultAvatar.png");
          item.online = item.online ? "在线" : "下线";
          item.loginTime = moment(item.loginTime).format("YYYY-MM-DD HH:mm:ss");
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.status = item.status ? "正常" : "禁用";
        });
        this.total = res.total;
        this.loading = false;
      } else {
        this.$message.error(res.msg);
      }
      console.log(this.userData);
    }
  },
  mounted: async function() {
    this.getData();
  }
};
</script>

<style>
@import "user.css";
</style>
