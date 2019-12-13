<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">创建菜单</el-button>

    <el-table v-loading="listLoading" :data="routeList" style="width: 100%;margin-top:30px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
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
      <el-form ref="routeForm" :model="route" label-width="85px" label-position="right" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件名称" prop="name">
              <el-input v-model="route.name" placeholder="组件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称">
              <el-input v-model="route.title" placeholder="显示名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由地址">
              <el-input v-model="route.path" placeholder="路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="前端组件">
              <el-input v-model="route.component" placeholder="前端组件" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重定向路径">
              <el-input v-model="route.redirect" placeholder="重定向路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标">
              <el-input v-model="route.icon" placeholder="菜单图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="隐藏菜单">
              <el-radio-group v-model="route.hidden">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总是显示">
              <el-radio-group v-model="route.alwaysShow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="启动缓存">
              <el-radio-group v-model="route.noCache">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打开固钉">
              <el-radio-group v-model="route.affix">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="打开面包屑">
              <el-radio-group v-model="route.breadcrumb">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父级路由">
              <el-cascader v-model="route.pid" clearable :options="routeList" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', emitPath: false, checkStrictly: true }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序等级">
              <el-input-number v-model="route.priority" :min="1" label="排序等级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="参数">
          <div class="json-editor-container">
            <json-editor ref="jsonEditor" v-model="propsToJson" />
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="route.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="路由描述" />
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
import JsonEditor from '@/components/JsonEditor'
import { getAllRouteTree, addRoute, updateRoute, deleteRoute } from '@/api/route'
import { deepClone } from '@/utils'

const defaultRoute = {
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
  name: 'Route',
  components: { JsonEditor },
  data() {
    return {
      listLoading: true,
      loading: false,
      route: Object.assign({}, defaultRoute),
      routeList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    propsToJson: {
      get() {
        return JSON.parse(this.route.props || '{}')
      },
      set(value) {
        this.route.props = JSON.stringify(value)
      }
    }
  },
  created() {
    this.getAllRouteTree()
  },
  methods: {
    async getAllRouteTree() {
      this.listLoading = true
      const res = await getAllRouteTree().catch(() => {
        this.listLoading = false
      })
      this.routeList = res.data
      this.listLoading = false
    },
    handleAdd() {
      this.loading = false
      this.route = Object.assign({}, defaultRoute)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.loading = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.route = deepClone(scope.row)
    },
    createData() {
      this.$refs.routeForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await addRoute(this.route).then(res => {
            const { name, description } = this.route
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
            this.getAllRouteTree()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    updateData() {
      this.$refs.routeForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await updateRoute(this.route).then(res => {
            console.log(res)
            const { name, description } = this.route
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
            this.getAllRouteTree()
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
        await deleteRoute(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAllRouteTree()
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
    .routes-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }

    .json-editor-container {
      line-height: normal;
    }
  }
</style>
