<template>
  <div>
    <iframe v-if="$route.query.src" ref="iframe" v-loading.fullscreen.lock="fullscreenLoading" :src="$route.query.src" class="iframe" />
    <iframe v-else ref="iframe" v-loading.fullscreen.lock="fullscreenLoading" :src="urlPath" class="iframe" />
  </div>
</template>

<script>
export default {
  name: 'MyIframe',
  components: {},
  data() {
    return {
      fullscreenLoading: false,
      urlPath: this.getUrlPath()
    }
  },
  created() {
    console.log('我进来了')
    this.fullscreenLoading = true
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.fullscreenLoading = false
        })
      } else {
        iframe.onload = () => {
          this.fullscreenLoading = false
        }
      }
    },
    getRedirectPath: function() {
      let url = this.$route.path
      url = url.replace('/iframe/redirect=', '')
      return url
    },
    getUrlPath: function() {
      let url = window.location.href
      url = url.substring(url.indexOf('redirect=') + 9)
      console.log('http://' + url)
      return 'http://' + url
    }
  }
}
</script>

<style>
    .iframe {
        width: 100%;
        height: 100%;
        border: 0;
        overflow: hidden;
        box-sizing: border-box;
    }
</style>
