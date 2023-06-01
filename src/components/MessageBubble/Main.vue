<template lang="pug">
.qkb-msg-bubble(:class="bubbleClass")
  .qkb-msg-avatar(v-if="message.agent === 'bot'")
    .qkb-msg-avatar__img &nbsp;
  component(
    v-if="componentType",
    :is="componentType",
    :main-data="message"
  )
  .qkb-msg-bubble__time(v-if="message.createdAt")
    | {{ message.createdAt }}
</template>
<script>
import SingleText from './SingleText'
import ButtonOptions from './ButtonOptions'
import MarkdownText from './MarkdownText'
import Rate from './Rate.vue'

export default {
  components: {
    SingleText,
    ButtonOptions,
    MarkdownText,
    Rate
  },

  props: {
    message: {
      type: Object
    }
  },

  computed: {
    bubbleClass () {
      return this.message.agent === 'bot'
        ? 'qkb-msg-bubble--bot'
        : 'qkb-msg-bubble--user'
    },

    // Define the message type and return the specific component
    componentType () {
      let type = ''

      switch (this.message.type) {
        case 'button':
          type = 'ButtonOptions'
          break
        case 'markdown':
          type = 'MarkdownText'
          break
        case 'rate':
          type = 'Rate'
          break
        default:
          type = 'SingleText'
      }

      return type
    }
  }
}
</script>
