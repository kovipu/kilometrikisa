let database: Record<number, AthleteSession> = {};

export const getAthletes = (): AthleteSession[] => {
  return Object.values(database);
};

export const updateAthlete = (athlete: AthleteSession) => {
  database[athlete.id] = athlete;
};
