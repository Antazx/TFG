<template>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline mb-4">{{title}}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" id="new-reservation-form">
            <v-row v-if="!newReservation">
              <v-col>
                <v-text-field
                  label="Hostname"
                  v-model="currentPrinter.hostname"
                  disabled
                  dense
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Ip"
                  v-model="currentPrinter.ip"
                  disabled
                  dense
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Modelname"
                  v-model="currentPrinter.modelname"
                  disabled
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="user.role !== 'basic'">
              <v-col>
                <v-select
                :items="getUserList"
                v-model="defaultUser"
                label="Reserved by"
                :rules="reservedByRules"
                required
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row v-if="user.role === 'basic'">
              <v-col>
                <v-text-field
                label="Reserved by"
                v-model="reservation.reservedby"
                disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-datetime-picker
                  label="Start"
                  v-model="startDateTime"
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
              <v-col>
                <v-datetime-picker
                  label="End"
                  v-model="endDateTime"
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
          
          <v-spacer></v-spacer>
          <v-btn
          v-if="newPrinter"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mx-4 mb-3"
            dark
            @click="handleCreate"
            >
            Create
            </v-btn>
            <v-btn
            v-if="!newPrinter"
            :diabled="this.loading"
            :loading="this.loading"
            color="primary"
            class="mx-4 mb-3"
            dark
            @click="handleUpdate"
            >
            Update
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
</template>

<script>
import { config } from "../config/config";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ReservationComponent",
  props: {
    printer: Object,
    reservation: Object
  },
  data: () => ({
    dialog: false,
    defaultUser: "",
    currentPrinter: null,
    newReservation: false,
    reservation: {
      resourceid: "",
      start: null,
      end: null,
      reservedby: "",
      name: ""
    },
    startDateTime: Date.now(),
    endDateTime: null,
    textFieldProps: {
      required: true,
      clearable: true,
      rules: [v => !!v || "Field is required"]
    },
    reservedByRules: [v => !!v || "Reserved By is required"],
    dateStartFieldProps: {
      "first-day-of-week": 1,
      min: new Date()
    },
    dateEndFieldProps: { "first-day-of-week": 1 },
    timeFieldProps: { format: "24hr", scrollable: true }
  }),

  created() {
    console.log(this.$props.reservation);
    console.log(this.$props.printer);

    if (Object.keys(this.$props.reservation) === 0) {
      if (Object.keys(this.$props.printer) !== 0)
        this.currentPrinter = Object.assign(this.$props.printer);
      this.newReservation = true;
    } else {
      this.reservation = Object.assign(this.$props.reservation);
      this.defaultUser = this.getReservedBy;
      this.currentPrinter = this.printerList.find(
        p => p._id === this.reservation.resourceid
      );
      console.log(this.currentPrinter);
    }
  },

  mounted() {
    this.startDateTime = new Date();
    this.endDateTime = new Date();
    this.endDateTime.setHours(
      this.startDateTime.getHours() + config.DEFAULT_HOURS
    );
  },

  computed: {
    ...mapState("users", ["userList"]),
    ...mapState("account", ["user"]),
    ...mapState("printers", ["printerList"]),
    ...mapState("reservations", ["loading"]),
    ...mapGetters("printers", ["getPrinterById"]),

    getCurrentPrinter() {
      return this.getPrinterById(this.reservation.resourceid);
    },

    getLoading() {
      return this.loading;
    },

    getUserList() {
      return this.user.role === "basic"
        ? { text: this.user.email, value: this.user.email }
        : this.userList.map(u => {
            return { text: u.email, value: u.email };
          });
    },
    getReservedBy() {
      let reservedby = this.newReservation
        ? { text: this.user.email, value: this.user.email }
        : {
            text: this.reservation.reservedby,
            value: this.reservation.reservedby
          };
      return reservedby;
    },

    title() {
      return this.newReservation ? "New Reservation" : this.reservation.name;
    }
  },

  methods: {
    ...mapActions("reservations", ["createReservation", "updateReservation"]),

    close() {
      this.dialog = false;
      if (this.newReservation) this.$refs.form.reset();
    },

    handleCreate() {
      if (!this.$refs.form.validate()) return;
      this.reservation.resourceid = this.currentPrinter._id;
      this.reservation.start = this.startDateTime;
      this.reservation.end = this.endDateTime;
      this.reservation.reservedby = this.defaultUser.value;
      this.reservation.name = `${this.currentPrinter.ip}, ${this.currentPrinter.modelname} reserved by ${this.reservation.reservedby}`;
      this.createReservation(this.reservation);
      this.close();
    },

    handleUpdate() {
      if (!this.$refs.form.validate()) return;
      this.reservation.start = this.startDateTime;
      this.reservation.end = this.endDateTime;
      this.reservation.reservedby = this.defaultUser.value;
      this.reservation.name = `${this.currentPrinter.ip}, ${this.currentPrinter.modelname} reserved by ${this.reservation.reservedby}`;
      this.updateReservation(this.reservation);
      this.close();
    }
  }
};
</script>
