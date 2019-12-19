<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">创建角色</el-button>

    <el-table v-loading="listLoading" border :data="rolesList" style="width: 100%;margin-top:30px;" @sort-change="sortChange">
      <el-table-column align="center" label="id" prop="id" sortable width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name" sortable width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标识名称" prop="identification" sortable width="220">
        <template slot-scope="scope">
          {{ scope.row.identification }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" prop="description" sortable label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getRolePage" />

    <el-dialog v-loading="dialogLoading" :visible.sync="dialogVisible" :destroy-on-close="true" :title="dialogType==='new'?'创建角色':'编辑角色'">
      <el-form ref="roleForm" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="标识名称" prop="identification">
          <el-input v-model="role.identification" placeholder="标识名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 4, maxRows: 10 }"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="路由分配">
          <el-tree
            ref="routeTree"
            class="route-tree"
            node-key="id"
            show-checkbox
            :check-strictly="checkStrictly"
            :data="routeTree"
            :props="routeTreeProps"
            :default-expanded-keys="role.routeIds"
            @check-change="checkRouteTreeChange"
          />
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="resourceTree"
            class="resource-tree"
            node-key="id"
            show-checkbox
            :check-strictly="checkStrictly"
            :data="resourceTree"
            :props="resourceTreeProps"
            :default-expanded-keys="role.resourceIds"
            @check-change="checkResourceTreeChange"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button v-loading="loading" type="primary" @click="dialogType==='new'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRolePage, getRoleById, addRole, updateRole, deleteRole } from '@/api/role'
import { getAllRouteTree } from '@/api/route'
import Pagination from '@/components/Pagination'
import { getAllResourceTree } from '../../api/resource' // 分页模块

const defaultRole = {
  id: '',
  name: '',
  identification: '',
  description: '',
  routeIds: [],
  resourceIds: []
}

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        keyword: '',
        orders: []
      },
      loading: false,
      role: Object.assign({}, defaultRole),
      routeTree: [],
      resourceTree: [],
      rolesList: [],
      dialogVisible: false,
      dialogLoading: false,
      dialogType: 'new',
      checkStrictly: true,
      routeTreeProps: {
        children: 'children',
        label: 'title'
      },
      resourceTreeProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '请输入标识名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolePage()
  },
  methods: {
    async getRolePage() {
      this.listLoading = true
      const { data } = await getRolePage(this.listQuery).catch(() => {
        this.listLoading = false
      })
      this.rolesList = data.records
      this.total = data.total
      this.listLoading = false
    },
    async getRouteTree() {
      const res = await getAllRouteTree()
      this.routeTree = res.data
    },
    async getResourceTree() {
      const res = await getAllResourceTree()
      this.resourceTree = res.data
    },
    sortChange(data) {
      const { prop, order } = data
      if (!order) {
        this.listQuery.orders = []
      } else if (order === 'ascending') {
        this.listQuery.orders = [{
          column: prop,
          asc: true
        }]
      } else {
        this.listQuery.sort = [{
          column: prop,
          asc: false
        }]
      }
      this.getRolePage()
    },
    checkRouteTreeChange() {
      this.role.routeIds = this.$refs.routeTree.getCheckedKeys()
    },
    checkResourceTreeChange() {
      this.role.resourceIds = this.$refs.resourceTree.getCheckedKeys()
    },
    async handleAdd() {
      this.role = {}
      this.loading = false
      this.dialogType = 'new'
      this.role = Object.assign({}, defaultRole)
      this.dialogVisible = true
      await this.getRouteTree().then(() => {
        this.$refs.routeTree.setCheckedKeys([])
      })
      await this.getRouteTree().then(() => {
        this.$refs.resourceTree.setCheckedKeys([])
      })
      this.dialogLoading = false
    },
    async handleEdit(scope) {
      this.role = {}
      this.loading = false
      this.dialogType = 'edit'
      await getRoleById(scope.row.id).then(async res => {
        this.role = res.data
        this.dialogVisible = true
        this.$nextTick(() => {
          this.getRouteTree().then(() => {
            this.$refs.routeTree.setCheckedKeys(this.role.routeIds || [])
          })
          this.getResourceTree().then(() => {
            this.$refs.resourceTree.setCheckedKeys(this.role.resourceIds || [])
          })
        })
      })
      this.dialogLoading = false
    },
    createData() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await addRole(this.role).then(res => {
            const { name, identification, description } = this.role
            this.dialogVisible = false
            this.$notify({
              title: '添加成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>标识名称：${identification}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getRoles()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    updateData() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          this.loading = true
          console.log(this.role)
          await updateRole(this.role).then(res => {
            const { name, identification, description } = this.role
            this.dialogVisible = false
            this.$notify({
              title: '修改成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>标识名称：${identification}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getRoles()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    async handleDelete({ row }) {
      console.log(row)
      this.$confirm('确定删除这个资源?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteRole(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRoles()
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '操作已取消!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
