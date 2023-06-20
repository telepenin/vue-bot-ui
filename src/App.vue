<template lang="pug">
#app
  VueBotUI(
    v-if="isConnected"
    :messages="messages"
    :options="botOptions"
    :bot-typing="waitResponse"
    :input-disable="waitResponse"
    @msg-send="messageSendHandler"
    @msg-to-server="messageToServer"
  )
    template(#header)
      .qkb-board-header__title {{ botOptions.botTitle }}

      .qkb-board-header__select_field
        multiselect(
          v-model="tags" 
          :options="options"
          :multiple="true"
          :close-on-select="true"
          :limit="3"
          label="name"
          track-by="value"
          placeholder="Select section"
        )

</template>
<script>
import Multiselect from 'vue-multiselect'

import BotIcon from './assets/icons/bot.png'
import { VueBotUI } from './vue-bot-ui'

export default {
  components: {
    BotIcon,
    VueBotUI,
    Multiselect
  },

  data () {
    return {
      docName: 'cloudlinux-documentation',
      messages: [],
      messageData: [],
      isConnected: false,
      waitResponse: false,
      botOptions: {
        botAvatarImg: BotIcon,
        botTitle: 'Chat',
        colorScheme: '#43a069',
        boardContentBg: '#f4f4f4',
        msgBubbleBgBot: '#fff',
        msgBubbleBgUser: '#43a069'
      },
      tags: null,
      options: [{
        name: 'CloudLinux OS Shared',
        value:  ['level-0', 'shared']
      },{
        name: 'CloudLinux OS Shared Pro',
        value: ['level-0', 'shared-pro']
      },{
        name: 'AccelerateWP',
        value: ['level-1', 'accelerate-wp']
      },{
        name: 'CLN',
        value: ['level-0', 'cln']
      },{
        name: 'CloudLinux Solo',
        value: ['level-0', 'solo']
      },{
        name: 'CloudLinux OS Admin',
        value: ['level-0', 'admin']
      },{
        name: 'CloudLinux Subsystem For Ubuntu',
        value: ['level-0', 'ubuntu']
      },{
        name: 'End-user Documents',
        value: ['level-0', 'user-docs']
      }]
    }
  },

  methods: {
    messageSendHandler (message) {
      this.messages.push({
        agent: 'user',
        type: 'text',
        text: message.text
      })

      
      const tags = this.tags.map((item) => { return item['value'] })
      if (tags.length === this.options.length ) {
        tags = [] // if all tags was selected let's search without tags for whole index
      }

      
      this.connection.send(JSON.stringify({
        'type': 'question',
        'text': message.text,
        'doc-name': this.docName,
        'tags': tags,
      }))
      this.waitResponse = true
    },
    messageToServer (message) {
      this.connection.send(JSON.stringify({...{'doc-name': this.docName}, ...message}))
    }
  },
  created () {
    console.log('Starting connection to WebSocket Server')
    this.connection = new WebSocket('ws://localhost:8765')

    this.connection.onmessage = (response) => {
      const event = JSON.parse(response.data)
      this.messages.push({
        agent: 'bot',
        type: 'markdown',
        text: event.text
      })
      this.waitResponse = false

      setTimeout(() => {
        this.messages.push({
          agent: 'bot',
          type: 'rate',
          id: event.id
        })
      }, 1000)
    }

    this.connection.onclose = (event) => {
      console.log('Connection closed')
      this.isConnected = false
    }

    this.connection.onopen = (event) => {
      console.log('Successfully connected to the echo websocket server')
      this.isConnected = true
    }
  }
}

</script>
<style lang="scss">
@import "vue-multiselect/dist/vue-multiselect.css";

.multiselect__spinner::before,
.multiselect__spinner::after,
.multiselect__option--highlight::after,
.multiselect__option--highlight,
.multiselect__tag {
  background: #43a069
}

.qkb-board-header__select_field {
  min-width: 300px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


</style>
