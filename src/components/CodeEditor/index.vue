<template>
  <div class="json-editor">
    <codemirror v-model="value" :options="cmOptions"/>
  </div>
</template>

<script>
import 'codemirror/mode/python/python.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/comment-fold.js'

export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    tabSize: {
      type: Number,
      default: 4
    },
    mode: {
      type: String,
      default: 'text/javascript'
    },
    theme: {
      type: String,
      default: 'base16-dark'
    },
    lineNumbers: {
      type: Boolean,
      default: true
    },
    line: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cmOptions: {
        tabSize: this.tabSize,
        mode: this.mode,
        theme: this.theme,
        lineNumbers: this.lineNumbers,
        line: this.line
      }
    }
  }
}
</script>

<style scoped>
</style>
