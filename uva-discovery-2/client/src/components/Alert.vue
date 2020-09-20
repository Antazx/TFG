<template>
  <v-alert v-if="this.show" border="left" class="alert ma-3" :type="this.type">{{ message }}</v-alert>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Alert",
  data: () => ({}),
  computed: {
    ...mapState("alert", ["type", "message", "show"]),
  },
};
</script>
