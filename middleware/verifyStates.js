const statesData = require('../models/statesData.json');

const verifyStates = (req, res, next) => {
    const stateCodes = statesData.map(state => state.code);
    const stateCode = req.params.state.toUpperCase();

    if (!stateCodes.includes(stateCode)) {
        return res.status(400).json({
            message: 'Invalid state abbreviation parameter'
        });
    }

    req.code = stateCode;
    next();
};

module.exports = verifyStates;