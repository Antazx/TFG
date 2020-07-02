<template>
  <v-navigation-drawer
    class="primary"
    app
    dark
    permanent
    expand-on-hover
    ref="nav"
  >
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title" v-if="user && user.name">{{
            this.user.name
          }}</v-list-item-title>
          <v-list-item-subtitle v-if="user && user.email">{{
            user.email
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-list shaped>
      <v-list-item v-for="item in items" :key="item.title" :to="item.route">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list v-if="user && user.role === 'admin'" shaped>
        <v-list-item
          v-for="item in adminItems"
          :key="item.title"
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list shaped>
        <v-list-item @click="handleLogout()" color>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "../router/index";

export default {
  name: "Navigation",

  data: () => ({
    items: [
      { title: "List", icon: "mdi-view-dashboard", route: "/list" },
      { title: "Reservations", icon: "mdi-clock", route: "/reservations" },
      { title: "Calendar", icon: "mdi-calendar", route: "/calendar" },
      { title: "Location", icon: "mdi-map-marker", route: "/location" }
    ],
    adminItems: [
      { title: "Users", icon: "mdi-account-multiple", route: "/users" },
      { title: "Configuration", icon: "mdi-menu", route: "/config" }
    ],
    currentTabComponent: "List"
  }),

  mounted() {
    if (!this.user) return;
    this.getPrinters(false);
    this.getReservations();

    if (this.user.role !== "basic") this.getUsers();
    //if (this.user.role === "admin") this.getConfig();
  },

  computed: {
    ...mapState("account", ["user"])
  },

  methods: {
    ...mapActions("users", ["getUsers"]),
    ...mapActions("printers", ["getPrinters"]),
    ...mapActions("reservations", ["getReservations"]),
    ...mapActions("account", ["toLoginPage", "logout"]),

    selectTab(route) {
      if (this.$router.currentRoute.path !== route) router.push(route);
    },

    handleLogout() {
      if (!confirm("Are you sure you want to logout?")) return;
      this.toLoginPage();
      this.logout();
    }
  }
};
</script>
