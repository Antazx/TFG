<template>
  <v-card min-height="785px" max-height="785px" class="ma-0">
    <v-card-title>
      <v-spacer></v-spacer>
      <span class="headline">Printer updates</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-list flat subheader three-line class="ma-0" expand max-height="700px">
        <v-list-item three-line v-for="log in getUpdatesList " :key="log.timestamp">
          <v-list-item-content>
            <v-list-item-title>{{log.user}}</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">{{log.description}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{log.timestamp | moment("from", "now")}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "PrinterLog",
  props: { printer: Object },
  data: () => ({
    changes: [],
  }),
  computed: {
    ...mapGetters("updates", ["getPrinterUpdates"]),
    getUpdatesList() {
      return this.getPrinterUpdates(this.printer._id).reverse();
    },
  },
};
</script>
<style lang="css" scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
}
.v-list {
  height: 700px;
  overflow-y: scroll;
}
</style>