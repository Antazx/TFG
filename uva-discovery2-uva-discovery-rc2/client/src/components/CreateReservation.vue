<template>
  <v-row justify="center" class="mt-2">
    <v-dialog v-model="dialog" max-width="700">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">New Reservation</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline">New Reservation on {{this.$props.date}}</span>
          <v-spacer></v-spacer>
          <span class="headline">{{this.$props.name}}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-form ref="newReservation">
            <v-row>
              <v-col>
                <v-select
                  v-if="user.role !== 'basic'"
                  label="Reserved by"
                  v-model="reservation.reservedby"
                  :items="getUserList"
                  :value="user.email"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-datetime-picker
                  label="Start*"
                  v-model="start"
                  :datetime="start"
                  :textFieldProps="textFieldProps"
                  :datePickerProps="dateFieldProps"
                  :timePickerProps="timeFieldProps"
                >
                  <template v-slot:dateIcon>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <template v-slot:timeIcon>
                    <v-icon color="primary">mdi-timer</v-icon>
                  </template>
                </v-datetime-picker>
              </v-col>
              <v-divider vertical class="mx-4"></v-divider>

              <v-col>
                <v-datetime-picker
                  label="End*"
                  v-model="end"
                  :textFieldProps="textFieldProps"
                  :datePickerProps="dateFieldProps"
                  :timePickerProps="timeFieldProps"
                >
                  <template v-slot:dateIcon>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <template v-slot:timeIcon>
                    <v-icon color="primary">mdi-timer</v-icon>
                  </template>
                </v-datetime-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="ml-4 mb-5" dark outlined @click="close">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mr-4 mb-5"
            dark
            @click="handleCreate"
          >Create Reservation</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { config } from "../config/config";

export default {
  name: "CreateReservation",
  props: { printer: String, date: String },
  data: () => ({
    dialog: false,
    reservation: {
      resourceid: "",
      start: null,
      end: null,
      reservedby: "",
      name: "",
      active: true,
      color: "",
    },
    end: null,
    start: null,
    textFieldProps: {
      required: true,
      clearable: true,
      rules: [(v) => !!v || "Field is required"],
    },
    dateFieldProps: { "first-day-of-week": 1 },
    timeFieldProps: {
      format: "24hr",
      scrollable: true,
      [`allowed-hours`]: [],
      [`allowed-minutes`]: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    },
  }),

  mounted() {
    this.reservation.resourceid = this.$props.printer;
    let printer = this.getPrinterById(this.$props.printer);
    this.reservation.name = this.getReservationName(printer);
    this.reservation.color = printer.color;
    this.timeFieldProps[`allowed-hours`] = this.getAllowedHours;
  },

  watch: {
    dialog(newValue, oldValue) {
      if (newValue === true) {
        this.reservation.reservedby = this.user.email;
        this.start = this.getCurrentDateTime();
      }
    },
    start(newValue, oldValue) {
      this.end = new Date(this.start);
      this.end.setHours(this.end.getHours() + this.config.client.defaultHours);
    },
  },

  computed: {
    ...mapState("account", ["user"]),
    ...mapState("users", ["userList"]),
    ...mapState("reservations", ["loading"]),
    ...mapState("configuration", ["config"]),
    ...mapGetters("printers", ["getPrinterById"]),

    getUserList() {
      return this.user.role === "basic"
        ? { text: this.user.email, value: this.user.email }
        : this.userList.map((u) => ({ text: u.email, value: u.email }));
    },
    getAllowedHours() {
      const min = this.config.client.calendarStartHour;
      const max = this.config.client.calendarEndHour;
      const hours = [];
      for (let i = min; i <= max; i++) hours.push(i);
      return hours;
    },
  },

  methods: {
    ...mapActions("reservations", ["createReservation"]),

    getCurrentDateTime() {
      let now = new Date();
      let hours = now.getHours();
      let minutes =
        now.getMinutes() > 10
          ? now.getMinutes() + ""
          : "0" + now.getMinutes() + "";
      let dateTime = new Date(this.$props.date);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);

      return dateTime;
    },

    close() {
      this.dialog = false;
      this.start = null;
      this.end = null;
      this.$refs.newReservation.reset();
    },

    handleCreate() {
      if (!this.$refs.newReservation.validate()) return;
      this.reservation.start = `${
        this.$props.date
      } ${this.start.getHours()}:${this.start.getMinutes()}`;
      this.reservation.end = `${
        this.$props.date
      } ${this.end.getHours()}:${this.end.getMinutes()}`;
      this.reservation.name += ` reserved by ${this.reservation.reservedby} from ${this.reservation.start} to ${this.reservation.end}`;

      this.createReservation(this.reservation);
    },

    getReservationName(printer) {
      let ip = printer.ip;
      let modelname = printer.modelname;
      let alias = printer.metadata.alias;

      let name = `${ip} - ${modelname}`;
      if (alias) name += ` - ${alias}`;
      return name;
    },
  },
};
</script>