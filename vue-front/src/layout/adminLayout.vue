<template>
    <div>
      <div class="content">
        <router-view></router-view>
      </div>
      <Menu></Menu>
    </div>
</template>

<script>
import Menu from './adminMenu.vue'

export default {
  name: 'app',
  components: {
    Menu,
  }
}
</script>

<style scoped>

* {margin: 0; padding: 0;}
.content{
  padding-left:130px; 
  padding-right:30px;
  max-width: 1200px;
  margin: auto;
}

</style>
