<template>
<div class="pagination">
  <div
      class="pagination__button pagination__button--without-border"
      @click="setPreviousPage"
  >
    <span class="icon pagination--to-first"/>
  </div>
  <div
      class="pagination__button"
      :class="{'pagination__button--selected': currentPage === button}"
      v-for="(button, index) in paginationButtons"
      :key="index"
      @click="setPagination(button)"
  > {{ button }} </div>
  <div
      class="pagination__button pagination__button--without-border"
      @click="setNextPage"
  >
    <span class="icon pagination--to-last"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 5,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    paginationButtons() {
      const pageQuantity = Math.ceil(this.total / this.perPage)
      return Array.from({length: pageQuantity}, (_, i) => i + 1)
    },
  },
  methods: {
    setPagination(pageNumber) {
      this.$emit('pageChange', pageNumber)
    },
    setNextPage() {
      if (this.currentPage !== this.paginationButtons[this.paginationButtons.length - 1]) {
        const pageNumber = this.currentPage + 1
        this.$emit('pageChange', pageNumber)
      }
    },
    setPreviousPage() {
      if (this.currentPage !== 1) {
        const pageNumber = this.currentPage - 1
        this.$emit('pageChange', pageNumber)
      }
    },
  },
};
</script>
