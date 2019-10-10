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

  //console.log("Test -> Pr:" + Pr + " / Cr:" + Cr);
  var result = 0;
  
  for (let i = 1; i < 50; i++) {
    let R = (Pr * i) / Cr;
    // console.log('Ratio: ' + R + ' i: ' + i);
    if(R % 1 === 0) {
      console.log("Test -> Pr:" + Pr + " / Cr:" + Cr + ' Result -> N:' + i + ' / M:' + R);
      result = 1;
      
      break;
    }
  }
  
  return result;
}

function getRandomCircs(i) {
  const max = 9999;
  let results = 0;
  let index = 0;
  
  while (results < i && index < max) {
    results += getRandomCirc();
  console.log(index);
    index++;
  }
}

