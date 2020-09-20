<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="primary" @click="setToday">Today</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card-title>
      <v-sheet height="85vh">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-overlap-mode="mode"
          :now="today"
          type="category"
          category-show-all
          :categories="getList"
          :weekdays="weekday"
          first-interval="6"
          interval-count="17"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        >
          <template v-slot:category="{ category }">
            <v-row>
              <v-col>
                <v-row justify="center">
                  <span>{{getCategory(category)}}</span>
                </v-row>
                <CreateReservation :printer="category" :date="getCurrentDate"></CreateReservation>
              </v-col>
            </v-row>
          </template>
        </v-calendar>
        <v-row justify="center">
          <v-dialog
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            max-width="650px"
          >
            <ReservationComponent
              v-if="selectedOpen"
              :reservation="selectedReservation"
              v-on:close-dialog="close()"
            ></ReservationComponent>
          </v-dialog>
        </v-row>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import CreateReservation from "../components/CreateReservation";
import ReservationComponent from "../components/ReservationComponent";

export default {
  name: "ReservationList",
  components: { ReservationComponent, CreateReservation },
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedReservation: {},
    selectedOpen: false,
    mode: "column",
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: "",
    events: [],
    reservations: [],
    currentDate: "",
  }),

  mounted() {
    this.$refs.calendar.checkChange();
    this.currentDate = this.$refs.calendar.start;
  },

  computed: {
    ...mapState("reservations", ["reservationList", "loading"]),
    ...mapState("printers", ["selectedPrinters", "printerList"]),

    getList() {
      return this.selectedPrinters.map((p) => {
        return p._id;
      });
    },
    getCurrentDate() {
      return this.currentDate;
    },
  },

  watch: {
    loading(newValue, oldValue) {
      if (newValue === false && oldValue === true)
        this.updateRange({ start: this.start, end: this.end });
    },

    selectedReservation(newValue, oldValue) {
      this.setSelectedReservation(newValue);
    },
  },

  methods: {
    ...mapActions("reservations", ["getReservations"]),
    ...mapMutations("reservations", ["setSelectedReservation"]),
    ...mapGetters("printers", ["getSelectedReservations"]),

    getCategory(printerId) {
      const printer = this.selectedPrinters.find((p) => p._id === printerId);
      let cat = `${printer.ip} - ${printer.modelname}`;
      if (printer.metadata.alias !== "") cat += ` - ${printer.metadata.alias}`;
      return cat;
    },

    close() {
      this.selectedOpen = false;
      this.$refs.calendar.checkChange();
    },
    setToday() {
      this.focus = this.today;
    },

    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        this.selectedReservation = this.reservationList.find(
          (r) => r._id === event.id
        );
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

    getEventColor(event) {
      return event.color;
    },

    updateRange({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T00:00:00`).getTime();
      const max = new Date(`${end.date}T23:59:59`).getTime();

      const reservationSelected = [];

      this.selectedPrinters.forEach((printer) => {
        this.reservationList.forEach((reservation) => {
          if (reservation.resourceid === printer._id)
            reservationSelected.push(reservation);
        });
      });

      reservationSelected.forEach((reservation) => {
        const eventStart = new Date(reservation.start);
        const eventEnd = new Date(reservation.end);

        if (min <= eventStart && eventEnd <= max) {
          events.push({
            name: reservation.name,
            start: this.formatDate(eventStart, true),
            end: this.formatDate(eventEnd, true),
            id: reservation._id,
            color: reservation.color,
            category: reservation.resourceid,
          });
        }
      });

      this.start = start;
      this.end = end;
      this.events = events;
      this.currentDate = start.date;
    },

    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },

    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${
            a.getMonth() + 1
          }-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
  },
};
</script>
