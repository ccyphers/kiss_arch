<template>
    <div class="container">
        <div class="item" v-for="result in results">
          <div class="title">{{result.title}}</div>
          <div class="description">{{result.description}}</div>
        </div>

    </div>

</template>

<script>

export default {
  name: 'search-results',
  props: ['results'],
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

.item {
  padding-bottom: 15px;
}

.title {
  font-weight: bolder;
}
.container {
display: block;
      padding: 25px 30px 0px 30px
}


</style>
