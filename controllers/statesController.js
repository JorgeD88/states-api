const statesData = require('../models/statesData.json');
const State = require('../models/States');

const getStateData = (code) => {
    return statesData.find(state => state.code === code);
};

const mergeFunFacts = async (statesArray) => {
    const mongoStates = await State.find();

    return statesArray.map(state => {
        const stateObj = { ...state };

        const mongoState = mongoStates.find(item => item.stateCode === state.code);

        if (mongoState) {
            stateObj.funfacts = mongoState.funfacts;
        }

        return stateObj;
    });
};

const getAllStates = async (req, res) => {
    let states = [...statesData];

    if (req.query.contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    }

    if (req.query.contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const statesWithFunFacts = await mergeFunFacts(states);

    res.json(statesWithFunFacts);
};

const getState = async (req, res) => {
    const state = getStateData(req.code);
    const stateObj = { ...state };

    const mongoState = await State.findOne({ stateCode: req.code });

    if (mongoState) {
        stateObj.funfacts = mongoState.funfacts;
    }

    res.json(stateObj);
};

const getRandomFunFact = async (req, res) => {
    const state = getStateData(req.code);

    const stateFunFacts = await State.findOne({ stateCode: req.code });

    if (!stateFunFacts || !stateFunFacts.funfacts || stateFunFacts.funfacts.length === 0) {
        return res.json({
            message: `No fun facts found for ${state.state}`
        });
    }

    const randomFact = stateFunFacts.funfacts[
        Math.floor(Math.random() * stateFunFacts.funfacts.length)
    ];

    res.json({
        funfact: randomFact
    });
};

const createFunFacts = async (req, res) => {
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({
            message: 'State fun facts value required'
        });
    }

    if (!Array.isArray(funfacts)) {
        return res.status(400).json({
            message: 'State fun facts value must be an array'
        });
    }

    let stateFunFacts = await State.findOne({ stateCode: req.code });

    if (stateFunFacts) {
        stateFunFacts.funfacts = [
            ...stateFunFacts.funfacts,
            ...funfacts
        ];
    } else {
        stateFunFacts = new State({
            stateCode: req.code,
            funfacts: funfacts
        });
    }

    const result = await stateFunFacts.save();
    res.json(result);
};

const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const state = getStateData(req.code);

    if (!index) {
        return res.status(400).json({
            message: 'State fun fact index value required'
        });
    }

    if (!funfact) {
        return res.status(400).json({
            message: 'State fun fact value required'
        });
    }

    const stateFunFacts = await State.findOne({ stateCode: req.code });

    if (!stateFunFacts || !stateFunFacts.funfacts || stateFunFacts.funfacts.length === 0) {
        return res.status(400).json({
            message: `No fun facts found for ${state.state}`
        });
    }

    const adjustedIndex = index - 1;

    if (!stateFunFacts.funfacts[adjustedIndex]) {
        return res.status(400).json({
            message: `No fun fact found at that index for ${state.state}`
        });
    }

    stateFunFacts.funfacts[adjustedIndex] = funfact;

    const result = await stateFunFacts.save();
    res.json(result);
};

const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const state = getStateData(req.code);

    if (!index) {
        return res.status(400).json({
            message: 'State fun fact index value required'
        });
    }

    const stateFunFacts = await State.findOne({ stateCode: req.code });

    if (!stateFunFacts || !stateFunFacts.funfacts || stateFunFacts.funfacts.length === 0) {
        return res.status(400).json({
            message: `No fun facts found for ${state.state}`
        });
    }

    const adjustedIndex = index - 1;

    if (!stateFunFacts.funfacts[adjustedIndex]) {
        return res.status(400).json({
            message: `No fun fact found at that index for ${state.state}`
        });
    }

    stateFunFacts.funfacts = stateFunFacts.funfacts.filter((_, i) => i !== adjustedIndex);

    const result = await stateFunFacts.save();
    res.json(result);
};

const getCapital = (req, res) => {

    const state = getStateData(req.code);

    res.json({
        state: state.state,
        capital: state.capital_city
    });
};

const getNickname = (req, res) => {

    const state = getStateData(req.code);

    res.json({
        state: state.state,
        nickname: state.nickname
    });
};

const getPopulation = (req, res) => {

    const state = getStateData(req.code);

    res.json({
        state: state.state,
        population: state.population.toLocaleString('en-US')
    });
};

const getAdmission = (req, res) => {

    const state = getStateData(req.code);

    res.json({
        state: state.state,
        admitted: state.admission_date
    });
};

module.exports = {
    getAllStates,
    getState,
    getRandomFunFact,
    createFunFacts,
    updateFunFact,
    deleteFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
};