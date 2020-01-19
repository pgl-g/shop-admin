<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 添加按钮的操作 -->
      <el-row :gutter="20">
        <!-- 左边搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userOrder.query"
            prefix-icon="el-icon-search"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @clear="getOrderList"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="userOrderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay == '0'"
              >未付款</el-tag
            >
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="ShowEditclick"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="ShowprogressClick"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能的实现 -->
      <el-pagination
        @size-change="OrderhandleSizeChange"
        @current-change="OrderhandleCurrentChange"
        :current-page="userOrder.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="userOrder.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="ShowdialogVisible" width="50%">
      <el-form
        :model="ShowForm"
        :rules="ShowFormrules"
        ref="ShowFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="ShowForm.address1"
            :options="Citydata"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="ShowForm.address2"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ShowdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ShowdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流管理订单信息的对话框 -->
    <el-dialog
      title="物流管理"
      :visible.sync="ProgressdialogVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 地址的导入
import Citydata from './citydata'
export default {
  data() {
    return {
      // input中的数据双向绑定
      userOrder: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总共商品条数
      total: 0,
      // 订单所有的数据
      userOrderList: [],
      // 是否显示修改地址对话框
      ShowdialogVisible: false,
      // 修改对话框的数据双向绑定
      ShowForm: {
        address1: [],
        address2: ''
      },
      // 修改对话框的验证规则
      ShowFormrules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细的地址', trigger: 'blur' }
        ]
      },
      // 地址的注册
      Citydata,
      // 物流管理对话框的显示与隐藏
      ProgressdialogVisible: false,
      // 物流信息的数据源
      progressData: [],
      //时间线
      reverse: true,
    }
  },
  created() {
    // 获取订单管理所有的数据
    this.getOrderList()
  },
  methods: {
    // 获取订单管理所有的数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.userOrder
      })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('订单列表获取失败')
      }
      this.userOrderList = res.data.goods
      this.total = res.data.total
      console.log(this.userOrderList)
    },
    // 监听当每页几条数局发生改变的时
    OrderhandleSizeChange(newsize) {
      this.userOrder.pagesize = newsize
      this.getOrderList()
    },
    // 监听页数发生改变的时候
    OrderhandleCurrentChange(newnum) {
      this.userOrder.pagenum = newnum
      this.getOrderList()
    },
    // 点击监听修改对话框的显示与隐藏
    ShowEditclick() {
      this.ShowdialogVisible = true
    },
    // 点击监听物流管理对话框的显示与隐藏
    async ShowprogressClick() {
      // 获取物流信息的数据的
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressData = res.data
      //    console.log(this.progressData)
      this.ProgressdialogVisible = true
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
