import { readString } from 'react-papaparse';

export const getFrommData = async (arr, artistNum) => {
  if (arr === null) arr = [];
  const textCSV = require(`../assets/fromm/${artistNum}/text.csv`);
  readString(textCSV, {
    header: true,
    download: true,
    complete: (results, file) => {
      let dataCSV = results.data;
      // Get text data
      if (dataCSV && dataCSV.length > 0) {
        arr.push({ artistNum, data: dataCSV });
      }
    },
    error: (error, file) => {
      console.log('Error while parsing:', error, file);
    }
  });
  return arr;
};

export const getFrommPromise = async (artistNum) => {
  const textCSV = require(`../assets/fromm/${artistNum}/text.csv`);
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

export const getFabPromise = async (artistNum) => {
  const textCSV = require(`../assets/fab/${artistNum}/text.csv`);
  return new Promise((resolve, reject) => {
    readString(textCSV, {
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
