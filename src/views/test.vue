<template>
  <div id="test">
    <div class="editorItem">
      <!-- <div
        v-for="(item,index) in activehideArr"
        :key="index"
        class="editorDiv"
        :style="item.type==='h3'?{marginLeft:'20px',fontSize:'12px',color:'#666'}:item.type==='h4'?{marginLeft:'40px',fontSize:'12px'}:{marginLeft:'0px',fontSize:'12px'}"
        @click="clickEditor(item.type,item.num)"
      >
        <div v-if="item.type==='h2'" @click="hideH3(index)">向下</div>
        <div v-if="item.type==='h3'" @click="hideH4(index)">向下向下</div>
        {{item.text}}
      </div>-->
      <div>目录</div>
      <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
        v-for="(item,index) in typeArr"
        text-color="#000"
        active-text-color="#000"
        :key="index"
        :collapse="false"
      >
        <el-menu-item :index="index+''" v-if="item.submenuItem.length===0">
          <template slot="title">
            <span class="eidtorTitle" @click="clickEditor(item.type,item.num)">{{item.name}}</span>
          </template>
        </el-menu-item>
        <el-submenu
          @click="clickEditor(item.type,item.num)"
          :index="index+''"
          v-if="item.submenuItem.length>0"
        >
          <template slot="title">
            <span class="eidtorTitle" @click="clickEditor(item.type,item.num)">{{item.name}}</span>
          </template>
          <el-submenu
            :index="index+'-'+subIndex"
            v-for="(subItem,subIndex) in item.submenuItem"
            :key="subIndex"
          >
            <template slot="title">
              <span
                class="eidtorTitle"
                @click="clickEditor(subItem.type,subItem.num)"
              >{{subItem.name}}</span>
            </template>
            <el-menu-item
              :index="index+'-'+subIndex+'-'+optionIndex"
              v-for="(optionIndexItem,optionIndex) in subItem.submenuItemOption"
              :key="optionIndex"
            >
              <template slot="title">
                <span
                  class="eidtorTitle"
                  @click="clickEditor(optionIndexItem.type,optionIndexItem.num)"
                >{{optionIndexItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>

    <ckeditor
      id="ckeditor"
      :editor="editor"
      v-model="articleData"
      :config="editorConfig"
      @ready="editorReady"
      :style="{overflow: 'auto',height:'100%'}"
    ></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import MyUploadAdapter from "../common/myUploadAdapter";
import uploadFile from "../common/upload";
export default {
  data() {
    return {
      articleData: "",
      editor: ClassicEditor,
      editorConfig: {
        language: "zh-cn"
      },
      typeArr: [],
      h2Num: 0,
      h3Num: 0,
      h4Num: 0,
      hideArr: []
    };
  },
  methods: {
    editorReady(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new MyUploadAdapter(loader, this.domain, this.uptoken);
      };
    },
    clickEditor(type, index) {
      console.log(type, index);
      let editor = document.getElementsByClassName(
        "ck-editor__editable_inline"
      )[0];
      let target = editor.getElementsByTagName(type)[index];
      editor.scrollTop = target.offsetTop - editor.offsetTop;
      let range = document.createRange();
      range.selectNodeContents(target);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },
  // computed: {
  //   activehideArr() {
  //     return this.typeArr.filter((item, index) => {
  //       return this.hideArr.indexOf(index) === -1;
  //     });
  //   }
  // },
  mounted() {},
  watch: {
    articleData(newValue, oldValue) {
      if (newValue !== oldValue) {
        let doc = new DOMParser().parseFromString(newValue, "text/html");
        let h1Dom = doc.getElementsByTagName("h2");
        let h2Dom = doc.getElementsByTagName("h3");
        let h3Dom = doc.getElementsByTagName("h4");
        this.typeArr = [];
        this.h1Num = 0;
        this.h2Num = 0;
        this.h3Num = 0;
        let walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);
        let node = walker.nextNode();
        let submenuIndex = 0;
        let submenuItemIndex = 0;
        while (node !== null) {
          if (node.innerText.trim() !== "") {
            if (h1Dom.length > 0) {
              if (node.tagName === "H2") {
                this.typeArr.push({
                  name: node.innerText,
                  submenuItem: [],
                  num: this.h1Num,
                  type: "h2"
                });
                this.h1Num = this.h1Num + 1;
                submenuIndex = this.typeArr.length - 1;
              }
              if (node.tagName === "H3") {
                this.typeArr[submenuIndex].submenuItem.push({
                  name: node.innerText,
                  submenuItemOption: [],
                  num: this.h2Num,
                  type: "h3"
                });
                this.h2Num = this.h2Num + 1;
                submenuItemIndex =
                  this.typeArr[submenuIndex].submenuItem.length - 1;
              }
              if (node.tagName === "H4") {
                this.typeArr[submenuIndex].submenuItem[
                  submenuItemIndex
                ].submenuItemOption.push({
                  name: node.innerText,
                  num: this.h3Num,
                  type: "h4"
                });
                this.h3Num = this.h3Num + 1;
              }
            } else if (h2Dom.length > 0) {
              if (node.tagName === "H3") {
                this.typeArr.push({
                  name: node.innerText,
                  submenuItem: [],
                  num: this.h2Num,
                  type: "h3"
                });
                this.h2Num = this.h2Num + 1;
                submenuIndex = this.typeArr.length - 1;
              }
              if (node.tagName === "H4") {
                this.typeArr[submenuIndex].submenuItem.push({
                  name: node.innerText,
                  submenuItemOption: [],
                  num: this.h3Num,
                  type: "h4"
                });
                this.h3Num = this.h3Num + 1;
              }
            } else if (h3Dom.length > 0) {
              if (node.tagName === "H4") {
                this.typeArr.push({
                  name: node.innerText,
                  submenuItem: [],
                  num: this.h3Num,
                  type: "h4"
                });
                this.h3Num = this.h3Num + 1;
              }
            }
          }
          node = walker.nextNode();
        }
      }
    }
  }
};
</script>

<style  scoped>
#test {
  display: grid;
  font-size: 14px;
  grid-template-columns: 20% 80%;
  height: 100%;
  width: 100%;
}
.editorItem {
  padding: 10px;
}
.editorDiv {
  font-size: 12px;
  display: grid;
  grid-template-columns: 20% 80%;
}
.eidtorTitle {
  display: inline-block;
  height: 100%;
  width: 60%;
}
</style>