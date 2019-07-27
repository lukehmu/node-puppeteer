/**
 * Users db module
 * @todo this needs refactoring as it's a little overkill for a single
 * API key e.g. we don't need the findByUsername() function, as we only have
 * 1 API user!
 * @module db/users
 */

const users = [
  {
    id: 1, username: process.env.APIUSER, password: process.env.APIKEY,
  },
]

/**
 * searches the users object to match the username sent via the http request
 * @param username the username sent from the http auth
 * @param cb unsure what this does - the perils of copying code off the
 * internet - assume this is a callback function?
 */
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
