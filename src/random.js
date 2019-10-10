function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomCirc() {
  const PMin = 100;
  const PMax = 401;

  const CMin = 50;
  const CMax = 301;

  let Pr = getRandomInt(PMin, PMax);
  let Cr = getRandomInt(CMin, CMax);

  var result = false;
  
  for (let i = 1; i < 50; i++) {
    let R = (Pr * i) / Cr;

    if(R % 1 === 0) {
 + i + ' / M:' + R);
      result = {
        Pr: Pr,
        Cr: Cr,
        N: i,
        M: R
      };
      
      break;
    }
  }
  
  return result;
}

function getRandomCircs(i) {
  const max = 9999;
  let results = [];
  let index = 0;
  
  while (results.length < i && index < max) {
    result = getRandomCirc();
    if (result !== false) {
        results.push(result);
    }
    index++;
  }
  
  return results;
}

