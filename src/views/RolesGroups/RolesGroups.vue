<template>
  <div class="page page--roles-groups">
    <MainLayout>
      <template #sidebar>
        <List
            add-title="Add new group"
            :items="rolesGroupsList"
            :selected="selected"
            :selectable="true"
            :creatable="true"
            @addItem="addModalVisible = true"
            @editItem="editItemHandler"
            @deleteItem="deleteGroupHandler"
            @selectItem="selectItemHandler"
            @toggleButtons="toggleListItemButtons"
        />
      </template>
      <template #title>
        <span>Roles</span>
      </template>
      <template #search>
        <input class="input" placeholder="Search" v-model="search" @input="debounceSearch">
      </template>
      <template #filter>
        <select class="select" @change="mainFilterChange">
          <option :value="filterTypes.all">all</option>
          <option :value="filterTypes.checked">checked</option>
          <option :value="filterTypes.unchecked">unchecked</option>
        </select>
      </template>
      <template #customFilter>
        <div class="custom-filter__item" v-for="permission in permissionsList">
          <input class="custom-filter__item__checkbox" type="checkbox" @change="customFilterChange(permission)">
          <span class="custom-filter__item__checkbox__title">
            {{ permission.name }}
          </span>
        </div>
      </template>
      <template #body>
        <List
            v-if="showSecondList"
            custom-item-class="list-wrapper__list__item--after-one"
            :items="rolesList"
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
    <AddGroupModal
        title="Add roles group"
        :visible="addModalVisible"
        @add="addRoleGroup"
        @close="addModalVisible = false"
    />
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import Pagination from '@/components/Pagination.vue';
import List from '@/components/List.vue';
import AddGroupModal from './modals/AddGroupModal.vue';
import debounce from 'lodash.debounce'
import {filterTypes, getPermissions, getRoles, getRolesGroups, setRolesGroups} from '@/modules/permissionsStorage.module';

export default {
  name: 'RolesGroups',
  components: {
    Pagination,
    AddGroupModal,
    MainLayout,
    List,
  },
  data() {
    return {
      filterTypes,
      addModalVisible: false,
      rolesGroupsList: [],
      permissionsList: [],
      rolesList: [],
      selected: {
        id: 0
      },
      total: 0,
      currentPage: 1,
      search: '',
      mainFilterType: filterTypes.all,
      customFilterValue: [],
    };
  },
  computed: {
    checked() {
      return this.selected?.checkedRoles || []
    },
    showSecondList() {
      return this.selected && this.selected.id && this.rolesList.length
    }
  },
  mounted() {
    this.permissionsList = getPermissions().list;
    this.updateRolesGroups();
    this.updateRoles()
  },
  methods: {
    updateRoles() {
      const res = getRoles({
        page: this.currentPage,
        mainFilter: this.mainFilterType,
        customFilters: {tags: this.customFilterValue},
        search: this.search,
        checked: this.checked
      });
      this.rolesList = res.list
      this.total = res.total
    },
    updateRolesGroups() {
      this.rolesGroupsList = getRolesGroups();
      this.selected = this.rolesGroupsList[0] || {};
    },
    editItemHandler(options) {
      const newList = this.rolesGroupsList.map(
        (item) => ({ ...item, name: item.id === options.id ? options.name : item.name })
      );
      setRolesGroups(newList);
      this.updateRolesGroups();
    },
    deleteGroupHandler(id) {
      const newList = this.rolesGroupsList.filter((group) => group?.id !== id);
      setRolesGroups(newList);
      this.updateRolesGroups();
    },
    selectItemHandler(item) {
      this.selected = item;
      this.updateRoles()
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
      this.updateRoles()
    },
    mainFilterChange(e) {
      e.preventDefault()
      this.mainFilterType = e.target.value
      this.currentPage = 1
      this.updateRoles()
    },
    customFilterChange(filterItem) {
      if (this.customFilterValue.includes(filterItem.id)) {
        this.customFilterValue = this.customFilterValue.filter(value => value !== filterItem.id)
      } else {
        this.customFilterValue.push(filterItem.id)
      }
      this.currentPage = 1
      this.updateRoles()
    },
    toggleListItemButtons(options) {
      this.rolesGroupsList = this.rolesGroupsList.map(
        (item) => {
          return {...item, buttons: item?.id === options.id ? options.buttons : ['edit', 'delete']}
        }
      );
    },
    addRoleGroup(item) {
      const newList = this.rolesGroupsList.concat([item]);
      setRolesGroups(newList);
      this.updateRolesGroups();
      this.addModalVisible = false;
    },
    debounceSearch: debounce(function (e) {
      e.preventDefault()
      this.currentPage = 1
      this.updateRoles()
    }, 1000),
    toggleListItemCheckbox(checkedItem) {
      const newList = this.rolesGroupsList.map((item) => {
        if (item?.id === this.selected.id) {
          if (this.selected.checkedRoles?.includes(checkedItem.id)) {
            item.checkedRoles = item?.checkedRoles.filter((role) => role !== checkedItem.id);
          } else {
            item.checkedRoles.push(checkedItem.id);
          }
        }
        return item;
      });
      setRolesGroups(newList);
      this.rolesGroupsList = getRolesGroups();
    },
  },
};
</script>
