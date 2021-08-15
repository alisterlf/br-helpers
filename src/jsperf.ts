'20590301000120'.split('').reduce((acc, digit, idx, array) => {
  const result = `${acc}${digit}`;
  if (idx !== array.length - 1) {
    if (idx === 1 || idx === 4) {
      return `${result}.`;
    }
    if (idx === 7) {
      return `${result}/`;
    }
    if (idx === 11) {
      return `${result}-`;
    }
  }
  return result;
}, '');
'20590301000120'.split('').reduce((acc, digit, idx, array) => {
  const result = `${acc}${digit}`;
  if (idx === array.length - 1) return result;
  if (idx === 1 || idx === 4) {
    return `${result}.`;
  }
  if (idx === 7) {
    return `${result}/`;
  }
  if (idx === 11) {
    return `${result}-`;
  }
}, '');
'20590301000120'.split('').reduce((acc, digit, idx, array) => {
  const result = `${acc}${digit}`;
  if (idx === 1 || idx === 4) {
    return `${result}.`;
  }
  if (idx === 7) {
    return `${result}/`;
  }
  if (idx === 11) {
    return `${result}-`;
  }
  return result;
}, '');
'20590301000120'.split('').reduce((acc, digit, idx, array) => {
  const result = `${acc}${digit}`;
  if (idx === array.length - 1) return result;
  switch (idx) {
    case 1:
    case 4:
      return `${result}.`;
    case 7:
      return `${result}/`;
    case 11:
      return `${result}-`;
    default:
      return result;
  }
}, '');
'20590301000120'.split('').reduce((acc, digit, idx, array) => {
  const result = `${acc}${digit}`;
  switch (idx) {
    case 1:
    case 4:
      return `${result}.`;
    case 7:
      return `${result}/`;
    case 11:
      return `${result}-`;
    default:
      return result;
  }
}, '');
'20590301000120'.split('').reduce((acc, digit, idx) => {
  let punctuation = '';
  switch (idx) {
    case 1:
    case 4:
      punctuation = '.';
      break;
    case 7:
      punctuation = '/';
      break;
    case 11:
      punctuation = '-';
      break;
    default:
      break;
  }
  return `${acc}${digit}${punctuation}`;
}, '');
'20590301000120'.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
