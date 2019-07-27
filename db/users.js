const users = [
  {
    id: 1, username: process.env.APIUSER, password: process.env.APIKEY,
  },
]

const findByUsername = (username, cb) => {
  process.nextTick(() => {
    for (let i = 0, len = users.length; i < len; i += 1) {
      const user = users[i]
      console.log(process.env.APIKEY)
      if (user.username === username) {
        return cb(null, user)
      }
    }
    return cb(null, null)
  })
}
module.exports.findByUsername = findByUsername
