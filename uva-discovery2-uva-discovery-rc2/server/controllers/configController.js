import Configuration from '../models/configuration';
import discoveryController from '../controllers/discoveryController';

const getConfig = async (req, res, next) => {
  const config = await Configuration.findOne({});
  res.json(config);
};

const updateConfig = async (req, res, next) => {
  try {
    const filter = {};
    const update = req.body;
    const options = { new: true };
    const doc = await Configuration.findOneAndUpdate(filter, update, options);
    discoveryController.setUpdateInterval(doc.server.discovery.updateFrecuency);
    res.json(doc);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const configurationController = { updateConfig, getConfig };

export default configurationController;
