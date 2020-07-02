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
              dense
            />
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
              dense
            />
          </v-col>

          <v-col>
            <PrinterComponent
              v-if="this.user && this.user.role !== 'basic'"
              :currentPrinter="{}"
            />
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
              :disabled="selectedPrinters.length === 0"
            >
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
        show-select
        :expanded.sync="expanded"
        v-model="selectedPrinters"
      >
        <template v-slot:item.information.alerts="{ item }">
          <v-chip
            v-for="(alert, index) in item.information.alerts"
            color="warning"
            :key="index"
            small
            text-color="black"
          >
            {{ alert }}
          </v-chip>
        </template>

        <template v-slot:item.information.status="{ item }">
          <v-chip
            v-if="item.information.status"
            :color="getStatusColor(item.information.status)"
          >
            {{ item.information.status }}
          </v-chip>
        </template>

        <template v-slot:item.ip="{ item }">
          <a :href="`http://${item.ip}`" target="_blank">{{ item.ip }}</a>
        </template>

        <template v-slot:item.updated="{ item }">
          {{ item.updated | moment("from", "now") }}
        </template>

        <template v-slot:item.created="{ item }">
          {{ item.created | moment("from", "now") }}
        </template>

        <template
          v-if="this.user && this.user.role !== 'basic'"
          v-slot:item.actions="{ item }"
        >
          <v-row>
            <v-col>
              <PrinterComponent :currentPrinter="item" />
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
      { text: "Workteam", value: "metadata.workteam" }
    ],
    headersActive: [
      { text: "IP", value: "ip" },
      { text: "HostName", value: "hostname" },
      { text: "ModelName", value: "modelname" },
      { text: "Firmware Version", value: "information.firmwareversion" },
      { text: "Status", value: "information.status" },
      { text: "Alias", value: "metadata.alias" },
      { text: "Reserved by", value: "metadata.reservedby" }
    ]
  }),
  mounted() {
    this.getPrinters(false);
  },
  computed: {
    ...mapState("printers", ["printerList", "loading"]),
    ...mapState("account", ["user"]),

    getHeaders() {
      this.headers = this.headersActive;
      if (
        this.user &&
        (this.user.role === "admin" || this.user.role === "maintainer")
      )
        this.restrictedHeaders.forEach(restrictedHeader => {
          const index = this.headers.indexOf(restrictedHeader);
          if (index !== -1) this.headers.splice(index, 1);
          if (
            !this.headers.some(
              header => header.value === restrictedHeader.value
            )
          )
            this.headers.push(restrictedHeader);
        });
      return this.headers;
    }
  },

  watch: {
    selectedPrinters(newValue, oldValue) {
      this.setSelectedPrinters(newValue);
    }
  },

  methods: {
    ...mapActions("printers", ["getPrinters", "deletePrinter"]),
    ...mapMutations("printers", ["setSelectedPrinters"]),

    deleteItem(item) {
      if (!confirm(`Are you sure you want to delete ${item.ip}`)) return;
      this.deletePrinter(item);
    },

    getStatusColor(status) {
      switch (status) {
        case "Online":
          return "success";
          break;

        case "Awake":
          return "success";
          break;

        case "Unreachable":
          return "error";
          break;

        case "Turn off":
          return "error";
          break;

        case "With system errors":
          return "error";
          break;

        case "With alerts":
          return "warning";
          break;

        case "Busy with activities":
          return "warning";
          break;

        default:
          return "grey";
          break;
      }
    },

    setItemCount(list) {
      this.itemCount = list.length;
    }
  }
};
</script>
