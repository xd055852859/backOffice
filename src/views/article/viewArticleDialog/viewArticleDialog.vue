<template>
  <div class="dialog" id="article-dialog" v-if="JSON.stringify(viewArticleData)!=='{}'">
    <div class="viewArticle-cover">
      <img :src="viewArticleData.cover">
    </div>
    <i class="el-icon-close delete-button" @click="cancelDialog()"></i>
    <div class="viewArticle-userInfo">
      <div class="viewArticle-avatar">
        <img :src="viewArticleData.creator.avatar">
      </div>
      <div class="viewArticle-nickName">{{viewArticleData.creator.name}}</div>
      <div class="viewArticle-title">{{viewArticleData.title}}</div>
      <div class="viewArticle-info">
        <div>{{viewArticleData.address}}</div>
        <div>{{viewArticleData.createTime}}</div>
        <div>{{viewArticleData.clickNumber}}</div>
      </div>
      <div class="viewArticle-seriesType">{{viewArticleData.series.name}}</div>
    </div>
    <div v-if="viewArticleData.type===6" v-html="content" class="viewArticle-content"></div>
    <div v-if="viewArticleData.type===9" v-html="content" class="viewArticle-content"></div>
    <div class="like-title">被0人赞过</div>
    <div class="like-info" v-if="viewArticleData.likeList.length>0">
      <div
        class="like-avatar"
        v-for="(item,index) in viewArticleData.likeList"
        :key="'avatar'+index"
      >
        <img :src="item.etc.avatar">
      </div>
    </div>
    <div class="like-title">0条评论</div>
    <div class="like-info" v-if="viewArticleData.commentList.length>0">
      <div
        class="commentList-content"
        v-for="(item,index) in viewArticleData.commentList"
        :key="'comment'+index"
      >
        <div class="like-avatar">
          <img :src="item.etc.avatar">
        </div>
        <div style="height:100%">
          <div style="color:#66b1ff;marginBottom:10px">{{item.etc.name}}</div>
          <div>{{item.content}}</div>
          <div style="color:#ccc;marginTop:10px">{{item.createTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/index";
import moment from "moment";
import { mapState, mapActions } from "vuex";
export default {
  name: "ViewArticleDialog",
  components: {},
  props: {
    targetArticleKey: String
  },
  data: () => {
    return {
      viewArticleData: {},
      content: ""
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
      console.log("进入");
      this.$store.dispatch("changeViewShowState", false);
    }
  },
  async mounted() {
    let res = await api.Article.getArticleDetail({
      token: localStorage.getItem("token"),
      key: this.targetArticleKey
    });
    if (res.msg === "OK") {
      this.viewArticleData = res.result;
      console.log(11);
      this.viewArticleData.commentList.map((item, index) => {
        item.createTime = moment(item.createTime).format("YYYY-MM-DD");
      });
      console.log(22);
      this.viewArticleData.createTime = moment(
        this.viewArticleData.createTime
      ).format("YYYY-MM-DD");
      if (this.viewArticleData.type === 6) {
        this.viewArticleData.richContent.map((item, index) => {
          let str = "";
          if (item.metaType === "image") {
            let scale = 1;
            if (item.size.width > 680) {
              scale = 680 / item.size.width;
            }
            str =
              "<img src=" +
              item.url +
              " style='height:" +
              item.size.height * scale +
              "px;width:" +
              item.size.width * scale +
              "px'/>";
            item.memo ? (str += "<div>" + item.memo + "</div>") : null;
          } else if (item.metaType === "video") {
            str =
              "<video src=" +
              item.url +
              " controls='controls'>您的浏览器不支持 video 标签。</video>";
            item.memo ? (str += "<div>" + item.memo + "</div>") : null;
          } else if (item.metaType === "header") {
            str += "<div>" + item.memo + "</div>";
          }
          this.content += str;
        });
      } else {
        this.content = this.viewArticleData.content;
      }
    }
  }
};
</script>

<style>
@import "viewArticleDialog.css";
</style>
