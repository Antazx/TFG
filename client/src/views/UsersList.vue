<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              placeholder="Search users"
              outlined
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn
              class="mx-2"
              fab
              dark
              medium
              color="primary"
              @click="getUsers"
            >
              <v-icon dark>mdi-reload</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headersActive"
        :items="userList"
        item-key="_id"
        :loading="loading"
        :loading-text="loadingText"
        :items-per-page="15"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.lastlogin="{ item }">
          {{ item.lastlogin | moment("from", "now") }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <UserComponent :currentUser="item" />
            </v-col>
            <v-col>
              <v-icon color="error" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import UserComponent from "../components/UserComponent";

export default {
  name: "UserList",

  components: { UserComponent },

  data: () => ({
    search: "",
    loadingText: "Loading users list ..",
    headersActive: [
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Last login", value: "lastlogin" },
      { text: "Role", value: "role" },
      { text: "Actions", value: "actions", sortable: false }
    ]
  }),

  mounted() {
    this.getUsers();
  },

  computed: {
    ...mapState("users", ["userList", "loading"]),
    ...mapState("account", ["user"])
  },

  watch: {
    selectedPrinters(newValue, oldValue) {
      this.setSelectedPrinters(newValue);
    }
  },

  methods: {
    ...mapActions("users", ["getUsers", "deleteUser"]),

    deleteItem(item) {
      if (!confirm(`Are you sure you want to delete ${item.email}`)) return;
      this.deleteUser(item);
    }
  }
};
</script>
