import { readString } from 'react-papaparse';

export const getVlivePromise = async () => {
  const textCSV = require(`../assets/vlive/text.csv`);
  return new Promise((resolve, reject) => {
    readString(textCSV, {
      header: true,
      download: true,
      complete: (results, file) => {
        resolve(results.data);
      },
      error: (error, file) => {
        console.log('Error while parsing:', error, file);
      }
    });
  });
};
