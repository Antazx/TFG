<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :max-width="newPrinter? '700px' : '950px'"
      scrollable="false"
      class="pa-0"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-if="newPrinter" color="primary" v-on="on">New Printer</v-btn>
        <v-icon v-if="!newPrinter" v-on="on" color="primary" class="mr-2">mdi-pencil</v-icon>
      </template>
      <v-card class="pa-0">
        <v-card-text>
          <v-row>
            <v-col :cols="newPrinter ? '12' : '8'">
              <PrinterDetails v-on:close-component="close()" :currentPrinter="getPrinterId"></PrinterDetails>
            </v-col>
            <v-col v-if="!newPrinter" cols="4">
              <PrinterLog :printer="getPrinter"></PrinterLog>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import PrinterDetails from "./PrinterDetails";
import PrinterLog from "./PrinterLog";

export default {
  name: "PrinterComponent",
  components: { PrinterDetails, PrinterLog },
  props: { newPrinter: Boolean, currentPrinter: Object },
  data: () => ({
    dialog: false,
  }),
  computed: {
    newPrinter() {
      return this.$props.newPrinter;
    },
    getPrinter() {
      return this.newPrinter ? {} : this.$props.currentPrinter;
    },
    getPrinterId() {
      return this.newPrinter ? "" : this.$props.currentPrinter._id;
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>