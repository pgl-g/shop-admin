<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加分类 -->
      <div class="addFen">
        <el-button type="primary" @click="AddCate">添加分类</el-button>
      </div>
      <!-- 添加按钮显示对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="AdddialogVisible"
        width="50%"
        @close="addcateClose"
      >
        <!-- 表单的宣布 -->
        <el-form
          :model="AddForm"
          :rules="Addrules"
          ref="AddFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="AddForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options是数据源 -->
            <el-cascader
              v-model="parentskeys"
              :options="parentsList"
              expandTrigger="hover"
              :props="parentsCateprops"
              @change="parenthandleChange"
              clearable
              show-all-levels
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="AdddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddnewCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- treetable区域 -->
      <tree-table
        :data="getGoods"
        :columns="columns"
        index-text="#"
        show-index
        :show-row-hover="false"
        :expand-type="false"
        border
        :selection-type="false"
      >
        <!-- 作用域插槽显示是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            type="success"
            class="el-icon-success"
            style="color:green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i type="danger" class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 作用域插槽显示排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0" size="mini"
            >一级</el-tag
          >
          <el-tag
            type="danger"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 作用域插槽显示操作 -->
        <template slot="oper" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getcategories.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getcategories.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      getcategories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      getGoods: [],
      // 为总数据条子赋值，以便分页效果
      total: 0,
      // 树形表格
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'oper'
        }
      ],
      // 添加分类的显示与隐藏
      AdddialogVisible: false,
      // 添加的表单
      AddForm: {
        cat_pid: 0,
        cat_name: 'a',
        cat_level: 0
      },
      // 添加分类表单的验证规则
      Addrules: {
        cat_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 父级列表的数据
      parentsList: [],
      // 父级分类的数据双向绑定
      parentskeys: [],
      parentsCateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.getcategories
      })
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.getGoods = res.data.result
      this.total = res.data.total
      /* console.log(this.getGoods) */
    },
    // 分页功能的完善
    handleSizeChange(newsize) {
      this.getcategories.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange(newnum) {
      this.getcategories.pagenum = newnum
      this.getCateList()
    },
    // 监听分类对话框的显示与隐藏事件
    AddCate() {
      this.parentsgetcateList()
      this.AdddialogVisible = true
    },
    // 获取父级的中对话款的表单的分类数据
    async parentsgetcateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.parentsList = res.data
      /* console.log(this.parentsList) */
    },
    // 监听父级分类数据发生改变
    parenthandleChange() {
      console.log(this.parentskeys)
      // 如果 parentskeys 数组中的length 大于0，则证明选中的父级分类
      // 反之，就说明没有选中任何父类
      if (this.parentskeys.length > 0) {
        this.AddForm.cat_pid = this.parentskeys[this.parentskeys.length - 1]
        this.AddForm.cat_level = this.parentskeys.length - 1
        return
      } else {
        // 父级分类的id
        this.AddForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.AddForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    AddnewCate() {

        /* validate
            对整个表单进行校验的方法，参数为一个回调函数。
            该回调函数会在校验结束后被调用，并传入两个参数：
            是否校验成功和未通过校验的字段。若不传入回调函数，
            则会返回一个 promise
            */
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.AddForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('创建失败')
        }
        console.log(res)
        this.$message.success('添加数据成功')
        this.getCateList()
        this.AdddialogVisible = false
      })
    },
    addcateClose() {
      this.$refs.AddFormRef.resetFields()
      this.parentskeys = []
      this.AddForm.cat_pid = 0
      this.AddForm.cat_level = 0
    }
  }
}
</script>

<style>
.el-main {
  line-height: 0px;
}
.addFen {
  display: flex;
}
</style>
