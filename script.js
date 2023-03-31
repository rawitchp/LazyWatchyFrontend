const currentTime = document.querySelector('h1'),
  content = document.querySelector('.content'),
  selectMenu = document.querySelectorAll('select'),
  setAlarmBtn = document.querySelector('button'),
  list = document.querySelector('.alarm-list'),
  delBtn = document.querySelector('.close');

let alarmTime,
  isAlarmSet,
  ringtone = new Audio('./files/ringtone.mp3'),
  alarmList = [];
newElement();
for (let i = 23; i >= 0; i--) {
  i = i < 10 ? `0${i}` : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[0].firstElementChild.insertAdjacentHTML('afterend', option);
}

for (let i = 59; i >= 0; i--) {
  i = i < 10 ? `0${i}` : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[1].firstElementChild.insertAdjacentHTML('afterend', option);
}

setInterval(() => {
  let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  h = h == 0 ? (h = 0) : h;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  currentTime.innerText = `${h}:${m}:${s}`;
});

async function newElement() {
  list.innerHTML = '';
  let Data = await fetch('https://lovely-blue-slip.cyclic.app/api/time').then(
    (response) => response.json()
  );
  console.log(Data.length);
  if (Data.length === 0) {
    return;
  }
  console.log(typeof Data);
  for (data of Data) {
    var div = document.createElement('div');
    var inputValue = data.time;
    var t = document.createTextNode(data.time);
    div.appendChild(t);
    div.className = 'time';
    if (inputValue === '') {
      alert('You must write something!');
    } else {
      list.appendChild(div);
    }
    var button = document.createElement('BUTTON');
    var txt = document.createTextNode('\u00D7');
    button.className = 'close';
    button.value = `${data._id}`;
    button.appendChild(txt);
    div.appendChild(button);
    button.addEventListener('click', async function (event) {
      const clickedElem = event.target; // This is the element that fired the click.
      if (clickedElem.classList.contains('close')) {
        const index = clickedElem.value; // The index in the array.
        // console.log(index);
        await fetch(`https://lovely-blue-slip.cyclic.app/api/del/${index}`, {
          method: 'DELETE',
        }).then(() => console.log('deleted'));
        newElement();
      }
    });
    console.log(data);
  }
  console.log(Data[0].time);
}

async function setAlarm() {
  if (isAlarmSet) {
    alarmTime = '';
    ringtone.pause();
    content.classList.remove('disable');
    setAlarmBtn.innerText = 'Set Alarm';
    isAlarmSet = false;
    // Delete the alarm from the database
    await Alarm.deleteMany({});
  } else {
    let time = `${selectMenu[0].value}:${selectMenu[1].value}`;
    if (time.includes('Hour') || time.includes('Minute')) {
      return alert('Please, select a valid time to set Alarm!');
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://lovely-blue-slip.cyclic.app/api/saveAlarm', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(
      JSON.stringify({
        time: time,
      })
    );
    // alarmTime = time;
    // isAlarmSet = true;
    // content.classList.add("disable");
    // setAlarmBtn.innerText = "Clear Alarm";
    // // Save the alarm to the database
    // await Alarm.create({ time });
    console.log('added');
    alarmList.push(time);
    alarmList.sort();
    newElement();
    console.log(alarmList);
  }
}

setAlarmBtn.addEventListener('click', setAlarm);
