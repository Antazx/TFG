<template>
  <v-row>
    <v-col v-for="item in reservations" :key="item._id">
      <v-row>
        <v-col cols="1"> Start: {{ new Date(item.start).getHours() }} </v-col>
        <v-col cols="10">
          <v-progress-linear value="15"></v-progress-linear>
        </v-col>
        <v-col cols="1"> End: {{ new Date(item.end).getHours() }} </v-col>
      </v-row>
    </v-col>

    <v-col v-if="reservations.length === 0">
      <h5>No reservations today</h5>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Timeline",
  props: { printer: Object },
  data: () => ({
    reservations: [],
    e1: 1
  }),

  created() {
    this.reservations = this.getPrinterReservations(this.$props.printer._id);
  },

  computed: {
    ...mapGetters("reservations", ["getPrinterReservations"])
  }
};
</script>
