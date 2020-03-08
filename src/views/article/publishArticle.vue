<template>
  <div id="publishArticle" class="main-container">
    <header class="main-header article-header">
      <div>发布</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">发布文章</el-menu-item>
        <el-menu-item index="2">发布图文</el-menu-item>
      </el-menu>
    </header>
    <!-- 工具栏容器 -->
    <!-- 编辑器容器 -->
    <div class="editor-container" v-if="activeIndex==='1'">
      <el-input v-model="title" placeholder="文章标题(0-50个字)" style="width:100%"></el-input>
      <ckeditor
        id="ckeditor"
        :editor="editor"
        v-model="articleData"
        :config="editorConfig"
        @ready="editorReady"
      ></ckeditor>
    </div>
    <div class="imageText-container" v-else>
      <el-input v-model="title" placeholder="文章标题(0-50个字)" style="width:100%"></el-input>
      <div class="imageEmptyText-info" v-if="richContent.length === 0">
        <i class="el-icon-edit-outline" style="fontSize:100px;marginBottom:30px"></i>
        <div style="display:flex;justify-content: center;width:100%;">
          <el-button type="primary" size="mini" @click="addItem(0)">添加标题</el-button>
          <el-button type="primary" size="mini" @click="addItem(1)">添加文本</el-button>
          <el-button type="primary" size="mini" class="article-upload">
            添加图片
            <input type="file" accept="image/*" @change="(e)=>{uploadImg(e,2)}">
          </el-button>
          <el-button type="primary" size="mini" class="article-upload">
            添加视频
            <input type="file" accept="video/*" @change="(e)=>{uploadImg(e,3)}">
          </el-button>
        </div>
      </div>
      <draggable v-model="richContent" class="imageText-info" v-if="richContent.length > 0">
        <transition-group>
          <div class="imageTextItem" v-for="(item,index) in richContent" :key="'richContent'+index">
            <img v-if="item.metaType==='image'" :src="item.url" class="imageTextItem-avatar">
            <video
              v-if="item.metaType==='video'"
              :src="item.url"
              class="imageTextItem-avatar"
              controls="controls"
            >您的浏览器不支持 video 标签。</video>
            <div v-if="item.metaType==='header'" class="imageTextItem-header">
              <img :src="require('@/assets/header.svg')">
            </div>
            <div v-if="item.metaType==='html'" class="imageTextItem-header">
              <img :src="require('@/assets/html.svg')">
            </div>
            <el-input
              type="textarea"
              class="imageTextItem-textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="item.memo"
            ></el-input>
            <i class="el-icon-delete" style="marginRight:15px;fontSize:25px"></i>
            <!-- <i class="el-icon-sort"></i> -->
          </div>
        </transition-group>
      </draggable>

      <div style="marginTop:15px;height:30px" v-if="richContent.length > 0">
        <el-button type="primary" size="mini" @click="addItem(0)">添加标题</el-button>
        <el-button type="primary" size="mini" @click="addItem(1)">添加文本</el-button>
        <el-button type="primary" size="mini" class="article-upload">
          添加图片
          <input type="file" accept="image/*" @change="(e)=>{uploadImg(e,2)}">
        </el-button>
        <el-button type="primary" size="mini" class="article-upload">
          添加视频
          <input type="file" accept="video/*" @change="(e)=>{uploadImg(e,3)}">
        </el-button>
      </div>
    </div>
    <!-- <div class="album-container">
       <div> 这一刻的想法……</div>
       <div class="album-upload">
           <i class="el-icon-plus"></i>      
       </div>
    </div>-->
    <div class="publishArticle-tools">
      <div>
        <div class="tool-title">发布到:</div>
        <el-select v-model="app" placeholder="无">
          <el-option
            v-for="item in appOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <div class="tool-title">是否精选:</div>
        <el-radio-group v-model="selected">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div>
        <div class="tool-title">背景音乐:</div>
        <el-select v-model="music" placeholder="请选择背景音乐">
          <el-option
            v-for="(item,index) in musicOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <div class="tool-title">专辑:</div>
        <el-select v-model="series" placeholder="请选择专辑">
          <el-option
            v-for="item in seriesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <div class="tool-title">位置:</div>
        <el-input v-model="address" placeholder="请选择当前位置"></el-input>
      </div>
      <div>
        <div class="tool-title">记录时间:</div>
        <el-select v-model="timeValue" placeholder="请选择时间" @change="changeTimeState()">
          <el-option :label="'当前时间 '+ timeNow" value="0"></el-option>
          <el-option label="选择其他时间" value="1"></el-option>
        </el-select>
      </div>
      <div v-if="chooseTimeState">
        <div class="tool-title"></div>
        <el-date-picker v-model="time" type="date" placeholder="请选择日期" @change="getArticleTime()"></el-date-picker>
      </div>
      <div>
        <el-button type="primary" @click="submitArticle()">确认发布</el-button>
        <el-button type="primary" plain>客户端预览</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
