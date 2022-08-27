// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

import ILeaderboard from '../interfaces/ILeaderboard';

const getClassifications = {
  getOrderedClassifications: (leaderboard: ILeaderboard[]) => {
    const orderedClassification = leaderboard
      .sort((a, b) => {
        const sorted = b.totalPoints - a.totalPoints
          || b.totalVictories - a.totalVictories
          || b.goalsBalance - a.goalsBalance
          || b.goalsFavor - a.goalsFavor
          || b.goalsOwn - a.goalsOwn;

        return sorted;
      });

    return orderedClassification;
  },
};

export default getClassifications;
