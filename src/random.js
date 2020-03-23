function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomCirc() {
    const PMin = 50;
    const PMax = 401;
    const CMin = 50;
    const CMax = 301;

    let Pr = getRandomInt(PMin, PMax);
    let Cr = getRandomInt(CMin, CMax);
    let result = false;

    for (let i = 1; i < 50; i++) {
        let R = (Pr * i) / Cr;

        if(R % 1 === 0) {
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

function getRandomCircs(count) {
    const max = 9999;
    let results = [];
    let index = 0;

    while (results.length < count && index < max) {
        let result = getRandomCirc();
        if (result !== false) {
            results.push(result);
        }
        index++;
    }

    return results;
}

function getChainedCircs(circs) {
    let chains = [];
    for(let i = 0; i < circs.length; i++) {
        for(let j = 0; j < circs.length; j++) {
            if(i !== j) {
                if (circs[i].Cr === circs[j].Pr) {
                    let chain = {
                        a: circs[i].Pr,
                        b: circs[i].Cr,
                        c: circs[j].Cr
                    };
                    chains.push(chain);
                }
            }
        }
    }

    return chains;
}
