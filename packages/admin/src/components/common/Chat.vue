<template>
  <v-card class="fill-height" outlined>
    <v-card-text>
      <h2 class="mx-auto">Chat</h2>
      <v-card v-if="notation.length > 0" class="mt-2 message-box" outlined>
        <v-card-text class="ma-0 pa-0 pl-2">
          <h5 class="mb-0">Notation:</h5>
          <p>{{notation}}</p>
        </v-card-text>
      </v-card>
      <v-card class="mt-2 message-box" outlined flat>
        <v-card-text class="ma-0 pa-0 pl-2">
          <p
            v-for="(message, index) in messages"
            :key="index"
            :class="(message.author === currentUser)? 'me': 'them'"
            class="mb-1"
          >{{JSON.parse(message.body).message}}</p>
        </v-card-text>
      </v-card>
      <v-form>
        <v-textarea outlined class="mt-1" rows="2" v-model="message" label="Send a message"></v-textarea>
        <v-btn @click="sendMessage" block>
          Send Message
          <v-icon right>fa-paper-plane</v-icon>
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    notation: String,
    messages: Array
  },
  data: () => ({
    message: "",
    currentUser: ""
  }),
  watch:{
    messages(msg) {
      console.log(msg);
    }
  },
  methods: {
    sendMessage() {
      this.$CyberChess.channel.sendMessage(
        JSON.stringify({ type: "text", message: this.message })
      );
      this.message = "";
    }
  },
  mounted() {
  },
  async created() {
    const currentUser = await this.$Amplify.Auth.currentSession();
    this.currentUser = currentUser.idToken.payload.sub;
  }
};
</script>

<style lang="scss" scoped>
.message-box {
  height: 10rem;
  overflow-y: auto;
}
.me {
  margin-left: 5rem;
  background-color: rgb(12, 122, 122);
  box-shadow: 2px black;
  word-wrap: break-word;
  width: 10rem;
  border-radius: 10px 10px 10px 10px;
  padding: 3px;
  color: white;
  @media screen and(min-width: 375px) {
    margin-left: 5rem;
    width: 13rem;
  }
  @media screen and(min-width: 400px) {
    margin-left: 5rem;
    width: 15rem;
  }
  @media screen and(min-width: 768px) {
    margin-left: 20rem;
    width: 20rem;
  }
  @media screen and(min-width: 1024px) {
    margin-left: 7rem;
    width: 17rem;
  }

  @media screen and(min-width: 1200px) {
    margin-left: 12rem;
    width: 20rem;
  }
  @media screen and(min-width: 1700px) {
    margin-left: 20rem;
    width: 30rem;
  }
}
.them {
  background-color: rgb(255, 255, 255);
  border: 0.5px black;
  padding: 3px;
  color: black;
  border-radius: 10px 10px 10px 10px;
  word-wrap: break-word;
  width: 10rem;
    @media only screen and(min-width: 375px) {
    width: 13rem;
  }
  @media only screen and(min-width: 400px) {
    width: 15rem;
  }
  @media only screen and(min-width: 768px) {
    width: 20rem;
  }
  @media only screen and(min-width: 1024px) {
    width: 17rem;
  }
  @media only screen and(min-width: 1440px) {
    width: 20rem;
  }
  @media only screen and(max-width: 2560px) {
    width: 30rem;
  }
}
</style>