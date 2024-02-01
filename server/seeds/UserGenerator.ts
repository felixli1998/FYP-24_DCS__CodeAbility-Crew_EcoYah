import { User, UserRole } from "../src/entities/User";
import { hashSync } from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

const FIRST_NAMES = ['Michael', 'Daniel', 'Sheryl', 'Emily','Ethan','Olivia','Noah','Ava','Liam','Sophia','Mason','Isabella','Jacob']; // First name list
const LAST_NAMES = ['Jackson', 'Smith', 'Johnson', 'Brown','Davis','Wilson','Martinez','Anderson','Taylor','Thomas','White','Harris','Clark']

function* UserGenerator(): Generator<User>{
    let i = 0;
    while (true) {
        const newUser = new User();
        
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const uuid = uuidv4().substr(0, 4); // Extracting the first 4 characters of the UUID
        const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${uuid}@test.com`;
        const passwordDigest = hashSync("123456789", 10); // 10 is the salt rounds

        newUser.name = firstName + " " + lastName;
        newUser.email = email;
        newUser.passwordDigest = passwordDigest;
        newUser.contactNum = `+65 ${uuidv4().substr(0,8)}`;
        newUser.role = UserRole.DONOR;
        yield newUser;
        i++;
    }
}

export default UserGenerator;