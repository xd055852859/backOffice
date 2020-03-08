<template>
  <div class="mask">
    <div class="reviewArticleDialog dialog-container">
      <div class="dialog-title">{{reviewState ? "请选择通过的理由" : "请选择不通过的理由"}}</div>
      <el-select v-model="reason" placeholder="请选择" style="width:80%;margin:31px 0">
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <div>
        <el-button type="primary" @click="submitDialog()">确定</el-button>
        <el-button type="info" plain @click="cancelDialog()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/index";
import { mapState, mapActions } from "vuex";
export default {
  name: "ReviewArticleDialog",
  components: {},
  data: () => {
    return {
      reason: "",
      options: [],
      passOptions: ["深度好文", "内容精彩", "趣味性大", "可读性强"],
      unpassOptions: ["涉嫌黄色信息", "内容太少", "缺乏趣味性", "可读性不强"]
    };
  },
  methods: {
    async submitDialog() {
      if (this.reason === "") {
        this.$message.error(
          this.reviewState ? "请选择通过的理由" : "请选择不通过的理由"
        );
        return;
      }
      let res = await api.Article.changeReviewState({
        token: localStorage.getItem("token"),
        adminId: localStorage.getItem("userKey"),
        key: this.articleKey,
        type: 1,
        value: this.reviewState ? 1 : 0,
        reason: this.reason
      });
      if (res.msg === "OK") {
        this.$message.success("修改审核状态成功");
        this.$store.dispatch("changeReviewShowState", false);
      }
    },
    cancelDialog() {
      this.$store.dispatch("changeReviewShowState", false);
    }
  },
  mounted: async function() {
    this.options = this.reviewState
      ? Object.assign(this.passOptions)
      : Object.assign(this.unpassOptions);
  },
  computed: {
    ...mapState({
      articleKey: state => state.article.articleKey,
      reviewState: state => state.article.reviewState,
      reviewShowState: state => state.article.reviewShowState
    })
  }
};
</script>

<style>
@import "reviewArticleDialog.css";
</style>
