const https = require('https');

// 嘗試不同的交易所前綴
const prefixes = ['tse', 'otc', 'esb'];
const exCh = prefixes.map(p => `${p}_7886.tw`).join('|');

const options = {
  hostname: 'mis.twse.com.tw',
  path: `/stock/api/getStockInfo.jsp?ex_ch=${exCh}&json=1&delay=0`,
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

console.log('Testing:', exCh);

https.get(options, (res) => {
  let data = '';
  res.on('data', (c) => { data += c; });
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('items:', j.msgArray ? j.msgArray.length : 0);
      if (j.msgArray) {
        j.msgArray.forEach((i) => {
          console.log(JSON.stringify({code: i.c, name: i.n, ex: i.ex, z: i.z, y: i.y, ch: i.ch}));
        });
      }
    } catch(e) {
      console.log('raw:', data.substring(0, 800));
    }
  });
});
