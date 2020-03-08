<template>
  <div class="mask">
    <div class="albumManage dialog-container">
      <div class="dialog-title">分类管理</div>
      <el-table
        ref="multipleTable"
        :data="albumTypeData"
        tooltip-effect="dark"
        stripe
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="seriesNum" label="已有专辑"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editType(scope.row._key,scope.row.name)"
              type="text"
            >编辑</el-button>
            <el-button @click.native.prevent="deleteType(scope.row._key)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-button">
        <el-button type="primary" @click="addType()">新增分类</el-button>
        <el-button type="info" plain @click="cancelDialog()">取消</el-button>
      </div>
    </div>
    <AlbumType v-if="albumTypeState" :typeId="typeId" :seriesName="seriesName"/>
  </div>
</template>

<script>
import api from "../../../api/index";
import { mapState, mapActions } from "vuex";
import moment from "moment";
import AlbumType from "../albumType/albumType";
export default {
  name: "albumManage",
  components: {
    AlbumType
  },
  data: () => {
    return {
      options: [],
      seriesName: "",
      albumTypeData: [],
      typeId: 0
    };
  },
  methods: {
    handleSelectionChange() {},
    async addType() {
      this.$store.dispatch("changeAlbumTypeState", true);
    },
    editType(typeId, name) {
      this.$store.dispatch("changeAlbumTypeState", true);
      this.typeId = typeId;
      this.seriesName = name;
    },
    async deleteType(typeId) {
      this.$confirm("请确认是否需要删除对应分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await api.Album.deleteAlbumType({
            token: localStorage.getItem("token"),
            typeIdArr: [typeId]
          });
          if (res.msg === "OK") {
            this.$message.success("专辑分类删除成功");
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    cancelDialog() {
      this.$store.dispatch("changeAlbumManageState", false);
    },
    async getData() {
      let res = await api.Album.getAlbumTypeList({
        token: localStorage.getItem("token")
      });
      if (res.msg === "OK") {
        this.albumTypeData = res.list;
        this.albumTypeData.map((item, index) => {
          item.createTime = moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted: function() {
    this.getData();
  },
  computed: {
    ...mapState({
      albumTypeState: state => state.album.albumTypeState
    })
  }
};
</script>

<style>
@import "albumManage.css";
</style>
