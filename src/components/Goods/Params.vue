<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert show-icon title="注意!只允许为第三级分类设置动态参数和静态参数" type="warning" :closable="false"></el-alert>
      <!-- 三级联动 -->
      <el-row>
        <el-col>
          <span>请选择商品分类</span>
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态管理" name="many">
            <el-button
              type="primary"
              sizi="mini"
              :disabled="isBntDisabled"
              @click="addDialogVisible = true"
            >添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态管理" name="only">
            <el-button
              type="primary"
              sizi="mini"
              :disabled="isBntDisabled"
              @click="addDialogVisible = true"
            >添加参数</el-button>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 显示表格 -->
      <template>
        <el-table :data="showCateList" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环显示属性 -->
              <el-tag
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="handleClose(index,scope.row)"
              >{{item}}</el-tag>

              <!-- 新增输入框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
                ref="saveTagInput"
              ></el-input>
              <!-- 显示新增输入框按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >添加参数</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">
                <i class="el-icon-edit" @click="putDialogVisible(scope.row.attr_id)">修改按钮</i>
              </el-button>
              <el-button type="danger" size="mini">
                <i class="el-icon-delete" @click="removeDialogVisible(scope.row.attr_id)">删除按钮</i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 新增数据表单 -->
    <el-dialog
      :title="'添加'+titleTaxt"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="formRemove"
    >
      <!-- 输入框 -->
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="120px">
        <el-form-item :label="'输入'+titleTaxt" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据表单 -->
    <el-dialog
      :title="'修改'+titleTaxt"
      :visible.sync="exidDialogVisible"
      width="50%"
      @close="exidFormRemove"
    >
      <!-- 输入框 -->
      <el-form :model="exidRuleForm" :rules="exidRules" ref="exidRuleFormRef" label-width="120px">
        <el-form-item :label="'输入'+titleTaxt" prop="attr_name">
          <el-input v-model="exidRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exidDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exidFormList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  data() {
    return {
      selectedKeys: [],
      cateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      cateId: 0,
      showCateList: [],
      dialogVisible: false,
      addDialogVisible: false,
      addRuleForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      exidRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      exidDialogVisible: false,
      exidRuleForm: {
        attr_name: ''
      },
      putId: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   初始化数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 联动发生改变时
    cateChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.showCateList = []
        return
      }
      this.cateId = this.selectedKeys[2]
      this.handleChange()
    },
    // 点击tab栏时
    handleClick() {
      if (this.selectedKeys.length !== 3) {
        return
      }
      this.handleChange()
    },
    // 联动获取动态和静态数据
    async handleChange() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // 让字符串变数组,然后添加新增输入框的开关
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(' ')
          : []
        element.inputVisible = false
        element.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.success('获取失败')
      }

      this.showCateList = res.data
    },
    // 关闭对话框清除数据
    formRemove() {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 关闭对话框清除数据
    exidFormRemove() {
      this.$refs.exidRuleFormRef.resetFields()
    },
    // 新增数据
    addFormList() {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        // console.log(res)

        this.$message.success('添加数据成功')
        this.handleChange()
      })

      this.addDialogVisible = false
    },
    // 点击修改按钮显示弹框
    async putDialogVisible(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      this.exidRuleForm.attr_name = res.data.attr_name
      this.putId = res.data.attr_id
      this.exidDialogVisible = true
    },
    // 确定修改的数据
    exidFormList() {
      this.$refs.exidRuleFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.putId}`,
          {
            attr_name: this.exidRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return
        this.handleChange()
        this.exidDialogVisible = false
      })
    },
    // 删除数据
    async removeDialogVisible(id) {
      const removeData = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (removeData !== 'confirm') {
        this.$message.error('你已经取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return
      this.$message.success('你已经删除')
      this.handleChange()
    },
    // 显示输入框
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 输入框数据添加
    async handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        // row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.addHandleInput(row)
      row.inputVisible = false
    },
    // 删除参数
    handleClose(i, row) {
      // console.log(i,row);
      row.attr_vals.splice(i, 1)
      this.addHandleInput(row)
    },
    // 更新参数
    async addHandleInput(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('操作失败')

      this.$message.success('操作成功')
      this.handleChange()
    }
  },

  computed: {
    //   是否开启按钮
    isBntDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    titleTaxt() {
      if (this.activeName === 'many') {
        return '动态数据'
      }
      return '静态数据'
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 10px 10px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>


