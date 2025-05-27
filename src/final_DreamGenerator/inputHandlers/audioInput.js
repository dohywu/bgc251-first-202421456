let mic, fft;

export function startMicInput() {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}

export function getSoundMood() {
  let spectrum = fft.analyze();
  let volume = mic.getLevel();
  let energy = fft.getEnergy('mid') / 255;

  return {
    volume: volume,
    energy: energy,
  };
}
