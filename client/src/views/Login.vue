<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="3">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form" id="login-form">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                required
                clearable
              />

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
                clearable
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="mb-1"
              color="primary"
              block
              type="submit"
              form="login-form"
              :disabled="status.loggingIn"
              >Login</v-btn
            >
          </v-card-actions>
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            bottom
            color="primary"
          ></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Login",
  mounted() {
    this.logout();
  },
  data: () => ({
    email: "",
    password: "",
    emailRules: [
      v => !!v || "Name is required",
      v => /.+@.+\..+/.test(v) || "Login must be a valid E-mail"
    ],
    passwordRules: [v => !!v || "Password is required"],
    loading: false
  }),
  computed: {
    ...mapState("account", ["status"])
  },
  methods: {
    ...mapActions("account", ["login", "logout"]),

    handleSubmit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      const { email, password } = this;
      if (!email || !password) return;
      this.login({ email, password });
      this.loading = false;
    }
  }
};
</script>
