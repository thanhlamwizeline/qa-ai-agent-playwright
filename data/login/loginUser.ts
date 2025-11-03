import {USERS} from "../constants"

export const loginUser = {
  VALID_USER: {
    userName: USERS.STANDARD_CUSTOMER.userName,
    password: USERS.STANDARD_CUSTOMER.password
  },
  INVALID_USER_1: {
    userName: USERS.INVALID_USER_1.userName,
    password: USERS.INVALID_USER_1.password,
    expectedMessage: 'Wrong password.',
  },
  INVALID_USER_2: {
    userName: USERS.INVALID_USER_2.userName,
    password: USERS.INVALID_USER_2.password,
    expectedMessage: 'Wrong password.',
  },
}
