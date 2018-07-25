// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBolkaL1PPMo7Fzt0OYXkI9DJeYPp-opTw",
  authDomain: "vue-chat-893c8.firebaseapp.com",
  databaseURL: "https://vue-chat-893c8.firebaseio.com",
  projectId: "vue-chat-893c8",
  storageBucket: "vue-chat-893c8.appspot.com",
  messagingSenderId: "242281532809"
};
firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
