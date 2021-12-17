<template>
  <div class="main-layout">
    <div class="main-layout__sidebar">
      <slot name="sidebar"/>
    </div>
    <div class="main-layout__content">
      <div class="main-layout__content__header">
        <div class="main-layout__content__header__title">
            <slot name="title"/>
        </div>
        <div class="main-layout__content__header__search" >
          <slot name="search"/>
        </div>
        <div class="main-layout__content__header__filter">
          <slot name="filter"/>
        </div>
        <div v-if="$slots['customFilter']" class="main-layout__content__header__filter--custom">
          <slot name="customFilter"/>
        </div>
      </div>
      <div class="main-layout__content__body">
        <slot name="body" v-if="$slots['body']" />
        <span v-else class="main-layout__content__body--no-data"> Нет данных </span>
      </div>
      <div class="main-layout__content__footer">
          <slot name="pagination"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>