import { mapState, mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";
import BMap from "BMap";
import moment from "moment";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MyUploadAdapter from "../../common/myUploadAdapter";
import uploadFile from "../../common/upload";
import map from "../../common/map";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
export default {
  name: "PublishArticle",
  components: {
    draggable
  },
  data: () => {
    return {
      chooseTimeState: false,
      title: "",
      timeNow: moment(new Date().getTime()).format("YYYY-MM-DD"),
      timeValue: "",
      activeIndex: "1",
      app: "0",
      appOption: [
        {
          value: "0",
          label: "Home+"
        },
        {
          value: "1",
          label: "时光宝库"
        }
      ],
      music: "",
      musicOptions: [],
      selected: "1",
      series: "",
      seriesOptions: [],
      address: "",
      locationOptions: [],
      time: "",
      timeOptions: [],
      editor: ClassicEditor,
      editorConfig: {
        language: "zh-cn"
      },
      domain: "http://cdn-icare.qingtime.cn/",
      uptoken: "",
      articleData: "",
      textarea: "",
      richContent: [],
      articleObj: {},
      pictureCount: 0
    };
  },
  methods: {
    handleSelectionChange() {},
    changeTimeState() {
      if (this.timeValue === "0") {
        this.time = new Date();
      } else {
        this.chooseTimeState = true;
      }
    },
    getArticleTime() {
      this.timeValue = moment(this.time.getTime()).format("YYYY-MM-DD");
      this.chooseTimeState = false;
    },
    addItem(index) {
      // this["textarea" + this.richContent.length] = "";
      let item = {
        memo: this["textarea" + this.richContent.length]
      };
      switch (index) {
        case 0:
          item.metaType = "header";
          break;
        case 1:
          item.metaType = "html";
          break;
        default:
          null;
      }
      this.richContent.push(item);
    },
    uploadImg(e, type) {
      let mimeType =
        type === 3 ? ["video/mp4", "video/ogg"] : ["image/png", "image/jpeg"];
      let item = {};
      let that = this;
      let file = e.target.files[0];
      if (type === 2) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(theFile) {
          let image = new Image();
          image.src = theFile.target.result;
          image.onload = function() {
            uploadFile.uploadImg(file, that.uptoken, mimeType, function(url) {
              that.pictureCount = that.pictureCount++;
              if (that.pictureCount === 1) {
                that.cover = url;
              }
              that.richContent.push({
                metaType: "image",
                thumbnailUrl: url + "?imageView2/2/w/600/h/600",
                url: url,
                memo: that["textarea" + that.richContent.length],
                size: {
                  height: image.height,
                  width: image.width
                }
              });
            });
          };
        };
      } else {
        uploadFile.uploadImg(file, this.uptoken, mimeType, function(url) {
          // that["textarea" + that.richContent.length] = "";
          that.richContent.push({
            cropUrl: "",
            mediaType: url.split(".")[1],
            metaType: "video",
            thumbnailUrl: url + "?imageView2/2/w/600/h/600",
            url: url,
            memo: that["textarea" + that.richContent.length]
          });
        });
      }
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    editorReady(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new MyUploadAdapter(loader, this.domain, this.uptoken);
      };
    },
    async submitArticle() {
      console.log(this.richContent);
      let res = {};
      this.articleObj = {
        token: "JWK9QNVDPUBOVVCIXYRYQBHUYXKARB865C8GVR4AX26V3GPB",
        sourceUserKey: "612307712",
        publish: "1",
        music: this.music,
        series: "612612998",
        selected: parseInt(this.selected),
        //this.series,
        address: this.address,
        time: this.time.getTime(),
        backGroundMusic: this.music,
        title: this.title
      };
      if (this.activeIndex === "2") {
        this.articleObj.type = 6;
        this.articleObj.cover = this.cover;
        this.articleObj.richContent = this.richContent;
        this.articleObj.pictureCount = this.pictureCount;
        this.articleObj.credit = 1;
        this.articleObj.isSimple = 1;
        this.articleObj.isShowInMe = 1;
        this.articleObj.shareOrCoopArray = [];
        console.log(this.articleObj);
        res = await api.Article.saveStory(this.articleObj);
      } else {
        this.articleObj.type = 9;
        this.articleObj.title = this.title;
        this.articleObj.content = this.articleData;
        res = await api.Article.saveArticle(this.articleObj);
      }
      if (res.msg === "OK") {
        this.$message.success("发布成功");
        this.$router.push({ name: "article" });
      }
    }
  },
  mounted: async function() {
    let that = this;
    console.log(map);
    map.getLocation(
      data => {
        that.address = data.formattedAddress;
        console.log("地址", that.address);
      },
      err => {
        console.log(err);
      }
    );

    if (localStorage.getItem("token")) {
      let qiNiuRes = await api.Article.getQiNiuUpToken({
        token: localStorage.getItem("token"),
        type: 2
      });
      if (qiNiuRes.msg === "OK") {
        this.uptoken = qiNiuRes.result;
      }
    }
    //获取背景音乐列表
    let res = await api.Article.getArticleMusic({
      token: localStorage.getItem("token")
    });
    if (res.msg === "OK") {
      res.result.map((item, index) => {
        this.musicOptions.push({
          label: item.name,
          value: item.url
        });
      });
    }
  }
};
</script>

<style>
@import "article.css";
@import "publishArticle.css";
#ckeditor .ck-editor {
  margin-top: 10px;
}
#ckeditor .ck-rounded-corners .ck.ck-editor__main > .ck-editor__editable,
.ck.ck-editor__main > .ck-editor__editable.ck-rounded-corners {
  height: 426px;
  padding: 0px 20px;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
