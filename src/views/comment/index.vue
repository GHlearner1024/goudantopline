<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条评论内容</span>
      </div>
      <el-table :data="articleList" style="width: 100%">
        <el-table-column  label="编号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">

            <el-button
              type="primary"
              size="mini"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
            >删除</el-button>

        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      // 搜索表单数据对象
      searchForm: {
        page: 1, // 当前数据记录页码
        per_page: 10, // 分页数据记录条数(10~50)
        status: '', // 文章状态
        channel_id: '', // 频道id
        timetotime: [], // 临时接收时间范围信息
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '' // 文章发布结束时间
      },
      articleList: [],
      tot: 0 // 文章总条数
    }
  },
  // 监听器设置
  watch: {
    // 被检测的成员: function (newV, oldV) {
    //   // newV:数据变化后样子
    //   // oldV:数据变化前样子
    // }
    // 被检测成员一般就是data成员,它们的名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    },
    searchForm: {
      handler: function (newV, oldV) {
        this.getArticleList()
      },
      deep: true
    }
  },
  created () {
    // 获得文章列表
    this.getArticleList()
  },
  methods: {
    // 频道组件方法，获得子组件传递过来的频道id并赋予给channel_id成员
    // val:子组件给传递过来的频道信息
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    // 删除文章
    del (id) {
      // 确认事情
      this.$confirm('确认要删除该文章么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // axios请求服务器端实现删除
          let pro = this.$http({
            url: '/mp/v1_0/articles/' + id,
            method: 'delete'
          })
          pro
            .then(result => {
              // 删除成功
              // console.log(result)  // 返回空的data数据
              // 直接页面刷新即可
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章失败：' + err)
            })
        })
        .catch(() => {})
    },
    // 获得真实文章列表数据
    getArticleList () {
      // 把searchForm内部为空的成员都"过滤掉"
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }
      this.$http({
        url: '/mp/v1_0/articles',
        method: 'GET',
        params: searchData
      })
        .then(result => {
          // console.log(result)
          // data接收文章数据
          this.articleList = result.data.data.results
          // 接收总条数
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得文章失败' + err)
        })
    },
    // 分页相关
    // 每条条数变化的回调处理handleSizeChange
    handleSizeChange (val) {
      // val : 变化后的每页条数
      // 更新每页条数
      this.searchForm.per_page = val
      // 根据变化后的每页条数重新获得文章列表
      this.getArticleList()
    },
    // 页码变化的回调处理
    handleCurrentChange (val) {
      // val:变化后的页码
      // 更新页码
      this.searchForm.page = val
      // 根据变化后的页码重新获得文章列表
      this.getArticleList()
    }
  }
}
</script>
<style lang="less" scoped>
/*给卡片区设置向下的外边距*/
.box-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
