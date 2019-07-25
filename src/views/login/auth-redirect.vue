<script>
export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1)
    console.log(hash)
    if (window.localStorage) {
      window.localStorage.setItem('x-admin-oauth-code', hash)
      window.close()
    }
  },
  render: h => h() // avoid warning message
}
</script>
