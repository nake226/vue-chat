<template>
  <div id="app">
    <!-- header -->
    <header class="header">
      <h1>Vue Chat</h1>
      <div v-if="user.uid" key="login">
        [{{ user.displayName }}]
        <button type="button" @click="logout">ログアウト</button>
      </div>
      <div v-else key="logout">
        <button type="button" @click="login">ログイン</button>
      </div>
    </header>
    <!-- chat -->
    <transition-group name="chat" tag="div" class="list content">
      <section v-for="{key, name, image, message} in chat" :key="key" class="item">
        <div class="item__img"><img :src="image" width="40px" height="40px"></div>
        <div class="item__detail">
          <div class="item__name">{{ name }}</div>
          <div class="item__message">
            <nl2br tag="div" :text="message"/>
          </div>
        </div>
        <div class="item__delete" @click="deleteTweets">削除</div>
      </section>
    </transition-group>
    <!-- form -->
    <form action="" @submit.prevent="send" class="form">
      <textarea v-model="input" :disabled="!user.uid" @keydown.enter.exact.prevent="send"></textarea>
      <button type="submit" :disabled="!user.uid" class="button button--send">Send</button>
    </form>
  </div>
</template>

<script>
// firebase
import firebase from 'firebase'
// 改行 -> <br>
import nl2br from 'vue-nl2br'
export default {
  name: 'App',
  components: {nl2br},
  data() {
    return {
      // ユーザ
      user: {},
      // メッセージが入る配列
      chat: [],
      // 入力したメッセージ
      input: ''
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      const ref_message = firebase.database().ref('message')
      if (user) {
        this.chat = []
        // firebaseのmessageに変更があった際のハンドルを登録
        ref_message.limitToLast(10).on('child_added', this.childAdded)
      } else {
        // firebaseのmessageに変更があった際のハンドルを解除
        ref_message.limitToLast(10).off('child_added', this.childAdded)
      }
    })
  },
  methods: {
    // ログイン
    login() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    // ログアウト
    logout() {
      firebase.auth().signOut()
    },
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // チャットの再描画
    childAdded(snap) {
      const message = snap.val()
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.scrollBottom()
    },
    send() {
      if (this.user.uid && this.input.length) {
        // firebaseにmessageの内容を送信する
        firebase.database().ref('message').push({
          message: this.input,
          name: this.user.displayName,
          image: this.user.photoURL
        }, () => {
          // フォームを空にする
          this.input = ''
        })
      }
    },
    deleteTweets() {
      this.chat.pop();
    }
  }
}
</script>

<style lang="scss" scoped>

* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #3ab383;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
  button {
    padding: 3px 10px;
    background: #fff;
    border: none;
    border-radius: 30px;
    color: #3ab383;
    font-weight: bold;
  }
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 4em;
  width: calc(100% - 6em);
  resize: none;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
  &__image {
    img {
      border-radius: 20px;
      vertical-align: top;
    }
  }
  &__detail {
    margin: 0 0 0 1.4em;
  }
  &__name {
    font-size: 75%;
  }
  &__message {
    position: relative;
    display: inline-block;
    padding: 0.8em;
    background: #deefe8;
    border-radius: 4px;
    line-height: 1.2em; 
    &::before {
      position: absolute;
      content: " ";
      display: block;
      left: -16px;
      bottom: 12px;
      border: 4px solid transparent;
      border-right: 12px solid #deefe8;
    }
  }
}
.button {
  &--send {
    height: 4em;
    background: #aaa;
    color: #fff;
  }
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}
</style>
