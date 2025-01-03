import axios from "axios";
import configuration from "./configuration";

class Database {
  async fetchChat({ config }) {
    try {
      const chat = await axios.post(`${configuration.backedUrl}/chat`, config);
      return chat;
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async deletePost(id) {
    try {
      await this.database.deleteDocument(
        configuration.appwriteDatabaseId,
        configuration.appwriteCollectionId,
        id
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost() {
    try {
      return await this.database.listDocuments(
        configuration.appwriteDatabaseId,
        configuration.appwriteCollectionId
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts() {
    try {
      const res = await this.database.listDocuments(
        configuration.appwriteDatabaseId,
        configuration.appwriteCollectionId
      );
      return res;
    } catch (error) {
      console.log("Appwrite serive :: getPosts :: error", error);
      return false;
    }
  }
}

const database = new Database();

export default database;
