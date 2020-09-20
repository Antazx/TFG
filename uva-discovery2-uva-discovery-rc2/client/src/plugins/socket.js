import Vue from 'vue';
import store from '../store/index';
import VueSocketIO from 'vue-socket.io';

export default Vue.use(
  new VueSocketIO({
    debug: false,
    connection: 'http://localhost:3000',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  })
);
