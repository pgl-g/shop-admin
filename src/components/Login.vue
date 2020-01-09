<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="img_box">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <!-- 登入 -->
      <el-form
        label-width="0px"
        class="login_form"
        :rules="LoginRules"
        :model="Loginform"
        ref="loginref"
      >
        <el-form-item prop="username">
          <el-input
            v-model="Loginform.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="Loginform.password"
            prefix-icon="el-icon-s-cooperation"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button type="primary" @click="priClick">登入</el-button>
          <el-button type="info" @click="infoClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* 网络请求 */

export default {
  name: 'Login',
  data() {
    return {
      // 进行用户名的绑定
      Loginform: {
        username: 'admin',
        password: '123456'
      },
      // 绑定验证规则
      LoginRules: {
        username: [
          { required: true, message: '请输入正确的用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 监听重置表单
    infoClick() {
      //   console.log('resetFields')
      this.$refs.loginref.resetFields()
    },
    priClick() {
      this.$refs.loginref.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post('login', this.Loginform)
        if (res.meta.status !== 200) return this.$message.error('登入失败')
        this.$message.success('登入成功')
        // 1.将登录成功之后的token，保存到客户端的 sessionStorage 中
        //  1.1 项目中除了登录之外的其他API接口，必须在登入之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所有将token保存在sessionStorage中
        /* console.log(res) */
        window.sessionStorage.setItem('token', res.data.token)

        this.$router.push('/home')
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
      })
    }
  }
}
</script>

<style>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #2b4b6b;
}
.img_box {
  width: 130px;
  height: 130px;
  box-shadow: 0 0 10px #dddddd;
  padding: 10px;
  border: 1px solid #eeeeee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #fff;
}
.img_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #cccccc;
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
}
.login_form .login_btn {
  display: flex;
  justify-content: center;
}
</style>
