import ldapjs from 'ldapjs';
import Configuration from '../models/configuration';

const loginLDAP = async (email, password) => {
  try {
    const conf = await Configuration.findOne();
    const url = conf.server.ldap.url;
    const client = ldapjs.createClient({ url });
    const adminUsername = conf.server.ldap.adminUsername;
    const adminPassword = conf.server.ldap.adminPassword;

    return new Promise((resolve, reject) => {
      client.bind(adminUsername, adminPassword, (err) => {
        if (err) reject(new Error(`Promise loginLDAP failed while binding: ${err}`));

        let base = `uid=${email},dc=example,dc=com`;
        let options = {};

        client.search(base, options, (err, res) => {
          if (err) reject(new Error(`Promise loginLDAP failed while searching: ${err}`));

          res.on('searchEntry', (entry) => {
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
  } catch (error) {
    return new Promise((resolve, reject) => reject(new Error(error)));
  }
};

export default loginLDAP;
