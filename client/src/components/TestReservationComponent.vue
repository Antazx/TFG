<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="newReservation" color="primary" v-bind="attrs" v-on="on">
        New Reservation
      </v-btn>
      <v-icon v-if="!newReservation" v-on="on" v-bind="attrs" color="primary">
        mdi-pencil
      </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <span class="headline">{{ title }}</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row v-if="!newReservation">
            <v-col>
              Printer details
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                label="Reserved by*"
                v-model="currentReservation.reservedby"
                :items="getUserList"
                :disabled="user.role === 'basic'"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-datetime-picker
                label="Start*"
                v-model="startDateTime"
                :datetime="startDateTime"
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
                label="End*"
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
        <v-btn color="primary" class="ml-4 mb-5" dark outlined @click="close">
          Close
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="newReservation"
          :diabled="this.loading"
          :loading="this.loading"
          color="primary"
          class="mr-4 mb-5"
          dark
          @click="handleCreate"
        >
          Create Reservation
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { config } from "../config/config";
import { mapState, mapActions } from "vuex";

export default {
  name: "TestReservationComponent",
  props: {
    printer: String,
    reservation: Object
  },
  data: () => ({
    dialog: false,
    newReservation: false,
    currentPrinter: null,
    currentReservation: {
      resourceid: "",
      start: null,
      end: null,
      reservedby: "",
      name: "",
      active: ""
    },
    startDateTime: null,
    endDateTime: null,
    textFieldProps: {
      required: true,
      clearable: true,
      rules: [v => !!v || "Field is required"]
    },
    reservedByRules: [v => !!v || "Reserved By is required"],
    dateFieldProps: { "first-day-of-week": 1 },
    timeFieldProps: { format: "24hr", scrollable: true }
  }),

  created() {
    console.log(this.$props.printer);
    console.log(this.$props.reservation);

    if (this.$props.reservation === undefined) {
      this.newReservation = true;
      this.currentPrinter = this.getPrinterByID(this.$props.printer);
      this.currentReservation.resourceid = this.currentPrinter._id;
    } else {
      this.newReservation = false;
      this.currentPrinter = this.getPrinterByID(
        this.$props.reservation.resourceid
      );
      this.currentReservation = Object.assign(this.$props.reservation);
    }
  },

  mounted() {
    this.startDateTime = new Date();
    this.currentReservation.reservedby = this.user.email;
  },

  computed: {
    ...mapState("printers", ["printerList"]),
    ...mapState("reservations", ["loading"]),
    ...mapState("account", ["user"]),
    ...mapState("users", ["userList"]),

    title() {
      return this.newReservation ? "New Reservation" : "Edit Reservation";
    },

    getEndDate() {
      if (this.startDateTime === null) return null;
      this.endDateTime = new Date(this.startDateTime);
      this.endDateTime.setHours(
        this.endDateTime.getHours() + config.DEFAULT_HOURS
      );
      return this.endDateTime;
    },

    getUserList() {
      return this.userList.map(u => ({ text: u.email, value: u.email }));
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
      this.currentReservation.start = this.startDateTime;
      this.currentReservation.end = this.endDateTime;
      this.currentReservation.name = this.getName();
      this.currentReservation.active = true;
      this.createReservation(this.currentReservation);
      this.$emit("checkchange");
    },

    getName() {
      return `${this.currentPrinter.ip} - ${this.currentPrinter.modelname} reserved by ${this.currentReservation.reservedby}`;
    },

    getPrinterByID(id) {
      return this.printerList.find(p => p._id === id);
    }
  }
};
</script>