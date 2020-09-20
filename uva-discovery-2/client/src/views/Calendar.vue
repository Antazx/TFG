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
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="primary" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-card-title>
      <v-sheet height="85vh">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          event-overlap-mode="column"
          :now="today"
          :type="type"
          :weekdays="weekday"
          :first-interval="calendarStartHour"
          :interval-count="calendarEndHour"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-row justify="center">
          <v-dialog
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            max-width="650px"
          >
            <ReservationComponent v-if="selectedOpen" v-on:close-dialog="close()"></ReservationComponent>
          </v-dialog>
        </v-row>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import ReservationComponent from "../components/ReservationComponent";

export default {
  name: "Calendar",
  components: { ReservationComponent },
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
  }),

  mounted() {
    this.$refs.calendar.checkChange();
  },

  computed: {
    ...mapState("reservations", ["reservationList", "loading"]),
    ...mapState("printers", ["selectedPrinters", "printerList"]),
    ...mapState("configuration", ["config"]),
    ...mapGetters("printers", ["getPrinterById"]),

    calendarStartHour() {
      return this.config.client.calendarStartHour;
    },
    calendarEndHour() {
      return this.config.client.calendarEndHour - this.calendarStartHour;
    },

    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;
      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);
      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },

    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },

    getReservationList() {
      const reservationSelected = [];

      this.selectedPrinters.forEach((printer) => {
        this.reservationList.forEach((reservation) => {
          if (reservation.resourceid === printer._id)
            reservationSelected.push(reservation);
        });
      });

      return reservationSelected.length > 0
        ? reservationSelected
        : this.reservationList;
    },
  },

  watch: {
    selectedReservation(newValue, oldValue) {
      this.setSelectedReservation(newValue);
    },

    loading(newValue, oldValue) {
      if (newValue === false && oldValue === true)
        this.updateRange({ start: this.start, end: this.end });
    },
  },

  methods: {
    ...mapActions("reservations", ["getReservations"]),
    ...mapMutations("reservations", ["setSelectedReservation"]),

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

      const getEvents =
        reservationSelected.length === 0
          ? this.reservationList
          : reservationSelected;

      getEvents.forEach((reservation) => {
        const eventStart = new Date(reservation.start);
        const eventEnd = new Date(reservation.end);

        if (min <= eventStart && eventEnd <= max) {
          let newEvent = {
            name: reservation.name,
            start: this.formatDate(eventStart, true),
            end: this.formatDate(eventEnd, true),
            id: reservation._id,
            color: reservation.color,
          };
          events.push(newEvent);
        }
      });

      this.start = start;
      this.end = end;
      this.events = events;
      this.$refs.calendar.checkChange();
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
