import ldapjs from 'ldapjs';
import config from '../config/config';

const url = config.LDAP.URL;
const client = ldapjs.createClient({ url });

const loginLDAP = (email, password) => {
  return new Promise((resolve, reject) => {
    client.bind(process.env.LDAP_ADMIN_USERNAME, process.env.LDAP_ADMIN_PASSWORD, (err) => {
      if (err) reject(new Error(`Promise loginLDAP failed while binding: ${err}`));

      let base = `uid=${email},dc=example,dc=com`;
      let options = {};

      client.search(base, options, (err, res) => {
        if (err) reject(new Error(`Promise loginLDAP failed while searching: ${err}`));

        res.on('searchEntry', (entry) => {
          console.log('entry: ' + JSON.stringify(entry.object));
          client.compare(base, 'password', password, (err, matched) => {
            if (err) reject(new Error(`Promise loginLDAP failed while comparing: ${err}`));
            resolve(matched);
          });
          client.compare(base, 'uid', 'euler', (err, matched) => {
            if (err) reject(new Error(`Promise loginLDAP failed while comparing: ${err}`));
            resolve(matched);
          });
        });
        res.on('error', (err) => {
          reject(new Error(`Promise loginLDAP failed: ${err}`));
        });
      });
    });
  });
};

export default loginLDAP;
