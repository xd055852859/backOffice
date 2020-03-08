<template>
  <div id="album" class="main-container">
    <header class="main-header album-header">
      <div>专辑管理</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">平台专辑</el-menu-item>
        <el-menu-item index="2">用户专辑</el-menu-item>
      </el-menu>
    </header>
    <div class="main-tool">
      <div>
        <el-input v-model="seriesName" placeholder="请输入专辑名" style="width:200px;marginRight:10px"></el-input>
        <el-input v-model="userName" placeholder="请输入用户名" style="width:200px;marginRight:5px"></el-input>
        <el-button type="primary" @click="getData()" style="width:120px;">搜索</el-button>
      </div>
      <div>
        <el-button
          type="primary"
          @click="createAlbum()"
          style="width:120px;"
          v-if="activeIndex==='1'"
        >创建专辑</el-button>
        <el-button
          type="info"
          @click="deleteAlbum()"
          style="width:120px;"
          v-if="activeIndex==='1'"
        >删除专辑</el-button>
      </div>
    </div>
    <div class="table-data album-table">
      <el-menu
        :default-active="seriesType"
        class="el-menu-vertical-demo album-nav"
        mode="horizontal"
        @select="seriesTypeSelect"
      >
        <el-menu-item index="0">全部专辑({{albumTotal}})</el-menu-item>
        <el-menu-item
          :index="index+1+''"
          v-for="(item,index) in typeList"
          :key="'type'+index"
        >{{item.name}}({{item.num}})</el-menu-item>
        <div class="album-button">
          <el-button type="primary" @click="createManage()" style="width:120px;">分类管理</el-button>
        </div>
      </el-menu>
      <el-table
        ref="multipleTable"
        :data="albumData"
        tooltip-effect="dark"
        stripe
        style="width:68%"
        @selection-change="handleSelectionChange"
        @row-click="toTargetArticle"
        :default-sort="{prop: 'date', order: 'descending'}"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="name" label="专辑名"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="articleNumber" label="文章数"></el-table-column>
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
    <AlbumDialog v-if="albumShowState" />
    <AlbumManage v-if="albumManageState" />
  </div>
</template>

<script>
import api from "../../api/index";
import moment from "moment";
import { mapState, mapActions } from "vuex";
import AlbumDialog from "./albumDialog/albumDialog";
import AlbumManage from "./albumManage/albumManage";
export default {
  name: "Album",
  components: {
    AlbumDialog,
    AlbumManage
  },
  data: () => {
    return {
      albumData: [],
      multipleSelection: [],
      select: "",
      page: 1,
      limit: 10,
      keyword: "",
      delArray: [],
      total: 0,
      albumTotal: 0,
      activeIndex: "1",
      seriesType: "0",
      userName: "",
      seriesName: "",
      typeList: [],
      loading: true
    };
  },
  computed: {},
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.seriesType = "0";
      this.getData(true);
    },
    seriesTypeSelect(key, keyPath) {
      this.seriesType = key;
      console.log(this.seriesType);
      this.getData();
    },
    handleSelectionChange(val) {
      this.delArray = [];
      this.multipleSelection = val;
      val.map((item, index) => {
        this.delArray.push(item._key);
      });
      console.log(this.delArray);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    createAlbum() {
      this.$store.dispatch("changeAlbumShowState", true);
    },
    createManage() {
      this.$store.dispatch("changeAlbumManageState", true);
    },
    toTargetArticle() {
      this.$router.push({ name: "userManage" });
    },
    deleteAlbum() {
      if (this.delArray.length > 0) {
        this.$confirm("请确认是否需要删除对应专辑?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await api.Album.deleteAlbum({
              token: localStorage.getItem("token"),
              seriesIdArr: this.delArray
            });
            if (res && res.msg === "OK") {
              this.$message.success("刪除专辑成功");
              if (res.error) {
                this.$message.error(res.error + "请确认专辑是否已被使用");
              }
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
    getData: async function(state) {
      this.loading = true;
      let obj = {
        token: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        seriesName: this.seriesName,
        userName: this.userName
      };
      parseInt(this.seriesType) > 0
        ? (obj.type = parseInt(this.seriesType))
        : null;
      this.activeIndex === "1" ? (obj.special = 8) : null;
      let res = await api.Album.getAlbumList(obj);
      console.log(res);
      if (res && res.msg === "OK") {
        this.albumData = res.data;
        this.albumData.map((item, index) => {
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        this.total = res.total;
        if (!state) {
          this.loading = false;
        }
      } else {
        this.$message.error(res.msg);
      }
      if (state) {
        let typeRes = await api.Album.getAlbumTypeFilter(obj);
        console.log(typeRes);
        if (typeRes.msg === "OK") {
          this.typeList = typeRes.list;
          this.albumTotal = typeRes.total;
          this.loading = false;
        } else {
          this.$message.error(typeRes.msg);
        }
      }
    }
  },
  mounted: async function() {
    this.getData(true);
  },
  computed: {
    ...mapState({
      albumShowState: state => state.album.albumShowState,
      albumManageState: state => state.album.albumManageState
    })
  },
  watch: {
    albumShowState(val, oldVal) {
      //普通的watch监听
      if (oldVal !== val && oldVal) {
        this.getData();
      }
    },
    albumManageState(val, oldVal) {
      //普通的watch监听
      if (oldVal !== val && oldVal) {
        this.getData();
      }
    }
  }
};
</script>

<style>
@import "album.css";
</style>
