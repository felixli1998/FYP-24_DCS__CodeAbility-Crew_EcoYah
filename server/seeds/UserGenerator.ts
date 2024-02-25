import { User, UserRole } from "../src/entities/User";
import { hashSync } from "bcrypt";

const FIRST_NAMES = ['Michael', 'Daniel', 'Sheryl', 'Emily','Ethan','Olivia','Noah','Ava','Liam','Sophia','Mason','Isabella','Jacob']; // First name list
const LAST_NAMES = ['Jackson', 'Smith', 'Johnson', 'Brown','Davis','Wilson','Martinez','Anderson','Taylor','Thomas','White','Harris','Clark']

function* UserGenerator(): Generator<User>{
    let i = 0;
    while (true) {
        const newUser = new User();

        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}@test.com`;
        const passwordDigest = hashSync("123456789", 10); // 10 is the salt rounds

        newUser.name = firstName + " " + lastName;
        newUser.email = email;
        newUser.passwordDigest = passwordDigest;
        newUser.contactNum = `+65 ${Math.floor(Math.random() * 100000000)}`;
        newUser.role = UserRole.DONOR; // Admin so no error when using this to create Donation Event
        yield newUser;
        i++;
    }
}

export default UserGenerator;