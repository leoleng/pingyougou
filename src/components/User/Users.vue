<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible=true">主要按钮</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-table :data="userlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="手机号码" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="usreStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="putUsersData(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUsersList(scope.row.id)"
          ></el-button>

          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button
              type="success"
              icon="el-icon-share"
              size="mini"
              @click="showSetRoleDiaLog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 3, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form label-width="100px" :model="addFrom" ref="addFromRef" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsersFrom">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="putdialogVisible" width="50%">
      <el-form label-width="100px" :model="aditFrom" ref="putFromRef" :rules="putFormRules">
        <el-form-item label="用户名">
          <el-input v-model="aditFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="aditFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="aditFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tupUsersLste">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRemoveRole">
      <!-- 弹窗主体 -->
      <p>用户名：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.role_name}}</p>
      <p>
        分配新角色：
        <el-select v-model="selectId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    var checkEmail = (reul, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (reul, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        usrename: [
          { required: true, message: '请输入正确用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      putdialogVisible: false,
      aditFrom: {},
      putFormRules: {
        usrename: [
          { required: true, message: '请输入正确用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '电话号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      userInfo: [],
      setRoleDialogVisible: false,
      rolesList: [],
      selectId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 初始化页面
    async getUserList() {
      const { data: res } = await this.$http.get('Users', {
        params: this.queryInfo
      })
      // console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('提交失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 更新用户状态成功
    async usreStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 关闭新增框内容删除
    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
    },
    // 新增用户
    addUsersFrom() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('添加失败')

        const { data: res } = await this.$http.post('/users', this.addFrom)
        // console.log(res);
        this.dialogVisible = false
        this.addDialogClosed()
      })
    },
    // 显示修改内容
    async putUsersData(id) {
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status != 200) return this.$message.error('访问失败')

      this.aditFrom = res.data
      this.putdialogVisible = true
    },
    // 修改内容
    tupUsersLste() {
      this.$refs.putFromRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return

        const { data: res } = await this.$http.put(
          'users/' + this.aditFrom.id,
          {
            email: this.aditFrom.email,
            mobile: this.aditFrom.mobile
          }
        )
        if (res.meta.status != 200) return this.$message.error('访问失败')
        this.$message.success('修改成功')
        this.putdialogVisible = false
        this.getUserList()
      })
    },
    async deleteUsersList(id) {
      const usersConfirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(usersConfirm);
      if (usersConfirm !== 'confirm') {
        this.$message.error('取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) return 
      this.$message.success('删除成功')
      this.getUserList()
    },
    async showSetRoleDiaLog(row) {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
// console.log(this.rolesList);

      this.userInfo = row
      this.setRoleDialogVisible = true
    },
   async saveRoles(){
     if (!this.selectId) {
       this.$message.error('更改错误')
     }
    const {data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectId})
   // console.log(res);
  this.$message.success('更改成功')
  this.setRoleDialogVisible = false
    },
    setRemoveRole(){
     this.rolesList=[]
     this.selectId=''
    }
  }
}
</script>



<style lang="less" scoped>
</style>


