<template>
  <div>
    <div style="margin-bottom:15px;">
      你的角色: {{ roleView }}
    </div>
    切换角色:
    <el-radio-group v-model="switchRoles">
      <el-radio-button v-for="(role, index) in roles" :key="index" :label="role.identification">
        {{ role.name }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    roleView() {
      return this.$store.getters.roles.map(res => res.name)
    },
    switchRoles: {
      get() {
        return this.roles[0].identification
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
