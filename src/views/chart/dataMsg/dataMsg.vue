<template>
  <div class="dialog" id="dataMsg-dialog">
    <div class="dialog-title">操作列表</div>
    <i class="el-icon-close delete-button" style="color:#000;top:29px" @click="cancelDialog()"></i>
    <div class="table-data dataMsg-table">
      <el-table
        ref="multipleTable"
        :data="dataMsg"
        tooltip-effect="dark"
        stripe
        width="100%"
        height="90%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column prop="userKey" label="用户key"></el-table-column>
        <el-table-column prop="apiName" label="接口名"></el-table-column>
        <el-table-column prop="method" label="操作方式"></el-table-column>
        <el-table-column prop="operation" label="操作参数" width="240px"></el-table-column>
        <el-table-column prop="memo" label="操作内容"></el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
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
  </div>
</template>

<script>
import api from "../../../api/index";
import moment from "moment";
import { mapState, mapActions } from "vuex";
export default {
  name: "DataMsg",
  components: {},
  data: () => {
    return {
      total: 0,
      page: 1,
      limit: 10,
      dataMsg: []
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
    cancelDialog() {
      this.$store.dispatch("changeDataShowState", false);
    },
    async getData() {
      let res = await api.UserManage.getuserOperations({
        token: localStorage.getItem("token"),
        userKey: this.targetUserKey,
        page: this.page,
        limit: this.limit
      });
      if (res && res.msg === "OK") {
        this.dataMsg = res.list;
        this.dataMsg.forEach((item, index) => {
          item.createTime = item.createTime
            ? moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
        });

        this.total = res.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
@import "dataMsg.css";
</style>
