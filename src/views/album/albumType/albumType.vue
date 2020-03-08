<template>
  <div class="mask">
    <div class="albumTypeDialog dialog-container">
      <div class="dialog-title">创建专辑分类</div>
      <el-input v-model="typeName" placeholder="请输入专辑名" style="width:80%"></el-input>
      <div class="dialog-button">
        <el-button type="primary" @click="submitType()">确定</el-button>
        <el-button type="info" plain @click="cancelDialog()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/index";
import { mapState, mapActions } from "vuex";

export default {
  name: "AlbumType",
  components: {},
  props: {
    typeId: String,
    seriesName: String
  },
  data: () => {
    return {
      options: [],
      typeName:""
    };
  },
  methods: {
    async submitType() {
      let res = "";
      let msg = "";
      if (this.typeId) {
        res = await api.Album.updateAlbumType({
          token: localStorage.getItem("token"),
          typeId: this.typeId,
          name: this.typeName
        });
        msg = "专辑分类编辑成功";
      } else {
        res = await api.Album.setAlbumType({
          token: localStorage.getItem("token"),
          name: this.typeName
        });
        msg = "专辑分类保存成功";
      }
      if (res.msg === "OK") {
        this.$message.success(msg);
        this.$store.dispatch("changeAlbumTypeState", false);
      } else {
        this.$message.error(res.msg);
      }
    },
    cancelDialog() {
      this.$store.dispatch("changeAlbumTypeState", false);
      this.$store.dispatch("changeAlbumManageState", true);
      this.$store.dispatch("changeAlbumTypeId", 0);
    }
  },
  mounted: async function() {
    this.typeName = this.seriesName ? this.seriesName : "";
  },
  computed: {
    ...mapState({})
  }
};
</script>

<style>
@import "albumType.css";
</style>
