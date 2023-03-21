const maxNumber = 100;
export const getRandomPerson: (num?: number) => number = (num) => {
  const personNumber = Math.floor(Math.random() * maxNumber);
  if (personNumber !== num) return personNumber;
  return getRandomPerson(personNumber);
};

export const getOptionsForVote: () => Array<number> = () => {
  const firstId = getRandomPerson();
  const secondId = getRandomPerson(firstId);
  return [firstId, secondId];
};
