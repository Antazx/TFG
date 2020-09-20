<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              placeholder="Search printers"
              outlined
              clearable
              dense/>
          </v-col>
          <v-col cols="5">
            <v-select
              :items="headersOptions"
              v-model="headersActive"
              label="Active headers"
              outlined
              multiple
              return-object
              small-chips
              deletable-chips
              dense/>
          </v-col>
          <v-col>
            <PrinterComponent
              v-if="this.user && this.user.role !== 'basic'"
              :newPrinter="true"
              :currentPrinter="{}"/>
          </v-col>
          <v-col>
            <v-btn dark color="primary" @click="getPrinters(false)">
              <v-icon dark>mdi-reload</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              dark
              color="primary"
              @click="selectedPrinters = []"
              :disabled="selectedPrinters.length === 0">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="getHeaders"
        :items="printerList"
        item-key="_id"
        :loading="loading"
        :loading-text="loadingText"
        :items-per-page="15"
        :search="search"
        class="elevation-1"
        height="75vh"
        show-select
        :expanded.sync="expanded"
        v-model="selectedPrinters"
      >
        <template v-slot:[`item.information.alerts`]="{ item }">
          <v-chip
            v-for="(alert, index) in item.information.alerts"
            color="warning"
            :key="index"
            small
            text-color="black">
          {{ alert }}
          </v-chip>
        </template>
        <template v-slot:[`item.information.status`]="{ item }">
          <v-chip
            v-if="item.information.status"
            :color="getStatusColor(item.information.status)">
          {{ item.information.status }}
          </v-chip>
        </template>
        <template v-slot:[`item.ip`]="{ item }">
          <v-icon v-if="!uniqueIP(item.ip)" color="error" class="mr-2">mdi-alert-octagon</v-icon>
          <a :href="`http://${item.ip}`" target="_blank">{{ item.ip }}</a>
        </template>
        <template v-slot:[`item.updated`]="{ item }">{{ getUpdated(item) | moment("from", "now") }}</template>
        <template v-slot:[`item.created`]="{ item }">{{ item.created | moment("from", "now") }}</template>
        <template v-if="this.user && this.user.role !== 'basic'" v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col>
              <PrinterComponent :currentPrinter="item" :newPrinter="false" />
            </v-col>
            <v-col>
              <v-icon v-if="checkAdmin" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import PrinterComponent from "../components/PrinterComponent";

export default {
  name: "PrinterList",

  components: { PrinterComponent },

  data: () => ({
    search: "",
    itemCount: 0,
    selectedPrinters: [],
    loadingText: "Loading printers list ..",
    headers: [],
    restrictedHeaders: [{ text: "Actions", value: "actions", sortable: false }],
    headersOptions: [
      { text: "Part number", value: "information.partnumber" },
      { text: "Printer type", value: "information.printertype" },
      { text: "Alerts", value: "information.alerts" },
      { text: "Updated", value: "updated" },
      { text: "Created", value: "created" },
      { text: "Location", value: "metadata.location" },
      { text: "Workteam", value: "metadata.workteam" },
    ],
    headersActive: [
      { text: "IP", value: "ip" },
      { text: "HostName", value: "hostname" },
      { text: "ModelName", value: "modelname" },
      { text: "Firmware Version", value: "information.firmwareversion" },
      { text: "Status", value: "information.status" },
      { text: "Alias", value: "metadata.alias" },
    ],
  }),
  
  mounted() {
    if(this.user.role !== 'basic')
    this.restrictedHeaders.forEach(rh => this.headersActive.push(rh));
  },

  computed: {
    ...mapState("account", ["user"]),
    ...mapState("configuration", ["config"]),
    ...mapState("printers", ["printerList", "loading"]),

    getHeaders() {
      this.headers = this.headersActive;
      if (
        this.user &&
        (this.user.role === "admin" || this.user.role === "maintainer")
      )
        this.restrictedHeaders.forEach((restrictedHeader) => {
          const index = this.headers.indexOf(restrictedHeader);
          if (index !== -1) this.headers.splice(index, 1);
          if (
            !this.headers.some(
              (header) => header.value === restrictedHeader.value
            )
          )
            this.headers.push(restrictedHeader);
        });
      return this.headers;
    },

    checkAdmin() {
      return this.user.role === 'admin';  
    }
  },

  watch: {
    selectedPrinters(newValue, oldValue) {
      this.setSelectedPrinters(newValue);
    },
  },

  methods: {
    ...mapActions("printers", ["getPrinters", "deletePrinter"]),
    ...mapMutations("printers", ["setSelectedPrinters"]),
    ...mapGetters("printers", ["countPrinterReservations"]),

    deleteItem(item) {
      if (
        !confirm(
          `Deleting the printer will also delete the printer reservations, are you sure you want to delete ${item.ip} ${item.modelname}`
        )
      )
        return;
      this.deletePrinter(item);
    },

    getStatusColor(status) {
      const e = this.config.client.status.find((s) => (s.text === status));
      return e.color;
    },

    setItemCount(list) {
      this.itemCount = list.length;
    },

    uniqueIP(ip){
      const result = this.printerList.filter(p => p.ip === ip);
      return (result.length === 1);
    },

    getUpdated(item) {
      return item.updated !== undefined ? item.updated : item.created;
    }
  },
};
</script>
