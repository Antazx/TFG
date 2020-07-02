<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="newPrinter" color="primary" v-on="on">
          New Printer
        </v-btn>
        <v-icon v-if="!newPrinter" v-on="on" color="primary" class="mr-2">
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
          <v-form ref="form" id="new-printer-form">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Hostname*"
                  :rules="hostnameRules"
                  v-model="printer.hostname"
                  required
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="IP*"
                  :rules="ipRules"
                  v-model="printer.ip"
                  required
                  dense
                  append-outer-icon="mdi-open-in-new"
                  @click:append-outer="openIP(printer.ip)"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  label="Modelname*"
                  :rules="modelnameRules"
                  v-model="printer.modelname"
                  required
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row v-if="!newPrinter">
              <v-col cols="6">
                <v-select
                  :items="statusItems"
                  v-model="printer.information.status"
                  label="Status"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="printerTypes"
                  v-model="printer.information.printertype"
                  label="Printer Type"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Part Number"
                  v-model="printer.information.partnumber"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="FW Version"
                  v-model="printer.information.firmwareversion"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Alias"
                  v-model="printer.metadata.alias"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Location"
                  v-model="printer.metadata.location"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Workteam"
                  v-model="printer.metadata.workteam"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  auto-grow
                  filled
                  label="Notes"
                  v-model="printer.metadata.notes"
                >
                </v-textarea>
              </v-col>
            </v-row>

            <v-row
              v-if="
                !newPrinter &&
                  printer.information.alerts &&
                  printer.information.alerts.length !== 0
              "
            >
              <v-col>
                <v-chip-group column>
                  <v-chip
                    text-color="black"
                    color="warning"
                    v-for="alert in printer.information.alerts"
                    :key="alert"
                  >
                    {{ alert }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <v-row v-if="!newPrinter">
              <v-col cols="6">
                <v-text-field
                  disabled
                  label="Created"
                  :value="printer.created | moment('from', 'now')"
                  :hint="printer.created | moment('D MMMM YYYY, h:mm:ss')"
                  persistent-hint
                  dense
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  disabled
                  label="Updated"
                  :value="printer.updated | moment('from', 'now')"
                  :hint="printer.updated | moment('D MMMM YYYY, h:mm:ss')"
                  persistent-hint
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="!newPrinter && printer.log.length !== 0">
              <v-col cols="6">
                <v-select
                  :items="getLogs"
                  label="Logs"
                  v-model="selectedLog"
                  dense
                >
                  <template v-slot:item="{ item }">
                    {{ item.text | moment("D MMMM YYYY, h:mm:ss") }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-btn
                  @click="handleDownloadLog(selectedLog)"
                  block
                  class="mt-3"
                  :disabled="selectedLog === ''"
                  color="success"
                >
                  Download Log
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="ml-4 mb-5" dark outlined @click="close">
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!newPrinter"
            :disabled="this.loading"
            :loading="this.loading"
            color="success"
            class="mb-5"
            @click="handleGetLog"
          >
            Get new Log
          </v-btn>

          <v-btn
            v-if="!newPrinter"
            :disabled="this.loading"
            :loading="this.loading"
            color="success"
            class="mb-5"
            @click="handleGetInfo"
          >
            Get Info
          </v-btn>
          <v-btn
            v-if="newPrinter"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mr-4 mb-5"
            dark
            @click="handleCreate"
          >
            Create printer
          </v-btn>
          <v-btn
            v-if="!newPrinter"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mr-4 mb-5"
            dark
            @click="handleUpdate"
          >
            Update printer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PrinterComponent",
  props: {
    currentPrinter: Object
  },

  created() {
    if (Object.keys(this.$props.currentPrinter).length === 0) {
      this.newPrinter = true;
    } else {
      this.printer = Object.assign(this.$props.currentPrinter);
    }
  },

  data: () => ({
    dialog: false,
    newPrinter: false,
    updated: "",
    created: "",
    selectedLog: "",
    printer: {
      hostname: "",
      ip: "",
      modelname: "",
      fromdiscovery: true,
      metadata: {
        alias: "",
        location: "",
        workteam: "",
        notes: ""
      },
      information: {
        status: "",
        firmwareversion: "",
        partnumber: "",
        printertype: ""
      }
    },

    statusItems: [
      "Online",
      "Awake",
      "Sleep",
      "Unreachable",
      "Turn off",
      "With alerts",
      "Busy with activities",
      "With system errors",
      "Not initialized",
      "Unknown"
    ],

    printerTypes: [
      "Printer LP1",
      "Printer LP2",
      "Printer PP1",
      "Printer PP2",
      "Virtual",
      "Docker",
      "PC-Target"
    ],
    hostnameRules: [v => !!v || "Hostname is required"],
    ipRules: [
      v => !!v || "Password is required",
      v =>
        /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test(v) ||
        "IP must be a valid IP"
    ],
    modelnameRules: [v => !!v || "Modelname is required"]
  }),

  computed: {
    ...mapState("printers", ["loading"]),

    title() {
      return this.newPrinter ? "New Printer" : this.printer.modelname;
    },

    getLogs() {
      let selectList = [];
      this.printer.log.forEach(log => {
        selectList.push({
          value: log.filename,
          text: log.timestamp
        });
      });
      return selectList.reverse();
    }
  },
  methods: {
    ...mapActions("printers", [
      "createPrinter",
      "updatePrinter",
      "getPrinterInfo",
      "getPrinterLog",
      "getNewPrinterInfo",
      "downloadPrinterLog"
    ]),

    close() {
      this.dialog = false;
      if (this.newPrinter) this.$refs.form.reset();
    },

    openIP(ip) {
      if(this.newPrinter) return;
      window.open(`http://${ip}`, "_blank");
    },

    handleUpdate() {
      if (!this.$refs.form.validate()) return;
      this.dialog = false;
      this.updatePrinter(this.printer);
    },

    handleCreate() {
      if (!this.$refs.form.validate()) return;
      this.dialog = false;
      this.createPrinter(this.printer);
      this.$refs.form.reset();
    },

    handleGetInfo() {
      if (!this.$refs.form.validate()) return;
      this.getPrinterInfo(this.printer);
    },

    handleGetLog() {
      this.getPrinterLog(this.printer);
    },

    handleDownloadLog() {
      const index = this.printer.log.findIndex(
        l => l.filename === this.selectedLog
      );
      this.downloadPrinterLog(this.printer.log[index]);
    }
  }
};
</script>
