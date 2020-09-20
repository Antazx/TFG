<template>
  <v-app>
    <Navigation v-if="isUserLogged"></Navigation>
    <v-main>
      <Alert />
      <Login v-if="!isUserLogged"></Login>
      <keep-alive v-if="isStateReady" include="PrinterList">
        <router-view></router-view>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navigation from "./components/Navigation";
import Alert from "./components/Alert";
import Login from "./views/Login";

export default {
  name: "App",

  components: { Navigation, Alert, Login },
  data: () => ({}),
  created() {},

  computed: {
    ...mapState({
      printersLoading: (state) => state.printers.loading,
      reservationsLoading: (state) => state.reservations.loading,
      configLoading: (state) => state.configuration.loading,
      updatesLoading: (state) => state.updates.loading,
    }),
    ...mapState("account", ["status"]),
    ...mapState("printers", ["printerList"]),
    ...mapState("configuration", ["config"]),
    ...mapState("reservations", ["reservationList"]),
    ...mapState("updates", ["updatesList"]),

    isStateReady() {
      return (
        this.isConfigReady &&
        this.isPrintersReady &&
        this.isReservationsReady &&
        this.isUpdatesReady
      );
    },

    isConfigReady() {
      if (this.config !== null) return true;
      if (!this.configLoading && this.isUserLogged) this.getConfig();
      return false;
    },

    isPrintersReady() {
      if (this.printerList !== null) return true;
      if (!this.printersLoading && this.isUserLogged) {
        this.getAllUpdates();
        this.getPrinters(false);
      }
      return false;
    },

    isReservationsReady() {
      if (this.reservationList !== null) return true;
      if (!this.reservationsLoading && this.isUserLogged)
        this.getReservations();
      return false;
    },

    isUpdatesReady() {
      if (this.updatesList !== null) return true;
      if (!this.updatesLoading && this.isUserLogged) this.getAllUpdates();
      return false;
    },

    isUserLogged() {
      return this.status.loggedIn ? true : false;
    },
  },

  methods: {
    ...mapActions("printers", ["getPrinters"]),
    ...mapActions("reservations", ["getReservations"]),
    ...mapActions("configuration", ["getConfig"]),
    ...mapActions("updates", ["getAllUpdates"]),
  },
};
</script>
<style scoped>
.theme--light.v-application {
  background-color: #efefef;
}
</style>
