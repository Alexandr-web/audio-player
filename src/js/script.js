import songs from './songs';

const audioPlayer = () => {
  const activeSong = {
    name: '',
    url: '',
    el: ''
  };

  let volume = 1;
  let count = 0;
  let play = false;
  let mute = false;

  const showListSongs = () => {
    const options_icon = document.querySelector('.wrapper__header-block-list-item[data-option="menu"]');
    const block_list_songs = document.querySelector('.wrapper__main');

    options_icon.addEventListener('click', () => block_list_songs.classList.toggle('show'));
  }

  showListSongs();

  const createSongs = () => {
    const list = document.querySelector('.wrapper__main-list');

    songs.map((song, index) => {
      const item = `
      <li class="wrapper__main-list-item">
        <div class="wrapper__main-list-item-num">${index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
        <h3 class="wrapper__main-list-item-song-name">${song.name}</h3>
        <div class="wrapper__main-list-item-time"></div>
        <audio preload="metadata" src="" data-song-name="${song.name}">
      </li>
      `;

      list.innerHTML += item;
    });

    const time_songs = document.querySelectorAll('.wrapper__main-list-item-time');

    time_songs.forEach((time, idx) => {
      new Audio(songs[idx].url).addEventListener('loadedmetadata', function() {
        time.innerText = `${((this.duration / 60).toFixed(2)).replace(/\./, ':')} мин.`;
      });
    });
  }

  createSongs();

  const playSong = () => {
    const audios = document.querySelectorAll('.wrapper__main-list-item');

    audios.forEach((song, index) => {
      song.addEventListener('click', () => {
        count = index;

        stopMusic();
        playActiveMusic(index);
        setInfoOfActiveSong();
        controlPlayActiveSong();
      });
    });
  }

  playSong();

  const controlsActiveSong = () => {
    const controls_btns = document.querySelectorAll('.wrapper__header-block-info-song-duration-controls-list-item');

    controls_btns.forEach(btn => {
      const control = btn.dataset.controls;

      const setControls = (ctrl, func) => {
        if (control === ctrl) {
          btn.addEventListener('click', func); 
        }
      }

      setControls('prev-song-btn', () => {
        count++;

        checkCount();
        stopMusic();
        playActiveMusic(count);
        setInfoOfActiveSong();
        controlPlayActiveSong();
      });

      setControls('next-song-btn', () => {
        count--;

        checkCount();
        stopMusic();
        playActiveMusic(count);
        setInfoOfActiveSong();
        controlPlayActiveSong();
      });

      setControls('mute', e => {
        if (e.target.nodeName === 'IMG') {
          mute = !mute;

          checkMuteOfActiveSong();
          checkVolumeOfActiveSong();
        }
      });

      setControls('play', () => {
        play = !play;

        controlPlayActiveSong();
      });
    });
  }

  const changeVolumeOfActiveSong = () => {
    const range = document.querySelector('.wrapper__header-block-info-song-duration-controls-list-item-range');

    range.addEventListener('input', () => {
      volume = range.value / 100;

      setVolume();
    }); 
  }

  changeVolumeOfActiveSong();

  function setVolume() {
    activeSong.el.volume = volume;
  }

  function endSong() {
    activeSong.el.addEventListener('ended', () => {
      count++;

      checkCount();
      stopMusic();
      playActiveMusic(count);
      setInfoOfActiveSong();
    });
  }

  controlsActiveSong();

  function checkCount() {
    if (count > songs.length - 1) {
      count = 0;
    }

    if (count < 0) {
      count = songs.length - 1;
    }
  }

  function stopMusic() {
    const audios = document.querySelectorAll('.wrapper__main-list-item');

    audios.forEach(song => {
      [...song.childNodes].find(el => el.nodeName === 'AUDIO').src = '';
    });
  }

  function controlPlayActiveSong() {
    const img = document.querySelector('.wrapper__header-block-info-song-duration-controls-list-item[data-controls="play"] img');

    if (play) {
      activeSong.el.play();

      img.src = './images/pause.svg';
      img.alt = 'pause';
    } else {
      activeSong.el.pause();

      img.src = './images/play.svg';
      img.alt = 'play';
    }
  }

  function checkMuteOfActiveSong() {
    activeSong.el.muted = mute;
  }

  function playActiveMusic(num) {
    const audios = document.querySelectorAll('.wrapper__main-list-item');
    const audio = [...audios[num].childNodes].find(el => el.nodeName === 'AUDIO');

    play = true;

    audio.src = songs[num].url;
    audio.play();

    setActiveSong({ name: audio.dataset.songName, src: audio.src, el: audio });
    addBgToActiveSong(num);
    checkMuteOfActiveSong();
    endSong();
    checkVolumeOfActiveSong();
    setVolume();
  }

  function addBgToActiveSong(num) {
    const audios = document.querySelectorAll('.wrapper__main-list-item');
    const addActiveClass = index => audios[index].classList.add('active-song');
    const removeActiveClass = () => audios.forEach(song => song.classList.remove('active-song'));

    removeActiveClass();
    addActiveClass(num);
  }

  function setActiveSong(audio) {
    activeSong.name = audio.name;
    activeSong.url = audio.src;
    activeSong.el = audio.el;
  }

  function checkVolumeOfActiveSong() {
    const range = document.querySelector('.wrapper__header-block-info-song-duration-controls-list-item-range');

    if (mute) {
      range.value = 0;
    } else {
      range.value = volume * 100;
      setVolume();
    }
  }

  function setInfoOfActiveSong() {
    const active_song_name = document.querySelector('.wrapper__header-block-info-song-name');
    const block_range_duration = document.querySelector('.wrapper__header-block-info-song-duration-range');
    const active_song_duration = document.querySelector('.wrapper__header-block-info-song-duration-time');
    const range_duration = document.querySelector('.wrapper__header-block-info-song-duration-range-item');
    const { name, el } = activeSong;

    el.addEventListener('loadedmetadata', () => {
      active_song_name.innerText = name;
      
      el.addEventListener('timeupdate', () => {
        const width = Math.round((el.currentTime / el.duration) * 100);
        range_duration.style.width = `${width}%`;
      });
    });

    block_range_duration.addEventListener('click', e => {
      const width_block_range = block_range_duration.offsetWidth;
      const x_block_range = (e.layerX * 100) / width_block_range;

      el.currentTime = (x_block_range * el.duration) / 100;
    });
  }
}

audioPlayer();