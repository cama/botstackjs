const log = require('../log');
const rp = require('request-promise');
const constants = require('../common/constants');
const env = require('../multiconf')();

async function typing(userID, isOn = false, { pageId=null }={}) {
  // mark_seen - Mark last message as read
  // typing_on - turn typing indicators on
  // typing_off - turn typing indicators off
  // Typing indicators are automatically turned off after 20 seconds

  const action = isOn ? 'typing_on' : 'typing_off';
  const msg = {
    recipient: {
      id: userID
    },
    sender_action: action
  };
  const reqData = {
    url: constants.getFacebookGraphURL('/me/messages'),
    qs: {
      access_token: env.getFacebookPageTokenByPageID(pageId)
    },
    resolveWithFullResponse: true,
    method: 'POST',
    json: msg
  };

  try {
    const resp = await rp(reqData);
    if (resp.statusCode == 200) {
      log.debug('Sent typing to Facebook', {
        module: 'fb',
        recipientId: userID
      });
      return true;
    }
    log.error('Sent settings to Facebook', {
      module: 'fb',
      recipientId: userID
    });
    return false;
  } catch (e) {
    log.error(e, {
      module: 'fb'
    });
    throw e;
  }
}

module.exports = {
  typing
};
