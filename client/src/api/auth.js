import configuration from "./configuration";
import axios from "axios";

class Auth {
  async register({ email, password, name, pic }) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const user = await axios.post(
        `${configuration.backedUrl}/user/register`,
        { email, password, name, pic },
        config
      );
      return user.data;
    } catch (error) {
      console.error("Appwrite service :: createAccount :: error", error);
    }
  }

  async login({ email, password }) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const user = await axios.post(
        `${configuration.backedUrl}/user/login`,
        {
          email,
          password,
        },
        config
      );
      return user.data;
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
    }
  }

  async logout() {
    try {
      return;
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
    }
  }
}

const auth = new Auth();
export default auth;
