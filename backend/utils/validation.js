const kleTechEmailPattern = /^[^\s@]+@kletech\.ac\.in$/i;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isKleTechEmail = (email) => kleTechEmailPattern.test(String(email || '').trim());

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

module.exports = {
  isKleTechEmail,
  normalizeEmail,
  parsePositiveInteger
};