<template>
  <v-container class="mt-8">
    <v-row class="pa-0 mx-auto scx">
      <v-col class="pa-0" col sm="12" md="6" lg="6">
        <chess-board @pgn="($evt) => handleMove($evt)" :pgn="nPgn" />
        <p class="mt-4">
          Room Name: {{$route.query.room}}
        </p>
      </v-col>
      <v-col class="pa-0 smdxc" col sm="12" md="6" lg="6">
        <chat :messages="messages" :notation="pgn" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChessBoard from "@/components/common/ChessBoard.vue";
import Chat from "@/components/common/Chat.vue";
const twilioChat = require("twilio-chat");
export default {
  components: {
    ChessBoard,
    Chat
  },
  data: () => ({
    pgn: "",
    messages: [],
    nPgn: ""
  }),
  methods: {
    handleMove(event) {
      this.pgn = event;
      if(event !== '') {
        this.$CyberChess.channel.sendMessage(
          JSON.stringify({ type: "game", message: event })
        );
      }
    }
  },
  async created() {
    try {
      console.log(this.$CyberChess.getChatClient());
      // If there is no chat client create a new one.
      if (this.$CyberChess.getChatClient() === null) {
        const user = await this.$Amplify.Auth.currentSession();
        const token = await this.$Amplify.API.post(
          "CyberChessApi",
          "/rooms/token",
          {
            body: {
              identity: user.idToken.payload.sub,
              deviceId: "browser"
            }
          }
        );
        const client = await twilioChat.Client.create(token.token, {
          logLevel: "info"
        });
        this.$CyberChess.setChatClient(client);
        this.$CyberChess.getChatClient().on("channelJoined", channel => {
          if (channel) this.$CyberChess.channel = channel;
          this.$CyberChess.channel.on("messageAdded", message => {
            if(JSON.stringify(message.body).type === 'text') {
            this.messages.push({
              author: message.author,
              body: message.body,
              timestamp: message.timestamp
            });
            } else if(JSON.stringify(message.body).type === 'game') {
              this.nPgn = JSON.stringify(message.body.message);
            }
          });
        });
      } else {
        // There is already a chat client to check if its token is expired.
        this.$CyberChess.getChatClient().on("tokenExpired", async () => {
          // refresh token logic
          const user = await this.$Amplify.Auth.currentSession();
          const token = await this.$Amplify.API.post(
            "CyberChessApi",
            "/rooms/token",
            {
              body: {
                identity: user.idToken.payload.sub,
                deviceId: "browser"
              }
            }
          );
          this.$store.dispatch("auth/TWILIO_TOKEN", token);
          this.$CyberChess.getChatClient().updateToken(token.token);
        });
        this.$CyberChess.getChatClient().on("channelJoined", channel => {
          if (channel) this.$CyberChess.channel = channel;
          this.$CyberChess.channel.on("messageAdded", message => {
            if(JSON.stringify(message.body).type === 'text') {
            this.messages.push({
              author: message.author,
              body: message.body,
              timestamp: message.timestamp
            });
            } else if(JSON.stringify(message.body).type === 'game') {
              this.nPgn = JSON.stringify(message.body).message;
            }
          });
        });
        console.log(this.$CyberChess.channel);
      }
      let flag = false;
      const c = this.$CyberChess.getChatClient();
      let pag = await c.getUserChannelDescriptors();
      for (let i = 0; i < pag.items.length; i++) {
        let channel = pag.items[i];
        if (channel.friendlyName === this.$route.query.room) {
          console.log("Channel already exists, joining the channel instead");
          flag = true;
          const c = await channel.getChannel();
          this.$CyberChess.channel = c;
          this.$CyberChess.channel.join();
          const resp = await this.$CyberChess.channel.getMessages();
          let game = [];
          let mg = resp.items.filter(msg => {
            if(JSON.parse(msg.body).type === 'text') {
              return msg;
            }
            if(JSON.parse(msg.body).type === 'game') {
              console.log(msg.body)
              game.push(JSON.parse(msg.body).message);
            }
          })
          this.messages = mg
          this.nPgn = game[game.length-1];
          break;
        }
      }
      if (!flag) {
        this.$CyberChess
          .getChatClient()
          .createChannel({
            friendlyName: this.$route.query.room
          })
          .then(channel => {
            channel.join();
            this.$CyberChess.channel = channel;
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.smdxc {
  margin-top: 2rem;
  @media only screen and (min-width: 1200px) {
    margin-top: 0;
  }
}
.scx {
  height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;
  @media only screen and (min-width: 1200px) {
    height: 65vh;
  }
}
</style>