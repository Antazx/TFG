<template>
  <v-card>
    <v-card-text>
      <v-form ref="reservationForm">
        <v-row>
          <v-col>
            <v-text-field label="Hostname" v-model="printer.hostname" readonly></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Ip"
              v-model="printer.ip"
              readonly
              append-outer-icon="mdi-open-in-new"
              @click:append-outer="openIP(printer.ip)"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Modelname" v-model="printer.modelname" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-select
              v-if="user.role !== 'basic'"
              :items="getUserList"
              v-model="reservation.reservedby"
              :readonly="user.role === 'basic'"
              :value="reservation.reservedby"
              label="Reserved by"
              required
            ></v-select>
            <v-text-field
              v-if="user.role === 'basic'"
              label="Reserved by"
              v-model="reservation.reservedby"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
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
              :datetime="getEndDate"
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
      <v-btn
        v-if="checkAdmin"
        :disabled="this.loading"
        :loading="this.loading"
        color="error"
        class="ml-4 mb-5"
        dark
        @click="handleDelete"
      >Delete Reservation</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="checkUser"
        :disabled="this.loading"
        :loading="this.loading"
        color="primary"
        class="mr-4 mb-5"
        dark
        @click="handleUpdate"
      >Update Reservation</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { config } from "../config/config";

export default {
  name: "ReservationComponentTest",
  props: { reservation: Object },

  data: () => ({
    reservation: {
      reservedby: "",
    },
    printer: {},
    start: null,
    end: null,
    textFieldProps: {
      required: true,
      rules: [(v) => !!v || "Field is required"],
    },
    dateFieldProps: { "first-day-of-week": 1 },
    timeFieldProps: { format: "24hr", scrollable: true },
  }),

  created() {
    this.reservation = { ...this.selectedReservation };
    this.printer = { ...this.getPrinterById(this.reservation.resourceid) };
    this.start = new Date(this.reservation.start);
    this.end = new Date(this.reservation.end);
  },

  computed: {
    ...mapState("account", ["user"]),
    ...mapState("users", ["userList"]),
    ...mapState("reservations", ["loading", "selectedReservation"]),
    ...mapState("configuration", ["config"]),
    ...mapGetters("printers", ["getPrinterById"]),

    getUserList() {
      return this.userList.map((u) => ({ text: u.email, value: u.email }));
    },

    getEndDate() {
      return this.reservation.end;
    },

    getStartDate() {
      return this.reservation.start;
    },

    checkUser() {
      let allowOwner = this.reservation.reservedby === this.user.email;
      let allowRole = this.user.role !== "basic";
      return allowOwner || allowRole;
    },

    checkAdmin() {
      return this.user.role === "admin";
    },
  },
  watch: {
    start(newValue, oldValue) {
      this.end = new Date(this.start);
      this.end.setHours(this.end.getHours() + this.config.client.defaultHours);
    },
  },
  methods: {
    ...mapActions("reservations", ["deleteReservation", "updateReservation"]),

    openIP(ip) {
      window.open(`http://${ip}`, "_blank");
    },

    handleDelete() {
      if (!this.$refs.reservationForm.validate()) return;
      this.deleteReservation(this.reservation._id);
      this.$emit("close-dialog");
    },

    handleUpdate() {
      if (!this.$refs.reservationForm.validate()) return;

      let startDate = new Date(this.start);
      let endDate = new Date(this.end);

      this.reservation.start = this.formatDate(startDate);
      this.reservation.end = this.formatDate(endDate);

      this.reservation.name = `${this.getReservationName(
        this.printer
      )} reserved by ${this.reservation.reservedby} from ${
        this.reservation.start
      } to ${this.reservation.end}`;
      this.updateReservation(this.reservation);
      this.$emit("close-dialog");
    },

    getReservationName(printer) {
      let ip = printer.ip;
      let modelname = printer.modelname;
      let alias = printer.metadata.alias;

      let name = `${ip} - ${modelname}`;
      if (alias) name += ` - ${alias}`;
      return name;
    },

    formatDate(a) {
      return `${a.getFullYear()}-${
        a.getMonth() + 1
      }-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
    },
  },
};
</script>