<template>
  <Modal v-if="visible" :visible="visible" :title="title" @save="save" @close="close">
    <template #body>
      <div class="form">
        <div class="form__item">
          <span class="form__item__label">Name:</span>
          <div class="form__item__controllers">
            <input class="input" v-model="form.name">
          </div>
        </div>
        <div class="form__item">
          <span class="form__item__label">Roles:</span>
          <div class="form__item__controllers">
            <List
                custom-item-class="list-wrapper__list__item--after-one"
                :items="permissions"
                :selectable="false"
                :editable="false"
                :with-checkbox="true"
                @toggleCheckbox="toggleChecked"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script>
import Modal from '@/components/Modal';
import List from '@/components/List';
import { getPermissions } from '@/modules/permissionsStorage.module';

export default {
  name: 'AddRoleModal',
  components: { List, Modal },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        name: '',
        checked: [],
      },
      permissions: [],
    };
  },
  mounted() {
    this.permissions = getPermissions().list;
  },
  methods: {
    toggleChecked(checkedItem) {
      const selected = this.permissions.find((item) => item?.id === checkedItem.id);
      if (selected) {
        const checkedIds = this.form.checked.map(checked => checked.id)
        if (checkedIds.includes(selected?.id)) {
          this.form.checked = this.form.checked.filter((item) => item.id !== selected?.id);
        } else {
          this.form.checked.push(selected);
        }
      }
    },
    clearForm() {
      this.form = {
        name: '',
        checked: [],
      };
    },
    save() {
      this.$emit('add', {
        id: new Date().getTime(),
        name: this.form.name,
        permissions: this.form.checked,
      });
      this.clearForm();
    },
    close() {
      this.clearForm();
      this.$emit('close');
    },
  },
};
</script>
