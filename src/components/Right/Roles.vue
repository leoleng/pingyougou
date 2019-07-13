<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card class="box-card">
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index1 === 0 ? 'bdTop': '']"
              v-for="(itme1,index1) in scope.row.children"
              :key="itme1.id"
            >
              <el-col :span="5">
                <el-tag>{{itme1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(itme2,index2) in itme1.children"
                  :key="itme2.id"
                  :class="[index2 === 0 ? '': 'bdTop']"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable>{{itme2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="danger"
                      v-for="(itme3,index3) in itme2.children"
                      :key="itme3.id"
                      closable
                      @close="removeRightById(scope.row,itme3.id)"
                    >{{itme3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-button
              type="success"
              icon="el-icon-share"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
      <!-- 更改权限列表 -->
    <el-dialog title="提示" :visible.sync="setDialogVisible" width="50%" @close="closeShowRightsList">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="showRightsList"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addShowRightsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setDialogVisible: false,
      rightsList: [],
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      showRightsList: [],
      RoleId:0,
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 初始化数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      //   console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error('请求失败')
      }
      this.rolesList = res.data
    },
    // 删除权限
    async removeRightById(row, id) {
      const result = await this.$confirm(
        '此操作将删除您选中的权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => drr)
      //如果用户点击的是取消
      if (result != 'confirm') {
        //用户点击的是取消
        return this.$message.error('取消了删除操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      )

      if (res.meta.status !== 200) {
        //用户点击的是取消
        return this.$message.error('取消了删除操作')
      }
      this.getRolesList()
      return this.$message.success('删除操作成功')
    },
    // 获取树形控件数据
    async showSetRightsDialog(role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.RoleId=role.id
      this.rightsList = res.data
      this.getshowRightsList(role, this.showRightsList)
      this.setDialogVisible = true
    },
    // 递归
    getshowRightsList(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getshowRightsList(item, arr)
      })
    },
    // 清空
    closeShowRightsList() {
      this.showRightsList = []
    },
// 增加权限
  async addShowRightsList() {
        const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const Str =keys.join(",")
        const {data:res}= await this.$http.post(`roles/${this.RoleId}/rights`,{rids:Str})
      
      if (res.meta.status !==200) {
        this.$message.error("提交失败")
      }
        
        this.$message.success("提交成功")
        this.getRolesList()
        this.setDialogVisible=false


    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdTop {
  border-top: 1px solid #eee;
}
</style>


