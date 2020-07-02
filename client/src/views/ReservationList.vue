<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="primary" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-toolbar>
        Selected Printers: {{ getSelectedPrinterCount }}

        <v-btn
          dark
          color="primary"
          @click="selectedPrinters = []"
          :disabled="selectedPrinters.length === 0"
        >
          <v-icon dark>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-sheet height="800">
        <v-btn @click="$refs.calendar.checkChange()">click</v-btn>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          type="category"
          category-show-all
          event-overlap-mode="column"
          :categories="getList"
          :events="events"
          :event-color="getEventColor"
          @change="updateRange"
          @click:event="showEvent"
        >
          <template v-slot:category="{ category }">
            <v-row>
              <v-col>
                <span class="justify-center">{{ getCategory(category) }}</span>
                <TestReservationComponent
                  :printer="category"
                  v-on:checkchange="checkChange()"
                />
              </v-col>
            </v-row>
          </template>
        </v-calendar>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import TestReservationComponent from "../components/TestReservationComponent";
import ReservationComponent from "../components/ReservationComponent";

export default {
  name: "ReservationList",
  components: { ReservationComponent, TestReservationComponent },
  data: () => ({
    focus: "",
    events: [],
    categories: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false
  }),

  mounted() {
    this.checkChange();
  },

  computed: {
    ...mapState("printers", ["selectedPrinters"]),
    ...mapGetters("printers", ["getSelectedReservations", "getPrinterById"]),

    getList() {
      console.log("cambia getList");
      return (this.categories = this.selectedPrinters.map(p => {
        return p._id;
      }));
    },

    getCategories() {
      return (this.categories = this.selectedPrinters.map(p => {
        return this.getCategory(p._id);
      }));
    },

    getSelectedPrinterCount() {
      return this.selectedPrinters.length;
    }
  },

  watch: {
    getSelectedReservations(newValue, oldValue) {
      console.log("cambia seleccionadas");
      this.$refs.calendar.checkChange();
    }
  },

  methods: {
    setToday() {
      this.focus = this.today;
    },

    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
    },

    checkChange() {
      console.log("checkChange");
      this.$refs.calendar.checkChange();
    },

    updateRange({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T00:00:00`).getTime();
      const max = new Date(`${end.date}T23:59:59`).getTime();

      this.getSelectedReservations.forEach(reservation => {
        const eventStart = new Date(reservation.start);
        const eventEnd = new Date(reservation.end);

        if (min <= eventStart && eventEnd <= max) {
          events.push({
            name: reservation.name,
            start: this.formatDate(eventStart, true),
            end: this.formatDate(eventEnd, true),
            id: reservation._id,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            category: reservation.resourceid
          });
        }
      });

      this.start = start;
      this.end = end;
      this.events = events;
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },

    getCategory(printerId) {
      console.log(printerId);
      const printer = this.selectedPrinters.find(p => p._id === printerId);
      return `${printer.ip} - ${printer.modelname}`;
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }
  }
};
</script>
