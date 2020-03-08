<template>
  <div id="familyTree" class="main-container">
    <header class="main-header familyTree-header">
      <div>家庭树管理</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">待审核公开</el-menu-item>
        <el-menu-item index="1">公开家庭树</el-menu-item>
        <el-menu-item index="2">非公开家庭树</el-menu-item>
        <el-menu-item index="3">待审核绑定家谱</el-menu-item>
      </el-menu>
    </header>
    <div class="main-tool">
      <div>
        <el-input v-model="keyword" placeholder="请输入关键字" style="width:200px;marginRight:10px"></el-input>
        <el-input v-model="username" placeholder="请输入用户名" style="width:200px;marginRight:5px"></el-input>
        <el-button type="primary" @click="getData()" style="width:120px;">搜索</el-button>
      </div>
      <div>
        <el-button type="info" plain @click="deleteArticle()">删除</el-button>
      </div>
    </div>
    <div class="table-data">
      <el-table
        ref="multipleTable"
        :data="articleData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="toTargetArticle"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="articleContainer" label="文章概要" width="434px">
          <template slot-scope="scope">
            <div class="text-container">
              <div
                :style="{backgroundImage: 'url('+ scope.row.picture+')',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"
              ></div>
              <img :src="scope.row.picture" class="text-picture">
              <div class="text-info">
                <div>{{scope.row.title}}</div>
                <div v-html="scope.row.articleContainer"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户"></el-table-column>
        <el-table-column prop="clickNumber" label="阅读数"></el-table-column>
        <el-table-column prop="likeNumber" label="点赞数"></el-table-column>
        <el-table-column prop="dislikeNumber" label="点踩数"></el-table-column>
        <el-table-column prop="commentNumber" label="评论数"></el-table-column>
        <el-table-column v-if="type==='selectReview'" prop="createTime" label="申请时间" width="120px"></el-table-column>
        <el-table-column
          v-if="type==='selected'||type==='platform'"
          prop="createTime"
          label="设为精选时间"
          width="120px"
        ></el-table-column>
        <el-table-column
          v-if="type==='platform'||type==='user'"
          prop="createTime"
          label="发布时间"
          width="120px"
        ></el-table-column>
        <el-table-column v-if="type==='user'" prop="isPublic" label="谁可见" width="120px"></el-table-column>
        <el-table-column prop="selfRecommend" label="状态" width="120px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.selfRecommend === '平台推荐精选' ? 'success' : 'warning'"
              close-transition
            >{{scope.row.selfRecommend}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="changeReviewState(true,scope.row._key,2)"
              type="text"
              v-if="type!=='selectReview'&&!scope.row.block"
            >设为屏蔽</el-button>
            <el-button
              @click.native.prevent="changeReviewState(false,scope.row._key,2)"
              type="text"
              v-if="type!=='selectReview'&&scope.row.block"
            >取消屏蔽</el-button>
            <el-button
              @click.native.prevent="changeReviewState(true,scope.row._key,3)"
              type="text"
              v-if="type==='selected'&&!scope.row.top"
            >设为置顶</el-button>
            <el-button
              @click.native.prevent="changeReviewState(false,scope.row._key,3)"
              type="text"
              v-if="type==='selected'&&scope.row.top"
            >取消置顶</el-button>
            <el-button
              @click.native.prevent="changeReviewState(true,scope.row._key)"
              type="text"
              v-if="type==='selectReview'"
            >审核通过</el-button>
            <el-button
              @click.native.prevent="changeReviewState(false,scope.row._key)"
              type="text"
              v-if="type==='selectReview'"
            >审核不通过</el-button>
            <el-button
              @click.native.prevent="changeSelect(false,scope.row._key,1)"
              type="text"
              v-if="type!=='selectReview'&&scope.row.selected"
            >取消精选</el-button>
            <el-button
              @click.native.prevent="changeSelect(true,scope.row._key,1)"
              type="text"
              v-if="type!=='selectReview'&&!scope.row.selected"
            >设为精选</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
import moment from "moment";
import { mapState, mapActions } from "vuex";
export default {
  name: "FamilyTree",
  components: {},
  data: () => {
    return {
      articleData: [],
      searchInput: "",
      type: "selectReview",
      page: 1,
      limit: 10,
      total: 0,
      keyword: "",
      username: "",
      activeIndex: "0",
      delArray: [],
      targetArticleKey: 0
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.delArray = [];
      this.multipleSelection = val;
      val.map((item, index) => {
        this.delArray.push(item._key);
      });
    },
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.type = "selected";
          break;
        case "2":
          this.type = "platform";
          break;
        case "3":
          this.type = "user";
          break;
        default:
          this.type = "selectReview";
      }
      this.activeIndex = key;
      this.page = 1;
      this.getData();
      console.log(this.type);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    toTargetArticle(row) {
      this.targetArticleKey = row._key;
      console.log(this.viewShowState);
      this.$store.dispatch("changeViewShowState", true);
    },
    /**
     * reviewState 审核状态
     * articleKey 文章key
     */
    changeReviewState(reviewState, articleKey) {
      this.$store.dispatch("setArticleKey", articleKey);
      this.$store.dispatch("changeReviewShowState", true);
      this.$store.dispatch("changeReviewState", reviewState);
    },
    changeSelect(selectState, articleKey, type) {
      let msg = "";
      let title = "";
      let resMsg = "";
      switch (type) {
        case 1:
          if (selectState) {
            msg = "是否设为精选";
            title = "设为精选";
            resMsg = "设为精选成功";
          } else {
            msg = "是否取消精选";
            title = "取消精选";
            resMsg = "取消精选成功";
          }
          break;
        case 2:
          if (selectState) {
            msg = "是否设为屏蔽";
            title = "设为屏蔽";
            resMsg = "设为屏蔽成功";
          } else {
            msg = "是否取消屏蔽";
            title = "取消屏蔽";
            resMsg = "取消屏蔽成功";
          }
          break;
        case 3:
          if (selectState) {
            msg = "是否设为置顶";
            title = "设为置顶";
            resMsg = "设为置顶成功";
          } else {
            msg = "是否取消置顶";
            title = "取消置顶";
            resMsg = "取消置顶成功";
          }
          break;
      }
      this.$confirm(msg, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async () => {
        let res = await api.Article.changeReviewState({
          token: localStorage.getItem("token"),
          adminId: localStorage.getItem("userKey"),
          key: articleKey,
          type: type,
          value: selectState ? 1 : 0
        });
        if (res.msg === "OK") {
          this.$message.success(resMsg);
          this.getData();
        }
      });
    },
    deleteArticle() {
      if (this.delArray.length > 0) {
        this.$confirm("请确认是否需要删除对应文章?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await api.Article.deleteArticle({
              token: localStorage.getItem("token"),
              albumIdArr: this.delArray
            });
            if (res && res.msg === "OK") {
              this.$message.success("刪除文章成功");
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
    async getData() {
      let res = await api.Article.getArticleList({
        token: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        keyWord: this.keyword,
        userName: this.username,
        type: this.type
      });
      console.log(res);
      if (res && res.msg === "OK") {
        this.total = res.total;
        this.articleData = res.data;
        this.articleData.map((item, index) => {
          item.public = item.public
            ? "公开，所有用户可见"
            : "亲友圈，仅好友可见";
          item.status = item.status ? "正常" : "禁用";
          item.selfRecommend = item.selfRecommend
            ? "平台推荐精选"
            : "用户自荐精选";
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          if (item.richContent) {
            try {
              item.richContent.forEach(function(value, key) {
                if (value.thumbnailUrl) {
                  throw value.thumbnailUrl;
                }
              });
            } catch (e) {
              item.picture = e;
            }
            try {
              item.richContent.forEach(function(value, key) {
                if (value.memo) {
                  throw value.memo.length > 50
                    ? value.memo.substring(0, 50) + "..."
                    : value.memo;
                }
              });
            } catch (e) {
              item.articleContainer = e;
            }
          } else {
            let str = item.content.replace(/<[^<>]+>/g, "");
            console.log(str);
            item.articleContainer =
              str.length > 50 ? str.substring(0, 50) + "..." : str;
          }
        });
      }
    }
  },
  mounted: async function() {
    this.getData();
  },
  computed: {
    ...mapState({
      articleKey: state => state.article.articleKey,
      reviewState: state => state.article.reviewState,
      reviewShowState: state => state.article.reviewShowState,
      viewShowState: state => state.article.viewShowState
    })
  }
};
</script>

<style>
@import "familyTree.css";
</style>
