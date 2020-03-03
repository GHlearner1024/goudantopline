<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <quill-editor v-model="addForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面：">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog(item)">
                <span>点击图标选择图片</span>
                    <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt="" />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="频道：" prop="channel_id">
            <channel @slt="selectHandler"></channel>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%" @close="clearImage">
          <!-- 标签切换效果 -->
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="first">
              <!-- 素材图片列表展示 -->
              <ul>
                <li class="image-box" v-for="item in imageList" :key="item.id">
                  <img :src="item.url" alt="没有图片" @click="clkImage" />
                </li>
              </ul>
                    <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="addhForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="addForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination> -->
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="second">
              <el-button type="primary">上传图片</el-button>
            </el-tab-pane>
          </el-tabs>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="imageOK">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入频道公共组件
import Channel from '@/components/channel.vue'
// 通过es6按需导入方式 导入需要的组件模块富文本编辑器
import { quillEditor } from 'vue-quill-editor'
// 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'ArticleAdd',
  data () {
    return {
      materialUrl: '', // 选中的素材图片的路径名地址信息
      xu: 0,
      activeName: 'first', // 默认激活标签
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      dialogVisible: false, // 素材对话框是否启用
      addForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      },
      // 表单校验规则
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      }
    }
  },
  computed: {
    covernum () {
      // 设计选择框显示个数
      // type>0  ========= type值
      // type<=0 ==========0 值
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  components: {
    quillEditor,
    // 注册频道独立组件
    Channel
  },
  created () {
    this.getImageList() // 获得供选取的素材图片
  },
  methods: {
    // 素材图片选取好，点击“对话框”确定按钮后，记录素材图片
    imageOK () {
      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('没有选择图片')
      }
    },
    // 素材图片被单击选中
    clkImage (evt) {
      // evt:事件对象
      // console.log(evt) // MouseEvent
      // evt.target: 目标被单击的dom的img对象
      // evt.target.parentNode // 获得父级li标签对象
      // 给li设置border边框效果

      // 清除之前选择图片的状态信息
      this.clearImage()

      // 当前选中项目的border给设置好
      let nowli = evt.target.parentNode
      nowli.style.border = '5px solid green'
      // 把当前选中图片的src地址信息赋予给meterialUrl成员
      this.materialUrl = evt.target.src
    },
    // 清除之前选择素材图片的痕迹(边框高亮、图片路径名)
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      this.materialUrl = '' // 清除图片路径名
    },
    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          // console.log(result)
          // imageList接收素材图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },
    // 展示对话框逻辑
    showDialog (n) {
      // 更新xu成员
      this.xu = n - 1
      this.dialogVisible = true // 打开dialog对话框
    },
    // 频道组件方法，获得子组件传递过来的频道id并赋予给channel_id成员
    // val:子组件给传递过来的频道信息
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    // 发表文章
    // @flag: false发布   true草稿
    addarticle (flag) {
      // 表单整体校验
      this.$refs.addFormRef.validate(valid => {
        // 校验失败停止后续执行
        if (!valid) {
          return false
        }

        // 继续
        // axios
        let pro = this.$http({
          url: '/mp/v1_0/articles',
          method: 'post',
          data: this.addForm, // 表单数据
          params: { draft: flag } // 请求字符串数据
        })
        pro
          .then(result => {
            this.$message.success('发布文章成功！')
            // console.log(result)
            // 跳转到列表页面
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            return this.$message.error('发布文章失败：' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor /deep/ .ql-editor {
  height: 200px;
}
// 上述样式解析完毕：.quill-editor[data-v-494db270] .ql-editor{height:200px;}
// 文章封面选择框样式
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
</style>
