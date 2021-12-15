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
        <div class="main-layout__content__header__sort">
          <slot name="sort"/>
        </div>
      </div>
      <div class="main-layout__content__body">
          <slot name="body"/>
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
