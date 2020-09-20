import ffi from "ffi-napi";
import path from 'path';

const libPath = path.join(__dirname, "/libhpDiscoverySimulatorLibrary.so");
const libHPDiscovery = ffi.Library(
  libPath,
  {
    HPDiscoveryInit: ["int", []],
    HPDiscoveryTerminate: ["int", []],
    HPDiscoverySubscribe: ["int", ["pointer", "void"]],
    HPPrinterInformationSubscribe: ["int", ["pointer", "void"]],
    HPDiscoveryGetPrinterInformation: ["int", ["string", "string", "string"]],
    HPPrinterLogFileSubscribe: ["int", ["pointer", "void"]],
    HPDiscoveryGetPrinterLogFile: ["int", ["string", "string", "string"]],
  }
);

const initDiscovery = () => {
  let res = libHPDiscovery.HPDiscoveryInit();
  if (res !== 0) throw new Error(`initDiscovery failed: ${err}`);
  return res;
};

const suscribeDiscovery = (subscriptionCallback) => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPDiscoverySubscribe.async(subscriptionCallback, null, (err, res) => {
      if (err || res !== 0) reject(new Error(`Promise suscribeDiscovery failed: ${err}`));
      resolve(res);
    });
  });
};

const suscribeInformation = (informationCallback) => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPPrinterInformationSubscribe.async(informationCallback, null, (err, res) => {
      if (err || res !== 0) reject(new Error(`Promise suscribeInformation failed: ${err}`));
      resolve(res);
    });
  });
};

const getPrinterInformation = (ip, hostName, modelName) => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPDiscoveryGetPrinterInformation.async(ip, hostName, modelName, (err, res) => {
      if (err || res !== 0)
        reject(new Error(`Promise getPrinterInformation failed: ${err} for: ${ip}, ${hostName}, ${modelName}`));
      resolve(res);
    });
  });
};

const suscribeLog = (logCallback) => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPPrinterLogFileSubscribe.async(logCallback, null, (err, res) => {
      if (err || res !== 0) reject(new Error(`Promise suscribeLog failed with code: ${err}`));
      resolve(res);
    });
  });
};

const getPrinterLog = (ip, hostName, modelName) => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPDiscoveryGetPrinterLogFile.async(ip, hostName, modelName, (err, res) => {
      if (err || res !== 0)
        reject(new Error(`getPrinterLog failed with code: ${err} for: ${ip}, ${hostName}, ${modelName}`));
      resolve(res);
    });
  });
};

const terminateDiscovery = () => {
  return new Promise((resolve, reject) => {
    libHPDiscovery.HPDiscoveryTerminate.async((err, res) => {
      if (err || res !== 0) reject(new Error(`Promise terminateDiscovery failed with code: ${err}`));
      resolve(res);
    });
  });
};

export default {
  initDiscovery,
  terminateDiscovery,
  suscribeDiscovery,
  suscribeInformation,
  getPrinterInformation,
  suscribeLog,
  getPrinterLog,
};
