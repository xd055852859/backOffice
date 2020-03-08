<template>
  <div class="login-container">
    <div class="login-form">
      <header class="login-title">时光科技综合管理平台</header>
      <div class="login-input">
        <el-input v-model="mobile" type="text" placeholder="请输入账号" name="mobile" autocomplete="off"></el-input>
      </div>
      <div class="login-input">
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          name="password"
          autocomplete="off"
        ></el-input>
      </div>
      <el-button type="primary" round :style="{width:'80%',height:'40px'}" @click="loginAdmin()">登陆</el-button>
      <!-- <footer class="login-footer">
        <span>注册</span>
        <span>重置密码</span>
      </footer>-->
    </div>
  </div>
</template>

<script>
import api from "../../api/index";
export default {
  name: "Login",
  components: {},
  data: () => {
    return {
      mobile: "",
      password: "",
      roleArray: []
    };
  },
  methods: {
    async loginAdmin() {
      if (!/^[0-9]+$/.test(this.mobile)) {
        this.$message.error("请输入正确的手机号码");
        return;
      }
      if (!/^[a-zA-Z0-9]{6,18}$/.test(this.password)) {
        this.$message.error("请输入数字或字母组成的6-18位密码");
        return;
      }
      let res = await api.Login.login({
        mobile: this.mobile,
        password: this.password
      });
      if (res && res.msg === "OK") {
        this.$message.success("登录成功");
        localStorage.setItem("token", res.token);
        localStorage.setItem("userKey", res._key);
        localStorage.setItem("profile", JSON.stringify(res.profile));
        localStorage.setItem("role", JSON.stringify(res.role));
        const redirect = this.$route.query.redirect || "home";
        this.$router.push({ name: redirect });
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted: function() {
    console.log("login");
  }
};
</script>

<style>
.login-container {
  height: 100%;
  width: 100%;
  background-image: url("../../assets/background.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 600px;
  height: 400px;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.login-title {
  width: 100%;
  margin: 20px 0px 30px 0px;
  text-align: center;
  font-size: 28px;
}
.login-input {
  width: 80%;
}
.login-footer {
  width: 80%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
