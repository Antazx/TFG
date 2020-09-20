<template>
  <v-container fill-height>
    <v-row class="d-flex justify-center">
      <v-col cols="6">
        <v-card height="80vh" class="scroll">
          <v-card-title>
            <v-spacer></v-spacer>
            <span class="headline">Server</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-form ref="serverForm">
              <v-spacer></v-spacer>
              <span class="headline">Discovery</span>
              <v-spacer></v-spacer>

              <v-row>
                <v-col>
                  <v-text-field
                    label="Update Frecuency (ms)"
                    v-model="currentConfig.server.discovery.updateFrecuency"
                    :rules="updateFrecuencyRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Delete Timeout (days)"
                    :rules="deleteTimeoutRules"
                    v-model="currentConfig.server.discovery.printerExpires"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Max Printers logs"
                    v-model="currentConfig.server.discovery.maxPrinterLogs"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-spacer></v-spacer>
              <span class="headline">LDAP</span>
              <v-spacer></v-spacer>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="currentConfig.server.ldap.url"
                    :rules="ldapRules"
                    label="URL"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="currentConfig.server.ldap.adminUsername"
                    label="Admin Username"
                    :rules="ldapRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="currentConfig.server.ldap.adminPassword"
                    label="Admin Password"
                    :rules="ldapRules"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="80vh" class="scroll">
          <v-card-title>
            <v-spacer></v-spacer>
            <span class="headline">Client</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-form ref="clientForm">
              <v-spacer></v-spacer>
              <span class="headline">Reservation colors</span>
              <v-spacer></v-spacer>
              <v-row>
                <v-col>
                  <v-chip-group column>
                    <v-chip
                      v-for="color in currentConfig.client.colors"
                      :key="color"
                      :color="color"
                      close
                      @click:close="removeColor(color)"
                    >{{color}}</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field label="Add new color" v-model="newColor"></v-text-field>
                  <a
                    href="https://vuetifyjs.com/en/styles/colors/"
                    target="_blank"
                  >Click here to see available colors</a>
                </v-col>
                <v-col cols="3">
                  <v-btn color="primary" @click="addColor">Add</v-btn>
                </v-col>
              </v-row>

              <v-spacer></v-spacer>
              <span class="headline">Printer status</span>
              <v-spacer></v-spacer>
              <v-row>
                <v-col>
                  <v-chip-group column>
                    <v-chip
                      v-for="status in currentConfig.client.status"
                      :key="status.text"
                      :color="status.color"
                      close
                      @click:close="removeStatus(status)"
                    >{{status.text}}</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field label="Status" v-model="newStatus" :rules="statusRules"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field label="Color" v-model="newStatusColor" :rules="statusRules"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn color="primary" @click="addStatus">Add</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Alert timeout (ms)"
                    v-model="currentConfig.client.alertTimeout"
                    :rules="alertTimeoutRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Default reservation hours(h)"
                    v-model="currentConfig.client.defaultHours"
                    :rules="defaultHoursRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Calendar start hour (24h)"
                    v-model="currentConfig.client.calendarStartHour"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Calendar end hour (24h)"
                    v-model="currentConfig.client.calendarEndHour"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-btn block color="primary" @click="handleupdate">Update Configuration</v-btn>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Configuration",

  data: () => ({
    newColor: "",
    newStatus: "",
    newStatusColor: "",
    newType: "",
    newAlertTimeout: "",
    currentConfig: {
      server: {
        discovery: {
          updateFrecuency: "",
          printerExpires: "",
          maxPrinterLogs: "",
        },
        ldap: {
          url: "",
          adminUsername: "",
          adminPassword: "",
        },
      },
      client: {
        colors: [],
        status: [],
        alertTimeout: "",
        defaultHours: "",
        calendarStartHour: "",
        calendarEndHour: "",
      },
    },
    updateFrecuencyRules: [
      (v) => !!v || "Update frecuency is required",
      (v) => 30000 <= v || "Update frecuency must be greater than 30.000ms",
    ],
    deleteTimeoutRules: [
      (v) => !!v || "Delete timeout is required",
      (v) => 1 <= v || "Delete timeout must be greater than 1 day",
    ],
    alertTimeoutRules: [
      (v) => !!v || "Timeout is required",
      (v) => 1000 <= v || "Timeout must be greater than 1000ms",
    ],
    defaultHoursRules: [
      (v) => !!v || "Default hours required",
      (v) => 1 <= v || "It must be greater than 1h",
      (v) => 5 >= v || "It must be less than 5h",
    ],
    ipRules: [
      (v) => !!v || "Password is required",
      (v) =>
        /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test(v) ||
        "IP must be a valid IP",
    ],
    ldapRules: [(v) => !!v || "Field is required"],
  }),

  mounted() {
    this.currentConfig = { ...this.config };
  },

  computed: { ...mapState("configuration", ["config", "loading"]) },
  methods: {
    ...mapActions("configuration", ["getConfig", "updateConfig"]),
    addColor() {
      if (this.newColor === "") return;
      this.currentConfig.client.colors.push(this.newColor);
    },

    removeColor(color) {
      let index = this.currentConfig.client.colors.indexOf(color);
      this.currentConfig.client.colors.splice(index, 1);
    },

    removeStatus(status) {
      let index = this.currentConfig.client.status.indexOf(status);
      this.currentConfig.client.status.splice(index, 1);
    },

    addStatus() {
      if (this.newStatus === "") return;
      this.currentConfig.client.status.push({
        text: this.newStatus,
        color: this.newStatusColor,
      });
    },

    removeType() {
      let index = this.currentConfig.client.printerTypes.indexOf(status);
      this.currentConfig.client.printerTypes.splice(index, 1);
    },

    addType() {
      if (this.newType === "") return;
      this.currentConfig.client.printerTypes.push(this.newType);
    },

    handleupdate() {
      if (!this.$refs.clientForm.validate()) return;
      if (!this.$refs.serverForm.validate()) return;
      this.updateConfig(this.currentConfig);
    },
  },
};
</script>
<style lang="css" scoped>
.scroll {
  overflow-y: auto;
}
</style>