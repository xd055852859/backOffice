<template>
  <div id="userManage" class="main-container">
    <header class="main-header">用户主页</header>
    <div class="userManage-container">
      <div class="userManage-avatar">
        <img :src="profile.avatar?profile.avatar:null" />
      </div>
      <div class="userManage-info">
        <div class="userManage-nickName">
          <div>{{profile.nickName }}({{profile.trueName}}) {{!targetUserInfo.status?"(已冻结)":""}}</div>
          <div>{{"Home ID："+targetUserInfo.icareId}}</div>
        </div>
        <div class="userManage-info-button">
          <div
            class="userManage-button-item"
          >余额 ({{targetUserInfo.pujuan?targetUserInfo.pujuan:'0'}}.00)</div>
          <div class="userManage-button-unitem">实名认证</div>
          <div class="userManage-button-unitem" v-if="!profile.email">未绑定邮箱</div>
          <div class="userManage-button-unitem" v-if="profile.email">已绑定邮箱</div>
          <!-- <el-button type="primary" size="small">关联家谱</el-button> -->
        </div>
      </div>
      <div class="userManage-button">
        <el-button
          type="primary"
          size="small"
          @click="changeUserState(targetUserInfo._key,targetUserInfo.status)"
        >{{!targetUserInfo.status?"已冻结":"冻结"}}</el-button>
        <el-button type="primary" size="small" @click="toUserInfo()">查看用户详情</el-button>
      </div>
    </div>
    <div class="userManage-navContainer">
      <div
        class="userManage-nav"
        @click="changeHomePage(index)"
        :style="homeIndex===index?{backgroundColor: '#EAF6FE',border: '1px solid #0091FF',boxShadow:'0 0 4px 0 rgba(0,145,255,0.80)',backgroundImage: 'url('+ item.checkIcon+')',backgroundRepeat: 'no-repeat',backgroundPosition: '95% 95%',backgroundSize:'30%'}:{backgroundImage: 'url('+ item.uncheckIcon+')',backgroundRepeat: 'no-repeat',backgroundPosition: '95% 95%',backgroundSize:'30%'}"
        v-for="(item,index) in navArray"
        :key="index"
      >
        <div :style="{fontSize:'16px',color: homeIndex===index?'#0091FF':'#999999' }">{{item.name}}</div>
        <div style="fontSize:14px;color:#999999">{{item.num}}</div>
      </div>
    </div>
    <div class="table-data" v-if="navState">
      <el-table
        ref="multipleTable"
        :data="userManageData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          prop="avatar"
          label="头像"
          fixed="left"
          v-if="homeIndex===0||homeIndex===1||homeIndex===2"
        >
          <template slot-scope="scope">
            <img :src="scope.row.avatar" class="table-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="articleContainer" label="文章概要" width="434px" v-if="homeIndex===3">
          <template slot-scope="scope">
            <div class="text-container">
              <img
                :src="scope.row.picture?scope.row.picture:require('@/assets/article.svg')"
                class="text-picture"
              />
              <div class="text-info">
                <div>{{scope.row.title}}</div>
                <div v-html="scope.row.articleContainer"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleContainer" label="家庭树名" width="434px" v-if="homeIndex===4">
          <template slot-scope="scope">
            <div class="text-container">
              <!-- <div
                :style="{backgroundImage: 'url('+ scope.row.cover+')',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"
              ></div>-->
              <img
                :src="scope.row.cover?scope.row.cover:require('@/assets/jiatingshu.jpg')"
                class="text-picture"
              />
              <div class="text-info">
                <div>{{scope.row.name}}</div>
                <div style="fontSize:12px;color:#ccc">编号:{{scope.row._key}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleContainer" label="上传照片" width="434px" v-if="homeIndex===5">
          <template slot-scope="scope">
            <!-- <div
                :style="{backgroundImage: 'url('+ scope.row.cover+')',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"
            ></div>-->
            <img :src="scope.row.filePath" style="width:240px;height:160px" />
          </template>
        </el-table-column>
        <el-table-column
          :prop="tableName[index]"
          :label="tableLabel[index]"
          v-for="(item,index) in tableLabel"
          :key="'table'+index"
        ></el-table-column>
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
import { mapState, mapActions } from "vuex";
import api from "../../api/index";
import moment from "moment";
import tableData from "./userManage";
export default {
  name: "UserManage",
  components: {},
  data: () => {
    return {
      targetUserInfo: {},
      profile: {},
      navArray: [
        {
          name: "好友",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon0.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon0.svg")
        },
        {
          name: "关注",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon1.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon1.svg")
        },
        {
          name: "粉丝",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon2.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon2.svg")
        },
        {
          name: "文章",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon3.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon3.svg")
        },
        {
          name: "家庭树",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon4.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon4.svg")
        },
        {
          name: "面相宝典",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon5.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon5.svg")
        },
        {
          name: "交易记录",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon6.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon6.svg")
        },
        {
          name: "操作日志",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon7.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon7.svg")
        },
        {
          name: "专辑",
          num: 0,
          checkIcon: require("@/assets/usecheckIcon8.svg"),
          uncheckIcon: require("@/assets/unusecheckIcon8.svg")
        }
      ],
      homeArray: [],
      homeIndex: 0,
      homeData: [],
      page: 1,
      limit: 10,
      type: 0,
      startTime: 0,
      endTime: 0,
      userManageData: [],
      tableLabel: [],
      tableName: [],
      total: 0,
      navState: false
    };
  },
  methods: {
    toUserInfo() {
      this.$router.push({ name: "userInfo" });
    },
    changeHomePage(index) {
      this.homeIndex = index;
      this.page = 1;
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
    async changeUserState(userKey, status) {
      this.$confirm("请确认是否修改该用户的冻结状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await api.UserManage.editUser({
            token: localStorage.getItem("token"),
            userKeyArr: [userKey],
            status: status === 1 ? 0 : 1
          });
          if (res.msg === "OK") {
            this.$message.success("修改用户冻结状态成功");
            this.targetUserInfo.status = status === 1 ? 0 : 1;
          }
        })
        .catch(() => {
          this.$message.info("已取消冻结");
        });
    },
    async getData() {
      let res = "";
      let obj = {
        token: localStorage.getItem("token"),
        userKey: this.targetUserKey,
        startTime: parseInt(this.startTime),
        endTime: parseInt(this.endTime),
        page: this.page,
        limit: this.limit
      };
      switch (this.homeIndex) {
        case 0:
          res = await api.UserManage.getFriendList(obj);
          this.tableLabel = tableData.friendLabel;
          this.tableName = tableData.friendName;
          break;
        case 1:
          res = await api.UserManage.getIcareList(obj);
          this.tableLabel = tableData.friendLabel;
          this.tableName = tableData.friendName;
          break;
        case 2:
          res = await api.UserManage.getFansList(obj);
          this.tableLabel = tableData.fansLabel;
          this.tableName = tableData.fansName;
          break;
        case 3:
          obj.type = "user";
          res = await api.Article.getArticleList(obj);
          this.tableLabel = tableData.articleLabel;
          this.tableName = tableData.articleName;
          break;
        case 4:
          res = await api.UserManage.getUserTree(obj);
          this.tableLabel = tableData.treeLabel;
          this.tableName = tableData.treeName;
          break;
        case 5:
          res = await api.UserManage.getFaceReport(obj);
          this.tableLabel = tableData.faceLabel;
          this.tableName = tableData.faceName;
          break;
        case 6:
          this.type ? (obj.type = this.type) : null;
          res = await api.UserManage.getUserPayment(obj);
          this.tableLabel = tableData.payLabel;
          this.tableName = tableData.payName;
          break;
        case 7:
          res = await api.UserManage.getuserOperations(obj);
          this.tableLabel = tableData.operationsLabel;
          this.tableName = tableData.operationsName;
          break;
        case 8:
          res = await api.Album.getAlbumList(obj);
          this.tableLabel = tableData.albumLabel;
          this.tableName = tableData.albumName;
          break;
      }
      if (res.msg === "OK") {
        this.total = res.total;

        this.userManageData = res.result
          ? res.result
          : res.data
          ? res.data
          : res.list;
        console.log("???", this.userManageData);
        this.userManageData.map((item, index) => {
          item.publish = item.publish
            ? "公开，所有用户可见"
            : "亲友圈，仅好友可见";
          item.isOpen = item.isOpen ? "已公开" : "未公开";
          item.status = item.status ? "正常" : "禁用";
          item.selfRecommend = item.selfRecommend
            ? "平台推荐精选"
            : "用户自荐精选";
          item.result
            ? (item.result =
                "【面相解说】" +
                item.result.split("【脸型解说】")[1].split("angle_yaw: ")[0])
            : null;
          item.pujuan ? (item.pujuan = item.pujuan + ".00") : null;
          item.createTime = item.createTime
            ? moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
        });
      }
    }
  },
  mounted: async function() {
    console.log(this.targetUserKey);
    let res = await api.User.getUserInfo({
      token: localStorage.getItem("token"),
      userKey: this.targetUserKey
    });
    if (res.msg === "OK") {
      this.targetUserInfo = res.userInfo;
      this.profile = this.targetUserInfo.profile;
      this.$store.dispatch("setTargetUserInfo", this.targetUserInfo);
      this.profile.avatar =
        this.profile.avatar &&
        this.profile.avatar !== "http://cdn-icare.qingtime.cn/undefined" &&
        this.profile.avatar !== "//cdn-icare.qingtime.cn/undefined"
          ? this.profile.avatar
          : require("@/assets/defaultAvatar.png");
    }
    let typeRes = await api.User.getUserHomeType({
      token: localStorage.getItem("token"),
      userKey: this.targetUserKey
    });
    if (typeRes.msg === "OK") {
      this.navState = true;
      typeRes.result.forEach((item, index) => {
        this.navArray[index].num = item.num;
      });
    }
    this.getData();
  },
  computed: {
    ...mapState({
      targetUserKey: state => state.user.targetUserKey
    })
  }
};
</script>

<style>
@import "userManage.css";
</style>
