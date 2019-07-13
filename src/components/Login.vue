<template>
  <div class="login_bgc">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>

      <el-form
        label-width="0"
        class="login_form"
        :model="loginFrom"
        ref="loginFromRef"
        :rules="loginFromRules"
      >
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆按钮</el-button>
          <el-button type="info" @click="esetLoginForm">取消按钮</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { log } from 'util'
import { async } from 'q'
export default {
  data() {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginFrom)

        if (res.meta.status !== 200) {
          // return this.$message.error('登陆失败')
        }
        this.$message.success('登陆成功')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    esetLoginForm() {
      this.$refs.loginFromRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_bgc {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login_logo {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    background: #ddd;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>



