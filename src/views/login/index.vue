<template>
  <div class="login-container">
    <img
      id="bg"
      src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580303924543&di=7b91fa6091157ebbfdbf07a236a30cb0&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3Ddf0fb945d8a20cf44690fed746084b0c%2F60b9908fa0ec08fad7b02d6551ee3d6d57fbdafe.jpg"
      alt
    />
    <div class="login-box"  @keyup.enter='login()'>
      <!-- 绘制登录form表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index1.png" alt />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
             <i slot="prefix" class="iconfont icon-icon_mobile"></i>
             <i slot="suffix" class="iconfont icon-tongguo"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="iconfont icon-securityCode-b"></i>
             <i slot="suffix" class="iconfont icon-tongguo"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="xieyi">
          <!-- 复选框，单个复选框直接设置v-model即可，接收true/false的信息，表示是否选中 -->
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <el-form-item>
          <!-- 登录按钮 -->
          <el-button
            type="primary"
            style="width:100%;"
            @click="login()"
            :loading="isLoading"
            :disabled="isLoading"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// gt.js文件本身没有做导出动作，所以就直接导入即可，此时系统增加一个全局变量，名称为 initGeeTest
import './gt.js'
// 引入iconfont的css文件
import '@/assets/font/iconfont.css'
export default {
  name: '',
  data () {
    // 自定义校验函数，验证协议
    var xieyiTest = function (rule, value, callback) {
      // rule:校验规则，一般不用
      // value:当前被校验的信息
      // callback：回调函数，校验成功或失败都需要执行
      // if (value) {
      //   callback()
      // } else {
      //   return callback(new Error('请无条件遵守规矩'))
      // }
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      // 表单数据对象
      loginForm: {
        mobile: '13835834435', // 手机号码
        code: '246810', // 验证码
        xieyi: false // 协议复选框
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码不能为空' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码不能为空' }],
        xieyi: [{ validator: xieyiTest }]
      },
      isLoading: false, // 按钮是否等待、禁用
      capObj: null // 极验对象
    }
  },
  methods: {
    // 登录系统
    login () {
      // 表单要做校验
      // 表单对象.validate()
      // this.$refs.loginFormRef.validate(回调函数)
      this.$refs.loginFormRef.validate(valid => {
        // valid为true校验通过,否则校验失败,校验失败代码停止
        if (!valid) {
          return false
        }
        // 判断有极验对象直接使用
        if (this.capObj) {
          return this.capObj.verify()
        }
        this.isLoading = true // 禁用、等待按钮设置
        // A.人机交互验证
        // axios获得极验的秘钥信息
        this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'GET'
        })
          .then(result => {
            // console.log(result) // 极验秘钥
            // 从result里边解构下述的data对象出来(对象结构赋值)
            let { data } = result.data
            this.gt(data)
          })
          .catch(err => {
            return this.$message.error('获取极验秘钥失败' + err)
          })
        // B. 极验账号,登录系统
        // this.loginAct()
      })
    },
    // 账号真实性校验
    loginAct () {
      // 服务器端账号真实校验
      this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: this.loginForm
      })
        .then(result => {
          // 客户端浏览器把服务器端返回的秘钥等相关信息通过 sessionStorage 做记录，表明是登录状态
          window.sessionStorage.setItem(
            'userinfo',
            JSON.stringify(result.data.data)
          )
          // 进入后台系统
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          // 通过弹窗把错误显示出来
          // this.$message({
          //   type: 'error',
          //   message:'手机号码或验证码错误'+err
          // })
          this.$message.error('手机号码或验证密码错误' + err)
        })
    },
    // 极验方法  服务端SDK
    gt (data) {
      // 请检测data的数据结构,保证data.gt,data.challenge,data.success有值
      window.initGeetest(
        {
          // 以下配置参数来自服务端  SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind' // 设置验证窗口样式
        },
        captchaObj => {
          // 这里可以调用验证实力captchaObj的实例方法
          captchaObj
            .onReady(() => {
              // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
              captchaObj.verify() // 显示验证码窗口
              this.isLoading = false // 激活按钮设置
              this.capObj = captchaObj // 接收极验对象
            })
            .onSuccess(() => {
              // 校验行为正确的处理
              // B. 验证账号登录系统
              this.loginAct()
            })
            .onError(() => {
              // 行为校验错误的处理
            })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 410px;
    height: 340px;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
      .icon-tongguo{
        color: lightgreen
      }
    }
  }
  #bg {
    position: fixed;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -999;
  }
}
</style>
