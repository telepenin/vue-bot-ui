<template lang="pug">
#app
  VueBotUI(
    v-if="isConnected"
    :messages="messages"
    :options="botOptions"
    :bot-typing="waitResponse"
    :input-disable="waitResponse"
    @msg-send="messageSendHandler"
  )
</template>
<script>
import BotIcon from './assets/icons/bot.png'
import { VueBotUI } from './vue-bot-ui'
import EventBus from './helpers/event-bus'

export default {
  components: {
    BotIcon,
    VueBotUI
  },

  data () {
    return {
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
      }
    }
  },

  methods: {
    messageSendHandler (message) {
      this.messages.push({
        agent: 'user',
        type: 'text',
        text: message.text
      })

      this.connection.send(JSON.stringify({
        'type': 'question',
        'text': message.text
      }))
      this.waitResponse = true
    },
    messageToServer (message) {
      this.connection.send(JSON.stringify(message))
    }
  },
  created () {
    console.log('Starting connection to WebSocket Server')
    this.connection = new WebSocket('ws://localhost:8765')

    this.connection.onmessage = (response) => {
      const event = JSON.parse(response.data)
      console.log(event)
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

    this.connection.onopen = (event) => {
      console.log('Successfully connected to the echo websocket server...')
      this.isConnected = true
    }
    EventBus.$on('send-message-to-server', this.messageToServer)
  }
}

</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
