<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域列表 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >标签二</el-tag
            >
            <el-tag type="warning" v-else>标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    // 页面创建时，调用
    this.getrightlist()
  },
  methods: {
    // 获取页面的网络请求数据  利用promise中的async简化操作
    async getrightlist() {
      const { data: res } = await this.$http.get('rights/list')
     /*  console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style>
.el-main {
  line-height: 0px;
}
</style>
