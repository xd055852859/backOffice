<template>
  <div class="mask">
    <div class="albumDialog dialog-container">
      <div class="dialog-title">创建专辑</div>
      <el-input v-model="seriesName" placeholder="请输入专辑名" style="width:80%"></el-input>
      <el-select v-model="seriesType" placeholder="请选择专辑类型" style="width:80%;margin:31px 0">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
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
  name: "AlbumDialog",
  components: {},
  data: () => {
    return {
      options: [],
      seriesName: "",
      seriesType: ""
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
      let res = await api.Album.setAlbum({
        token: "JWK9QNVDPUBOVVCIXYRYQBHUYXKARB865C8GVR4AX26V3GPB",
        name: this.seriesName,
        type: parseInt(this.seriesType),
        groupArray: []
      });
      if (res.msg === "OK") {
        this.$message.success("创建成功");
        this.$store.dispatch("changeAlbumShowState", false);
      } else {
        this.$message.error(res.msg);
      }
    },
    cancelDialog() {
      this.$store.dispatch("changeAlbumShowState", false);
    }
  },
  mounted: async function() {
    let that = this;
    let res = await api.Album.getAlbumTypeList({
      token: localStorage.getItem("token")
    });
    if (res.msg === "OK") {
      res.list.map((item, index) => {
        console.log(item.name);
        that.options.push({ label: item.name, value: item.id });
      });
    } else {
      that.$message.error(res.msg);
    }
  },
  computed: {
    ...mapState({})
  }
};
</script>

<style>
@import "albumDialog.css";
</style>
