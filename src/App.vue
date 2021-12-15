<template>
  <div id="app">
    <div class="header">
      <div class="header__title">
        Permissions
      </div>
      <div class="header__navbar">
        <router-link
          class="header__navbar__link"
          active-class="header__navbar__link--active"
          to="/roles-groups">
          Groups
        </router-link>
        <router-link
          class="header__navbar__link"
          active-class="header__navbar__link--active"
          to="/roles">Roles</router-link>
      </div>
    </div>
    <div class="main">
      <router-view />
    </div>
    <div class="background"/>
  </div>
</template>
