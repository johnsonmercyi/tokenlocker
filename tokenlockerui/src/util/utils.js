export const isSameObject = (oldData, newData) => {
  for (const key in newData) {
    if (oldData.hasOwnProperty(key)) {
      if (oldData[key] !== newData[key]) {
        return false;
      }
    }
  }
  return true;
}

export const isExistsInLocalStorage = (key) => {
  return localStorage.getItem(key);
}

export const addToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const updateLocalStorage = (key, value) => {
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(value));
}

export const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));;
}

export const getRemainingAndElapseDays = (lockdownDate, lockdownPeriod) => {


  // Convert Solidity timestamp to JavaScript Date object
  const ldDate = new Date(lockdownDate);

  // Calculate remaining and elapsed days based on lockdownPeriod
  const currentDate = new Date();
  const lockedUntilDate = new Date(ldDate.getTime() + Number(lockdownPeriod) * 1000);

  // Calculate remaining and elapsed days
  const remainingDays = Math.max(0, Math.ceil((lockedUntilDate - currentDate) / (24 * 60 * 60 * 1000)));
  const elapsedDays = Math.max(0, Math.floor((currentDate - ldDate) / (24 * 60 * 60 * 1000)));

  return { remainingDays, elapsedDays }
}

export const intlDateFormat = (dateString) => {
  const inputDate = new Date(dateString);

  const day = inputDate.getDate();
  const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(inputDate);

  const dayWithOrdinal = day + getOrdinal(day);

  const date = `${dayWithOrdinal} ${monthYear}`.split(" ");

  return {
    day: date[0],
    month: date[1],
    year: date[2]
  };

}

export const usNumberFormat = (number) => {
  return Number(number).toLocaleString('en-US');
}

function getOrdinal(number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}