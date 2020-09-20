import { diff } from 'json-diff';

const getPrinterDiff = (oldPrinter, newPrinter) => {
  try {
    const oldPrinterAttrs = getArrayAttrs(oldPrinter);
    const newPrinterAttrs = getArrayAttrs(newPrinter);

    const changes = getChanges(oldPrinterAttrs, newPrinterAttrs);
    return changes;
  } catch (err) {
    throw new Error({ message: 'Error while logging printer changes: ' + error, status: 500 });
  }
};

const getArrayAttrs = (printer) => {
  try {
    let { hostname, ip, modelname, information, metadata } = printer;
    let { status, firmwareversion, partnumber, printertype, alerts } = information;
    let { alias, location, workteam, reservedby, reserveduntil, notes } = metadata;

    const printerAttrs = {
      hostname,
      ip,
      modelname,
      status,
      firmwareversion,
      partnumber,
      printertype,
      alerts,
      alias,
      location,
      workteam,
      reservedby,
      reserveduntil,
      notes,
    };

    return printerAttrs;
  } catch (error) {
    throw new Error({ message: 'Error while loggin printerg changes: ' + error, status: 500 });
  }
};

const getChanges = (oldAttrs, newAttrs) => {
  const changes = diff(oldAttrs, newAttrs);
  if (changes !== undefined) return getChangeFormated(changes);
  return null;
};

const getChangeFormated = (changeObject) => {
  let formatedChanges = ``;
  for (let change in changeObject) {
    if (changeObject[change].__old === '') formatedChanges += `[${change}]: new value:${changeObject[change].__new}`;
    else if (changeObject[change].__new === '')
      formatedChanges += `[${change}]: before:${changeObject[change].__old}, now: empty`;
    else formatedChanges += `[${change}]: before:${changeObject[change].__old}, now:${changeObject[change].__new}`;
  }
  return formatedChanges;
};

const printerDiff = { getPrinterDiff };
export default printerDiff;
