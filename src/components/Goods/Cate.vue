
<template>
  <div>
    <h3>商品分类</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateData">主要按钮</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-error" style="color:red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color:green" v-else></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.cat_level===0">一级按钮</el-button>
          <el-button type="info" size="mini" v-else-if="scope.row.cat_level===1">二级按钮</el-button>
          <el-button type="warning" size="mini" v-else>三级按钮</el-button>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="success" size="mini">
            <i class="el-icon-edit"></i>
            编辑按钮
          </el-button>
          <el-button type="danger" size="mini">
            <i class="el-icon-delete"></i>
            删除按钮
          </el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateList.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="cateList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 新增 -->
      <el-dialog title="提示" :visible.sync="cateDialogVisible" width="50%">
        <el-form :model="addCateForm" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级选择框">
            <el-cascader
              expand-trigger="hover"
              v-model="selectedKeys"
              :options="cateGoriesList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateGories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      cateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cateGoriesList: [],
      selectedKeys: [],
      cascaderProps: {
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
      const { data: res } = await this.$http.get('/categories/', {
        params: this.cateGories
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      //   console.log(this.cateList);
    },
    // 分页
    handleSizeChange(newSize) {
      this.cateGories.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.cateGories.pagenum = newPage
      this.getCateList()
    },
    addCateData() {
      this.getAddCateData()
      this.cateDialogVisible = true
    },
    async getAddCateData() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.cateGoriesList = res.data
    },
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
        return
      }
      // console.log(this.selectedKeys.cat_pid);
    },
   async addForm() {
       const { data: res } = await this.$http.post(
         'categories',
         this.addCateForm
       )
       console.log(res)
       this.cateDialogVisible = false
       this.$message.success('添加成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>


