<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">创建菜单</el-button>

    <el-table v-loading="listLoading" :data="menuList" style="width: 100%;margin-top:30px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
      <el-table-column align="center" label="id" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组件名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由" width="160">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标" width="80">
        <template slot-scope="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序等级" width="80">
        <template slot-scope="scope">
          {{ scope.row.priority }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="隐藏菜单" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hidden" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="打开固钉" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.affix" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新建菜单'">
      <el-form ref="menuForm" :model="menu" label-width="85px" label-position="right" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件名称">
              <el-input v-model="menu.name" placeholder="组件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称">
              <el-input v-model="menu.title" placeholder="显示名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单路由">
              <el-input v-model="menu.path" placeholder="菜单路由" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称">
              <el-input v-model="menu.title" placeholder="显示名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="组件名称" prop="name">
          <el-input v-model="menu.name" placeholder="组件名称" />
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="menu.path" placeholder="菜单路由" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图标">
              <el-input v-model="menu.icon" placeholder="菜单图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="menu.type" placeholder="请选择菜单类型">
                <el-option v-for="item in menuTypeOptions" :key="item.key" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序等级">
              <el-input-number v-model="menu.priority" :min="1" label="排序等级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐藏菜单">
              <el-radio-group v-model="menu.hidden">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="打开固钉">
              <el-radio-group v-model="menu.affix">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总是显示">
              <el-radio-group v-model="menu.alwaysShow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="启动缓存">
              <el-radio-group v-model="menu.noCache">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打开面包屑">
              <el-radio-group v-model="menu.breadcrumb">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="menu.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="菜单描述" />
        </el-form-item>
        <el-form-item label="父子节点">
          <el-cascader v-model="menu.pid" clearable :options="menuList" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', emitPath: false, checkStrictly: true }" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="dialogType==='new'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllMenuTree, addMenu, updateMenu } from '@/api/menu'
import { deepClone } from '@/utils'
import { deleteMenu } from '../../api/menu'

const menuTypeOptions = [
  { value: 0, name: '菜单' },
  { value: 1, name: '按钮' },
  { value: 2, name: 'API' }
]

const defaultMenu = {
  id: undefined,
  name: '',
  description: '',
  type: 0,
  path: '',
  redirect: '',
  component: '',
  props: '',
  pid: undefined,
  icon: '',
  priority: 1,
  hidden: false,
  alwaysShow: false,
  noCache: true,
  affix: false,
  breadcrumb: true
}

export default {
  data() {
    return {
      listLoading: true,
      loading: false,
      menu: Object.assign({}, defaultMenu),
      menuList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },
      menuTypeOptions
    }
  },
  computed: {
  },
  created() {
    this.getAllMenuTree()
  },
  methods: {
    async getAllMenuTree() {
      this.listLoading = true
      const res = await getAllMenuTree().catch(() => {
        this.listLoading = false
      })
      this.menuList = res.data
      this.listLoading = false
    },
    handleAdd() {
      this.loading = false
      this.menu = Object.assign({}, defaultMenu)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.loading = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.menu = deepClone(scope.row)
    },
    createData() {
      this.$refs.menuForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await addMenu(this.menu).then(res => {
            const { name, description } = this.menu
            this.dialogVisible = false
            this.$notify({
              title: '添加成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getAllMenuTree()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    updateData() {
      this.$refs.menuForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await updateMenu(this.menu).then(res => {
            console.log(res)
            const { name, description } = this.menu
            this.dialogVisible = false
            this.$notify({
              title: '修改成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getAllMenuTree()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    async handleDelete({ row }) {
      console.log(row)
      this.$confirm('确定删除这个菜单?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteMenu(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAllMenuTree()
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
    .menus-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
