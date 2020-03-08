<template>
  <div id="reviewArticle" class="main-container">
    <header class="main-header article-header">
      <div>审核文章</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">待审核</el-menu-item>
        <el-menu-item index="2">审核通过</el-menu-item>
        <el-menu-item index="3">审核未通过</el-menu-item>
      </el-menu>
    </header>
    <div class="main-tool">
      <div>
        <el-input v-model="input" placeholder="请输入关键字" style="width:200px;marginRight:10px"></el-input>
        <el-input v-model="input" placeholder="请输入用户名" style="width:200px;marginRight:5px"></el-input>
        <el-button type="primary" @click="showDialog()" style="width:120px;">搜索</el-button>
      </div>
      <div>
        <el-button type="info" plain>删除</el-button>
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
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="articleContainer" label="文章概要">
          <template slot-scope="scope">
            <img :src="scope.row.picture" class="table-avatar">
            <!-- <div>{{scope.row.articleContainer}}</div> -->
          </template>
        </el-table-column>
        <el-table-column prop="user" label="用户"></el-table-column>
        <el-table-column prop="readNum" label="阅读数"></el-table-column>
        <el-table-column prop="agreeNum" label="点赞数"></el-table-column>
        <el-table-column prop="commentNum" label="评论数"></el-table-column>
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '正常' ? 'success' : 'danger'"
              close-transition
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, userSetData)" type="text">审核通过</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, userSetData)"
              type="text"
            >审核不通过</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="日期" width="120"  sortable prop="date">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="table-footer">
      <el-pagination background layout="total, sizes, prev, pager, next" :total="100"></el-pagination>
    </div>
    <ReviewArticleDialog v-if="reviewShowState"/>
  </div>
</template>

<script>
import api from "../../api/index";
import { mapState, mapActions } from "vuex";
import ReviewArticleDialog from "./reviewArticleDialog/reviewArticleDialog";
export default {
  name: "ReviewArticle",
  components: {
    ReviewArticleDialog
  },
  data: () => {
    return {
      articleData: [],
      searchInput: ""
    };
  },
  methods: {
    handleSelectionChange() {},
    deleteRow() {},
    handleSelect() {},
    showDialog(id) {
      this.$store.dispatch("setReviewId", id);
      this.$store.dispatch("changeReviewShowState", !this.reviewShowState);
    }
  },
  mounted: async function() {
    let res = await api.Article.getArticleList({ token: "123" });
    if (res&&res.msg === "OK") {
      this.articleData = res.data;
      this.articleData.map((item, index) => {
        item.status = item.status ? "正常" : "禁用";
      });
    }
  },
  computed: {
    ...mapState({
      reviewId: state => state.article.reviewId,
      reviewShowState: state => state.article.reviewShowState
    })
  }
};
</script>

<style>
@import "article.css";
</style>
