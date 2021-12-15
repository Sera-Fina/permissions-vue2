<template>
  <div v-if="visible" class="modal-wrapper">
    <div class="modal-wrapper__modal modal">
      <div class="modal__header">
        <span class="modal__header__title">
          {{ title }}
        </span>
        <div class="modal__header__close" @click="$emit('close')"> &#10005; </div>
      </div>
      <div class="modal__body">
        <slot name="body"/>
      </div>
      <div class="modal__footer">
        <div class="modal__footer__buttons">
          <button
            class="modal__footer__buttons__button button"
            @click="$emit('save')"
          >
            Save
          </button>
          <button
            class="modal__footer__buttons__button button"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
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
};
</script>
