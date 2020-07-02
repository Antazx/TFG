<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="newUser" class="mx-2" fab dark medium color="primary" v-on="on">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-icon v-if="!newUser" v-on="on" color="primary" class="mr-2">
          mdi-pencil
        </v-icon>
      </template>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline">{{ title }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" id="new-user-form">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Email*" :rules="fieldRules" v-model="user.email" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Password" :rules="fieldRules" v-model="user.password" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Name*" :rules="fieldRules" v-model="user.name" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Role*" :rules="fieldRules" v-model="user.role" required></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="ml-5 mb-5" dark outlined @click="close">
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="newUser"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mr-5 mb-5"
            dark
            @click="handleCreate"
          >
            Create user
          </v-btn>
          <v-btn
            v-if="!newUser"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mr-5 mb-5"
            dark
            @click="handleUpdate"
          >
            Update user
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'UserComponent',
    props: {
      currentUser: Object,
    },

    created() {
      if (Object.keys(this.$props.currentUser).length === 0) {
        this.newUser = true;
      } else {
        this.user = Object.assign(this.$props.currentUser);
      }
    },

    data: () => ({
      dialog: false,
      newUser: false,

      user: {
        name: '',
        email: '',
        lastlogin: '',
        role: '',
        password: '',
      },

      fieldRules: [(v) => !!v || 'Field is required'],
    }),

    computed: {
      ...mapState('users', ['loading']),
      title() {
        return this.newUser ? 'New User' : this.user.name;
      },
    },
    methods: {
      ...mapActions('users', ['createUser', 'updateUser']),

      close() {
        this.dialog = false;
        if (this.newUser) this.$refs.form.reset();
      },

      handleUpdate() {
        if (!this.$refs.form.validate()) return;
        this.dialog = false;
        this.updateUser(this.user);
      },

      handleCreate() {
        if (!this.$refs.form.validate()) return;
        this.dialog = false;
        this.createUser(this.user);
        this.$refs.form.reset();
      },
    },
  };
</script>
