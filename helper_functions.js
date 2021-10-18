const findUserByEmail = function (email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

const authenticateUser = function(email, password, users) {
  if(bcrypt.compareSync(password, userFound.password) ) {
    return userFound;
  }
  return false;
};

const createUser = function (email, password, users) {
  const hashedPassword = bcrypt.hashSync(password, salt)
  const userId = generateRandomString()
  users[userId] = { userId, email, password: hashedPassword }
  return userId;
};

module.exports =  findUserByEmail, authenticateUser, createUser
