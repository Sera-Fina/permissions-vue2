<template>
  <div class="page">
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
      <template #sort>
        <select class="select">
          <option>checked</option>
          <option>unchecked</option>
          <option>tags</option>
        </select>
      </template>
      <template #body>
        <List
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
            :per-page="5"
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
import {filterTypes, getRoles, getRolesGroups, setRolesGroups} from '@/modules/permissions';

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
      addModalVisible: false,
      rolesGroupsList: [],
      rolesList: [],
      selected: {
        id: 0
      },
      total: 0,
      currentPage: 1,
      search: '',
      filter: { type: filterTypes.all },
    };
  },
  computed: {
    checked() {
      return this.selected?.checkedRoles || []
    }
  },
  mounted() {
    this.updateRolesGroups();
    this.updateRoles()
  },
  methods: {
    updateRoles() {
      const res = getRoles(this.currentPage, this.filter, this.search, this.checked);
      this.rolesList = res.list
      this.total = res.total
    },
    updateRolesGroups() {
      this.rolesGroupsList = getRolesGroups();
      this.selected = this.rolesGroupsList[0];
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
    filterChange() {
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
    debounceSearch() {
      this.updateRoles()
    },
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
