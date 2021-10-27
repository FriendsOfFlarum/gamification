export default (key, isBool = false) => {
  const val = app.data[`fof-gamification.${key}`];

  if (isBool) {
    return !!parseInt(val);
  }

  return val;
};
