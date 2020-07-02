<template>
  <v-app>
    <Navigation v-if="status.loggedIn === true"></Navigation>
    <v-main>
      <Alert />
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navigation from "./components/Navigation";
import Alert from "./components/Alert";

export default {
  name: "App",

  components: { Navigation, Alert },

  data: () => ({}),

  computed: {
    ...mapState("account", ["status"])
  }
};
</script>
