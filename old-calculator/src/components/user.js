import { v4 as uuidv4 } from "uuid";
export default {
  methods: {
    getUserUuid() {
      let userUuid = this.$session.get("user-uuid");

      const newUuid = userUuid || uuidv4();
      if (!userUuid) {
        this.$session.set("user-uuid", newUuid);
        userUuid = newUuid;
      }

      return userUuid;
    }
  }
};
