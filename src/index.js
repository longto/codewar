function sortIt(alarm,time) {
  const mapDay = {
    'only once'        : [0,1,2,3,4,5,6],
    'every day'        : [0,1,2,3,4,5,6],
    'every workday'    : [1,2,3,4,5],
    'every sunday'     : [0],
    'every monday'     : [1],
    'every tuesday'    : [2],
    'every wednesday'  : [3],
    'every thursday'   : [4],
    'every friday'     : [5],
    'every saturday'   : [6],
  }
  const oneHour = 1000*60*60;
  const ondDay = 24*1000*60*60;
  const isBefore = (t1, t2) => {
    const [h1,m1] = t1.split(';');
    const [h2,m2] = t2.split(';');
    return h1===h2 && m1<=m2 || h1<h2;
  }
  const setTime = (d, time, offsetD=0) => {
    const [hour, minute] = time.split(';');
    d.setHours(hour);
    d.setMinutes(minute);
    return d.getTime()+offsetD*ondDay;
  }
  const findNearestTime = ({time, frequency}, ct) => {
    const current = new Date (Date.parse(ct));
    const cDay = current.getDay();
    const cTime = `${current.getHours()}:${current.getMinutes()}`;
    const possibleDay = mapDay[frequency];
    if (possibleDay.includes(cDay) && isBefore(cTime,time) ) {
      return setTime(current, time);
    } 
    for (let offsetD=1;offsetD<=7;offsetD++) {
      if (possibleDay.includes( (cDay+offsetD)%7 ) ) {
        return setTime(current, time, offsetD);
      }
    }
  }
  return alarm.map(a=>({
    ...a,
    nt : findNearestTime(a, time)
  }))
  .sort((a,b)=>
    a.nt - b.nt
  )
  .map(({name, time, frequency})=>({
    name, time, frequency
  }))
}