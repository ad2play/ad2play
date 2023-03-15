import { config } from '../config/AppConfig';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require("mongoose");

// class for managing the connection to the mongodb database using the mongoose package
export class DatabaseProvider {
    private static connection: typeof mongoose;

    // connection method called when starting the system to initialize the connection to the database
    public static async getConnection(): Promise<typeof mongoose> {
        if (DatabaseProvider.connection) {
            return DatabaseProvider.connection;
        }

        try {
            await mongoose.connect(config.database, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            DatabaseProvider.connection = mongoose.connection;
        } catch (err) {
            console.log(err);
            throw err;
        }
        return DatabaseProvider.connection;
    }

    // method for disconnecting from the database which is called when the system is shut down
    public static async disconnectDB(): Promise<void> {
        if (DatabaseProvider.connection) {
            return DatabaseProvider.connection;
        }

        try {
            await DatabaseProvider.connection.disconnect();
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}