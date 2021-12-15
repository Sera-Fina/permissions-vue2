<template>
  <div class="list-wrapper">
    <ul
        v-if="items.length"
        class="list-wrapper__list">
      <li
          v-for="listItem in items"
          :key="listItem.id"
          :class="[
            {'list-wrapper__list__item--selected': selected.id === listItem.id}
            , customItemClass]"
          class="list-wrapper__list__item"
          @click="setSelected(listItem)"
      >
        <span class="list-wrapper__list__item__title">
          <input
              v-if="withCheckbox"
              class="list-wrapper__list__item__title__checkbox checkbox"
              type="checkbox"
              :checked="checked.includes(listItem.id)"
              @change="checkboxHandler(listItem)"
          >
          <span
              v-if="!listItem.buttons || !listItem.buttons.includes('save')"
              class="list-wrapper__list__item__title__text"
          >
            {{ listItem.name }}
          </span>
          <span
              v-if="withCheckbox && listItem.tags"
              class="list-wrapper__list__item__title__tags"
          >
            {{ listItem.tags.join(', ') }}
          </span>
          <input
              v-if="listItem.buttons && listItem.buttons.includes('save')"
              class="input input--small"
              v-model="name"
          />
        </span>
        <div v-if="editable" class="list-wrapper__list__item__buttons">
          <div
            class="list-wrapper__list__item__button"
            v-for="(button, index) in buttons"
            :key="index"
          >
            <button
                class="button only-icon"
                v-if="listItem.buttons && listItem.buttons.includes(button.type)"
                @click="actionButtonHandler(button.type, listItem)"
            >
              <span v-if="button.icon"  class="icon" :class="button.icon"></span>
              <span class="title"> {{ button.title }} </span>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <span v-else> Нет данных </span>
    <div class="list-wrapper__buttons" v-if="creatable">
      <button  class="button list-wrapper__buttons__item" @click="$emit('addItem')">
        <span class="icon add"/>
        <span class="title"> {{ addTitle }} </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    customItemClass: {
      type: String,
      default: '',
    },
    creatable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Object,
      default: () => ({
        id: 0
      }),
    },
    withCheckbox: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Array,
      default: () => [],
    },
    addTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '',
      buttons: [
        {title: '', icon: 'edit', type: 'edit'},
        {title: '', icon: 'save', type: 'save'},
        {title: '', icon: 'cancel', type: 'cancel'},
        {title: '', icon: 'delete', type: 'delete'},
      ],
      showList: false,
    };
  },
  watch: {
    selected(value) {
      if (value) {
        this.name = value.name;
      }
    },
  },
  methods: {
    setSelected(item) {
      this.$emit('selectItem', item)
    },
    checkboxHandler(item) {
      this.$emit('toggleCheckbox', item)
    },
    actionButtonHandler(type, item) {
      switch (type) {
        case 'edit' :
          this.$emit('toggleButtons', { buttons: ['save', 'cancel'], id: item.id })
          break
        case 'save' :
          this.$emit('editItem', {id: item.id, name: this.name})
          this.$emit('toggleButtons', { buttons: ['edit', 'delete'], id: item.id })
          break
        case 'cancel' :
          this.$emit('toggleButtons', { buttons: ['edit', 'delete'], id: item.id })
          break
        case 'delete' :
          this.$emit('deleteItem', item.id)
          break
        default :
          return
      }
    },
  },
};
</script>
