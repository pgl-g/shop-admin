<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮的操作 -->
      <el-row :gutter="20">
        <!-- 左边搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="usergoods.query"
            prefix-icon="el-icon-search"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @clear="getGoodsList"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 右边按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | deteFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteClick(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能实现 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usergoods.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="usergoods.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // input中的数据双向绑定
      usergoods: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        order_id:''
      },
      // 总共商品条数
      total: 0,
      // goods的商品的总数据
      userList: [],
      
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取goods里面的所有数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.usergoods
      })
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('参数获取失败')
      }
      this.$message.success('获取成功')
      this.userList = res.data.goods
      this.total = res.data.total
    },

    // 当页码发生改变的时候，获取到最新的页码
    handleSizeChange(newsize) {
      // 将最新的页码保存到usergoods里面中
      this.usergoods.pagesize = newsize
      // 更新整个的数据
      this.getGoodsList()
    },
    // 当每条页码下的条数发生改变的时候，更新最新的一页的数据、
    handleCurrentChange(newnum) {
      // 将最新的页码保存到usergoods里面中
      this.usergoods.pagenum = newnum
      this.getGoodsList()
    },
    // 根据商品id来进行删除
    async deleteClick(id) {
      const DeletConfirms = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(DeletConfirms)
      if (DeletConfirms !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    // 监听添加按钮的路由跳转
    goAddpage() {
      this.$router.push({
        path: '/goods/add'
      })
    }
  }
}
</script>

<style>
.el-main {
  line-height: 0px;
  text-align: left;
}
</style>
