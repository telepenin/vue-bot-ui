<template lang="html">
<div class="qkb-msg-bubble-component qkb-msg-bubble-component--single-text">
  <div class="qkb-msg-bubble-component__text">
    {{ text }}
    <star-rating :star-size="40" :increment="0.5" :show-rating="false" @rating-selected="setRating"></star-rating>
  </div>
</div>
</template>
<script>
import StarRating from 'vue-star-rating'
import EventBus from '../../helpers/event-bus'

export default {
  components: {
    StarRating
  },
  props: {
    mainData: {
      type: Object
    }
  },
  data () {
    return {
      textAfterSelecting: '',
      text: 'Please rate the quality of the answer; my answers will improve thanks to that'
    }
  },
  methods: {
    setRating (rating) {
      EventBus.$emit('send-message-to-server', {
        'type': 'rate',
        'rating': rating,
        'id': this.mainData.id
      })
    }
  }
}
</script>
