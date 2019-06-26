<template>
  <div class="ui large breadcrumb">
    <template v-for="(anItem, index) of filtered">
      <span v-if="index < filtered.length - 1" :key="index">
        <router-link :to="anItem.to" class="section" v-text="anItem.txt" />
        <i v-if="index < filtered.length - 2" class="right angle icon divider" />
      </span>
      <span v-else :key="index">
        <i class="right arrow icon divider" />
        <div class="active section" v-text="anItem" />
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      validator: v => v.filter(x => x).every((x, i, arr) => {
        if (i < arr.length - 1) return typeof x === 'object' && x.txt && x.to
        return typeof x === 'string'
      })
    }
  },
  computed: {
    filtered() {
      return this.items.filter(x => x)
    }
  }
}
</script>
