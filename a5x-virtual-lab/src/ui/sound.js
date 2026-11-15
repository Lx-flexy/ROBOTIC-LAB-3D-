/**
 * ui/sound.js — Ambient sound toggle (off by default)
 */
export function createSoundToggle() {
  const btn = document.getElementById('sound-toggle');
  if (!btn) return;

  let audioCtx = null;
  let playing = false;
  let gainNode = null;
  let source = null;

  // Create subtle ambient hum using Web Audio API oscillator
  function startAmbient() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.03; // very quiet

    // Low frequency ambient hum
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 80;
    osc1.connect(gainNode);
    osc1.start();

    // Subtle high tone (fluorescent light buzz)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 120;
    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.01;
    osc2.connect(gain2);
    gain2.connect(gainNode);
    osc2.start();

    gainNode.connect(audioCtx.destination);
    source = { osc1, osc2 };
  }

  function stopAmbient() {
    if (source) {
      source.osc1.stop();
      source.osc2.stop();
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    source = null;
  }

  btn.addEventListener('click', () => {
    playing = !playing;
    btn.textContent = playing ? '🔊' : '🔇';
    btn.classList.toggle('on', playing);
    if (playing) startAmbient();
    else stopAmbient();
  });
}
