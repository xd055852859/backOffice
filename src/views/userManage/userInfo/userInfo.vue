<template>
  <div id="user" class="main-container">
    <header class="main-header user-header">
      <span>个人详情</span>
      <el-button
        type="primary"
        size="small"
        @click="toUserManage()"
        style="height:40px"
      >返回用户首页</el-button>
    </header>
    <div class="userInfo-container">
      <div class="userInfo-title">个人头像</div>
      <div class="userInfo-avatar">
        <div class="userInfo-avatar-item" v-for="(item,index) in avatarList" :key="index">
          <img :src="item">
        </div>
        <div class="userInfo-avatar-item" v-for="(item,index) in avatarNum" :key="'avatar'+index">
          <span style="fontSize: 12px;color: #B8B8B8;">用户未上传</span>
        </div>
      </div>
      <div class="userInfo-title">基本信息</div>
      <div
        class="userInfo-msg"
        v-for="(item,index) in msgList"
        :key="'msg'+index"
      >{{item.name}} : {{item.value}}</div>
      <div class="userInfo-title">工作经历</div>
      <div class="userInfo-work" v-if="workState">
        <div class="userInfor-work-item" v-for="(item,index) in workList" :key="'work'+index">
          <div>{{item.company}}</div>
          <div>{{item.company}} &nbsp;{{item.time}}</div>
        </div>
      </div>
      <div class="userInfo-work" v-if="!workState">
        <span>用户未填写</span>
      </div>
      <div class="userInfo-title">教育经历</div>
      <div class="userInfo-work" v-if="educationState">
        <div class="userInfor-work-item" v-for="(item,index) in educationList" :key="'work'+index">
          <div>{{item.name}}</div>
          <div>{{item.position}} &nbsp;{{item.time}}</div>
        </div>
      </div>
      <div class="userInfo-work" v-if="!educationState">
        <span>用户未填写</span>
      </div>
      <div class="userInfo-title">兴趣标签</div>
      <div class="userInfo-interest" v-if="interestState">
        <span
          class="userInfo-interest-item"
          v-for="(item,index) in interestList"
          :key="'interest'+index"
        >{{item}}</span>
      </div>
      <div class="userInfo-work" v-if="!interestState">
        <span>用户未填写</span>
      </div>
      <div class="userInfo-title">实名认证</div>
      <div class="userInfo-trueName">
        <div class="userInfo-trueName-item">用户未认证</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/index";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  name: "UserInfo",
  components: {
    // RoleDialog
  },
  data: () => {
    return {
      profile: {},
      avatarList: [],
      workList: [],
      workState: false,
      educationList: [],
      educationState: false,
      interestList: [],
      interestState: false,
      avatarNum: 6,
      msgList: [
        { name: "Home ID", value: "", key: "icareId" },
        { name: "用户名", value: "", key: "nickName" },
        { name: "手机号", value: "", key: "mobile" },
        { name: "性别", value: "", key: "gender" },
        { name: "生日", value: "", key: "birthday" },
        { name: "出生地", value: "", key: "birthAddress" },
        { name: "居住地", value: "", key: "residence" },
        { name: "邮箱", value: "", key: "email" },
        { name: "个性签名", value: "", key: "slogan" }
      ]
    };
  },
  methods: {
    toUserManage() {
      this.$router.push({ name: "userManage" });
    }
  },
  mounted: async function() {
    console.log(this.targetUserInfo);
    this.profile = Object.assign(this.targetUserInfo.profile);
    if (this.profile.avatarList && this.profile.avatarList.length > 0) {
      this.avatarList = this.profile.avatarList;
      this.avatarNum = 6 - this.profile.avatarList.length;
    }
    if (this.profile.workExperience && this.profile.workExperience.length > 0) {
      this.workList = this.profile.workExperience;
      this.workState = true;
      this.workList.map((item, index) => {
        item.time =
          moment(item.starttime).format("YYYY/MM") +
          " - " +
          moment(item.endtime).format("YYYY/MM");
      });
    }
    if (this.profile.education && this.profile.education.length > 0) {
      this.educationList = this.profile.education;
      this.educationState = true;
      this.educationList.map((item, index) => {
        item.time =
          moment(item.starttime).format("YYYY/MM") +
          " - " +
          moment(item.endtime).format("YYYY/MM");
      });
    }
    if (this.profile.interest && this.profile.interest.length > 0) {
      this.interestList = this.profile.interest;
      this.interestState = true;
    }

    this.msgList[0].value = this.targetUserInfo.icareId;
    this.msgList[1].value = this.profile.nickName;
    this.msgList[2].value = this.targetUserInfo.mobile;
    this.msgList[3].value = this.profile.gender ? "女" : "男";
    this.msgList[4].value = moment(this.profile.birthday).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    this.msgList[5].value = this.profile.birthAddress;
    this.msgList[6].value = this.profile.residence;
    this.msgList[7].value = this.profile.email;
    this.msgList[8].value = this.profile.slogan;
  },
  computed: {
    ...mapState({
      targetUserInfo: state => state.user.targetUserInfo
    })
  },
  watch: {}
};
</script>

<style>
@import "userInfo.css";
</style>
