export default (key, isBool = false) => {
    const val = app.data[`fof-gamification.${key}`];

    if (isBool) {
        return !!Number(val);
    }

    return val;
};
