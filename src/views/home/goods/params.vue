<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表单 -->
      <el-row class="col_title">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectCatekey2"
            :options="shopcateList"
            :props="selectProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handletabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isdisablevalue"
            @click="AddDialogVisible = true"
            >动态参数</el-button
          >
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" border>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- for循环tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handletagclose(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- input标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="EditShoW(scope.row.attr_id)"
                  >编译</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="deletshow(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isdisablevalue"
            @click="AddDialogVisible = true"
            >静态属性</el-button
          >
          <!-- 静态属性列表 -->
          <el-table :data="onlyTableData" border>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- for循环tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handletagclose(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- input标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="EditShoW(scope.row.attr_id)"
                  >编译</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="deletshow(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="titleDisable"
        :visible.sync="AddDialogVisible"
        width="50%"
        @close="AddDialogVisibleClose"
      >
        <!-- 添加参数form表单 -->
        <el-form
          :model="AddForm"
          :rules="AddFormrules"
          ref="AddFormref"
          label-width="100px"
        >
          <el-form-item :label="titleDisable" prop="attr_name">
            <el-input v-model="AddForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Addparams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        :title="titleDisable"
        :visible.sync="EditDialogVisible"
        width="50%"
        @close="EditDialogVisibleClose"
      >
        <!-- 添加参数form表单 -->
        <el-form
          :model="EditForm"
          :rules="EditFormrules"
          ref="EditFormref"
          label-width="100px"
        >
          <el-form-item :label="titleDisable" prop="attr_name">
            <el-input v-model="EditForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="EditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Editparams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据源
      shopcateList: [],
      // 级联选择器props参数配置对象
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器的数据双向绑定
      selectCatekey2: [],
      // tab也迁的数据双向绑定
      activeName: 'many',
      // many的数据和only的数据源
      manyTableData: [],
      onlyTableData: [],
      // 添加对话框的显示与隐藏
      AddDialogVisible: false,
      // 数据双向绑定addform
      AddForm: {
        attr_name: ''
      },
      // 添加参数的验证规则
      AddFormrules: {
        attr_name: [
          { required: true, message: '请输入正确的参数', trigger: 'blur' }
        ]
      },
      // 修改对话宽的隐藏
      EditDialogVisible: false,
      // 修改对话框的数据双向绑定
      EditForm: {},
      // 修改对话框的验证规则
      EditFormrules: {
        attr_name: [
          { required: true, message: '请输入正确的参数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateparams()
  },
  methods: {
    // 分类参数的数据处理 请求网络请求
    async getCateparams() {
      const { data: res } = await this.$http.get('categories')
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.shopcateList = res.data
      /* console.log(this.shopcateList) */
    },
    // 监听数据inp中数据发生改变时
    handleChange() {
      this.paramsData()
    },
    // 监听tab页签单击事件
    handletabClick() {
      this.paramsData()
      console.log(this.activeName)
    },
    // 获取列表数据的参数
    async paramsData() {
      // 证明选中的不是三级分类
      if (this.selectCatekey2.length !== 3) {
        this.selectCatekey2 = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 证明选中的是三级分类
      /*  console.log(this.selectCatekey2) */
      // 根据所选分类的id，和当前所处的面板，获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }

      // console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      // 判断选择的是many数据，还是only数据项
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭对话框重置数据
    AddDialogVisibleClose() {
      this.$refs.AddFormref.resetFields()
    },
    // 监听对话框关闭事件，对应的值添加到table理
    Addparams() {
      this.$refs.AddFormref.validate(async valid => {
        if (!valid) return this.$message.error('验证失败')
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.AddForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.AddDialogVisible = false
        this.getCateparams()
      })
    },
    // 修改的点击事件，显示与隐藏
    async EditShoW(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      /* console.log(res) */
      this.EditForm = res.data
      this.EditDialogVisible = true
    },
    // 修改对话框的重置事件
    EditDialogVisibleClose() {
      this.$refs.EditFormref.resetFields()
    },
    // 修改对话框的校验请求
    Editparams() {
      this.$refs.EditFormref.validate(async valid => {
        if (!valid) return this.$message.error('校验失败')
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.EditForm.attr_id}`,
          this.EditForm
        )
        /* console.log(res) */
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('修改成功')
        this.getCateparams()
        this.EditDialogVisible = false
      })
    },
    // 删除的单击事件 移除用户id
    async deletshow(attr_id) {
      const deletconfirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deletconfirm !== 'confirm') {
        return this.$message.info('用户已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateparams()
    },
    // 点击的enter 和 失去焦点 触发事件
      handleInputConfirm(row) {
      // 如果输入框为空 ，则直接返回
      if(row.inputValue.trim().length == 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return 则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveTagInputAll(row)
    },
    // input点击按钮的展开
    showInput(row) {
      row.inputVisible = true
      // $nextTick 方法的作用，就是当页面上元素
      // 被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存在数据里的一些参数
    async saveTagInputAll(row){
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status !== 200){
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    // 关闭保存数据库中的值
    handletagclose(index,row){
      row.attr_vals.splice(index,1)
      // 在刷新一些页面数据
      this.saveTagInputAll(row)
      }
  },
  computed: {
    // 监听级联选择器是否选择第三个
    // 如果是那就显示可选,否则就🈲选
    isdisablevalue() {
      if (this.selectCatekey2.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 获取，是否选择第三个选项的id
    cateId() {
      if (this.selectCatekey2.length === 3) {
        return this.selectCatekey2[2]
      }
      return null
    },
    // 监听添加按钮的是否是动态参数还是静态参数
    titleDisable() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style>
.el-main {
  line-height: 0px;
  text-align: left;
}
.col_title {
  margin: 20px 0px;
}
.el-tab-pane {
  line-height: 60px;
}
.input-new-tag {
  width: 150px;
}
</style>
