<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style lang="less">
.my-align-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.start-msg {
  color: #656565 !important;

  h1,
  h2,
  h3,
  h4 {
    color: #656565 !important;
  }
}
</style>
<style scoped lang="scss">
::v-deep #app {
  min-height: fit-content;
}
::v-deep .v-application--wrap {
  min-height: fit-content;
}

::v-deep .v-application {
  height: 100%;
}
</style>
