<template>
  <div>
    <h2 style="color:#fff">
      welcome to bilibili bainian ji
      <el-button @click="go">PLAY</el-button>
    </h2>
    <iframe
      src="//player.bilibili.com/player.html?aid=44160190&cid=77425883&page=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      v-if="isShow"
    ></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    go (n) {
      if (n.target.innerHTML === 'PLAY') {
        this.isShow = true
        n.target.innerHTML = 'OFF'
      } else {
        this.isShow = false
        n.target.innerHTML = 'PLAY'
      }
    }
  }
}
</script>

<style lang="less" scoped>
div {
  background: url(./1.png);
  height: 100%;
  iframe {
    display: block;
    margin: 0 auto;
    width: 80%;
    height: 90%;
    margin: 0 auto;
  }
}
</style>
