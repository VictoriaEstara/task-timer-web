class CountdownTimer {
    // Saya adalah Constructor
    constructor(timerDisplayId = 'timer-display') {
        //Property yang digunakan
        this._totalTime = 0;
        this._currentTime = 0;
        this._timerInterval = null;
        this._audio = new Audio('ringtone.mp3');
        this._timerDisplayId = timerDisplayId;
        this._hoursInput = document.getElementById('hours');
        this._minutesInput = document.getElementById('minutes');
        this._secondsInput = document.getElementById('seconds');
        this._timerDisplay = document.getElementById(timerDisplayId);
        this._color = {
            darkOrange: '#ff4500',
            orange: '#e69500',
            default: 'yellow'
        };
    }

    // Getter dan setter (encapsulation) untuk timerDisplayId
    get timerDisplayId() {
        return this._timerDisplayId;
    }

    set timerDisplayId(value) {
        this._timerDisplayId = value;
        this._timerDisplay = document.getElementById(value);
    }

    // Method untuk mengatur total waktu pada timer
    setTotalTime(hours, minutes, seconds) {
        this._totalTime = hours * 3600 + minutes * 60 + seconds;
        this._currentTime = this._totalTime;
    }

    // Method untuk memulai timer dengan menggunakan setInterval
    start() {
        if (!this._timerInterval && this._totalTime > 0) {
            this._timerInterval = setInterval(() => {
                this.updateDisplayWithAnimationFrame();
                if (this._currentTime === 0) {
                    this.pause();
                    this.playAlarm();
                } else {
                    this._currentTime--;
                }
            }, 1000);
        }
    }

    // Method untuk menghentikan timer (pause-lah y)
    pause() {
        clearInterval(this._timerInterval);
        this._timerInterval = null;
    }

    // Method untuk mereset timer (restart-gitu loh)
    reset() {
        this._currentTime = this._totalTime;
        this.pause();
        this.updateDisplay();
    }

    // Method untuk memperbarui tampilan timer
    updateDisplay() {
        const hours = Math.floor(this._currentTime / 3600);
        const minutes = Math.floor((this._currentTime % 3600) / 60);
        const seconds = this._currentTime % 60;

        const formattedHours = hours === 0 ? 12 : hours;
        const formattedTime = this.formatTime(hours, minutes, seconds);
        this._timerDisplay.innerText = formattedTime;
        this.updateDisplayColor();
    }

    // Method untuk memperbarui warna tampilan berdasarkan waktu
    updateDisplayColor() {
        const percentage = (this._currentTime / this._totalTime) * 100;

        if (percentage <= 10) {
            this._timerDisplay.style.color = this._color.darkOrange;
        } else if (percentage <= 30) {
            this._timerDisplay.style.color = this._color.orange;
        } else {
            this._timerDisplay.style.color = this._color.default;
        }
    }

    // Method untuk memformat waktu dalam format hh:mm:ss
    formatTime(hours, minutes, seconds) {
        return (
            String(hours).padStart(2, '0') +
            ':' +
            String(minutes).padStart(2, '0') +
            ':' +
            String(seconds).padStart(2, '0')
        );
    }

    // Method untuk memperbarui tampilan dengan menggunakan requestAnimationFrame
    updateDisplayWithAnimationFrame() {
        requestAnimationFrame(() => {
            this.updateDisplay();
            this.updateDisplayColor();
        });
    }

    // Method untuk memutar ringtone
    playAlarm() {
        this._audio.loop = true;
        this._audio.play();

        // After 5 detik, menampilkan alert, stop audio, reset nilai input
        setTimeout(() => {
            alert('Time is up!');
            this._audio.pause();
            this._audio.currentTime = 0;

            this._hoursInput.value = '0';
            this._minutesInput.value = '0';
            this._secondsInput.value = '0';
        }, 5000);
    }
}

class ExtendedCountdownTimer extends CountdownTimer {
    // Saya adalah Constructor yang dapat memanggil constructor dari CountdownTimer
    constructor() {
        // Property yang digunakan
        super();
        this._onStartCallback = null;
        this._onPauseCallback = null;
        this._onFinishCallback = null;
        this._isPaused = false;
    }

    // Getter dan setter (encapsulation) untuk status pause
    get isPaused() {
        return this._isPaused;
    }

    set isPaused(value) {
        this._isPaused = value;
    }

    // Method untuk memanggil callback saat digunakan pada fungsi
    callCallback(callback) {
        if (typeof callback === 'function') {
            callback();
        }
    }

    // Method yang dipanggil ketika timer dimulai
    onStart() {
        this.callCallback(this._onStartCallback);
    }

    // Method yang dipanggil ketika timer di-pause
    onPause() {
        this.callCallback(this._onPauseCallback);
    }

    // Method yang dipanggil ketika timer selesai
    onFinish() {
        this.callCallback(this._onFinishCallback);
    }

    // Method untuk memulai timer yang memanggil onStart dan super.start()
    start() {
        this.onStart();
        super.start();
    }

    // Method untuk melakukan pause pada timer
    pause() {
        if (!this._isPaused) {
            this.onPause();
            super.pause();
            this._isPaused = true;
        } else {
            this.onStart();
            super.start();
            this._isPaused = false;
        }
    }

    // Method yang dipanggil ketika alarm diputar
    playAlarm() {
        super.playAlarm();
        this.onFinish();
    }
}

// Objek dari class CountdownTimer
const timer = new CountdownTimer();
// Objek dari class ExtendedCountdownTimer
const extendedTimer = new ExtendedCountdownTimer();

// Mengatur callback pada class extendedTimer
extendedTimer.onStartCallback = () => {
    console.log('Waktu dimulai!');
};

extendedTimer.onPauseCallback = () => {
    console.log('Waktu dijeda!');
};

extendedTimer.onFinishCallback = () => {
    console.log('Waktu telah habis!');
};

// Fungsi untuk memulai timer
function startTimer() {
    const hoursInput = extendedTimer._hoursInput.value;
    const minutesInput = extendedTimer._minutesInput.value;
    const secondsInput = extendedTimer._secondsInput.value;
    extendedTimer.setTotalTime(
        parseInt(hoursInput, 10),
        parseInt(minutesInput, 10),
        parseInt(secondsInput, 10)
    );
    extendedTimer.start();
}

// Fungsi untuk mem-pause timer
function pauseTimer() {
    extendedTimer.pause();
}

// Fungsi untuk me-reset timer
function resetTimer() {
    extendedTimer.reset();
}
