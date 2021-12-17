<template>
  <div class="page">
    <MainLayout>
      <template #sidebar>
        <List
            add-title="Add new role"
            :items="rolesList"
            :selected="selected"
            :selectable="true"
            :creatable="true"
            @addItem="addModalVisible = true"
            @editItem="editItemHandler"
            @deleteItem="deleteRoleHandler"
            @selectItem="selectItemHandler"
            @toggleButtons="toggleListItemButtons"
        />
      </template>
      <template #title>
        <span>Permissions</span>
      </template>
      <template #search>
        <input class="input" placeholder="Search" v-model="search" @input="debounceSearch">
      </template>
      <template #filter>
        <select class="select" @change="filterChange">
          <option :value="filterTypes.all">all</option>
          <option :value="filterTypes.checked">checked</option>
          <option :value="filterTypes.unchecked">unchecked</option>
        </select>
      </template>
      <template #body>
        <List
            v-if="showSecondList"
            custom-item-class="list-wrapper__list__item--after-one"
            :items="permissionsList"
            :selectable="false"
            :editable="false"
            :with-checkbox="true"
            :checked="checked"
            @toggleCheckbox="toggleListItemCheckbox"
        />
      </template>
      <template #pagination>
        <Pagination
            :total="total"
            :per-page="10"
            :current-page="currentPage"
            @pageChange="pageChangeHandler"
        />
      </template>
    </MainLayout>
    <AddRoleModal
        title="Add role"
        :visible="addModalVisible"
        @add="addRole"
        @close="addModalVisible = false"
    />
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import List from '@/components/List.vue';
import Pagination from '@/components/Pagination.vue';
import {
  filterTypes,
  getPermissions, getRoles, getRolesGroups, setRoles, setRolesGroups,
} from '@/modules/permissionsStorage.module';
import AddRoleModal from './modals/AddRoleModal.vue';
import debounce from "lodash.debounce";

export default {
  name: 'Roles',
  components: {
    Pagination,
    MainLayout,
    AddRoleModal,
    List,
  },
  data() {
    return {
      filterTypes,
      permissionsList: [],
      rolesList: [],
      addModalVisible: false,
      selected: {
        id: 0
      },
      total: 0,
      currentPage: 1,
      search: '',
      filterType: filterTypes.all,
    };
  },
  computed: {
    checked() {
      return this.selected?.permissions?.map(item => item.id) || []
    },
    showSecondList() {
      return this.selected && this.selected.id && this.rolesList.length
    }
  },
  created() {
    this.updateRoles();
    this.updatePermissions()
  },
  methods: {
    updateRoles() {
      this.rolesList = getRoles().list;
      this.selected = this.rolesList[0] || {};
    },
    updatePermissions() {
      const res = getPermissions({
        page: this.currentPage,
        mainFilter: this.filterType,
        customFilters: {},
        search: this.search,
        checked: this.checked
      });
      this.permissionsList = res.list
      this.total = res.total;
    },
    debounceSearch: debounce(function (e) {
      e.preventDefault()
      this.currentPage = 1
      this.updatePermissions()
    }, 1000),
    filterChange(e) {
      e.preventDefault()
      this.filterType = e.target.value
      this.currentPage = 1
      this.updatePermissions()
    },
    toggleListItemButtons(options) {
      this.rolesList = this.rolesList.map(
        (item) => ({ ...item, buttons: item?.id === options.id ? options.buttons : ['edit', 'delete'] })
      );
    },
    selectItemHandler(item) {
      this.selected = item;
      this.updatePermissions()
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
      this.updatePermissions()
    },
    addRole(item) {
      const newList = this.rolesList.concat([item]);
      setRoles(newList);
      this.updateRoles();
      this.addModalVisible = false;
    },
    deleteRoleFromGroups(id) {
      const newListGroups = getRolesGroups().map(
        (roleGroup) => ({
          ...roleGroup,
          checkedRoles: roleGroup.checkedRoles.filter((checkedId) => checkedId !== id),
        })
      );
      setRolesGroups(newListGroups);
    },
    deleteRoleHandler(id) {
      const newList = this.rolesList.filter((group) => group?.id !== id);
      setRoles(newList);
      this.deleteRoleFromGroups(id);
      this.updateRoles();
    },
    editItemHandler(options) {
      const newList = this.rolesList.map(
        (item) => ({ ...item, name: item?.id === options.id ? options.name : item.name })
      );
      setRoles(newList);
      this.updateRoles();
    },
    toggleListItemCheckbox(checkedItem) {
      const newList = this.rolesList.map((item) => {
        if (item.id === this.selected.id) {
          if (this.checked?.includes(checkedItem.id)) {
            item.permissions = item.permissions.filter((permission) => permission.id !== checkedItem.id);
          } else {
            item.permissions.push(checkedItem);
          }
        }
        return item;
      });
      setRoles(newList);
      this.rolesList = getRoles().list;
    },
  },
};
</script>
