const sounds = import.meta.glob("../../game/sounds/*", {
  query: "?url",
  import: "default",
});

export class Sound {
  source: AudioBufferSourceNode | undefined;
  gain: GainNode;
  bufferPromise: Promise<AudioBuffer>;
  id: string;
  loop = false;
  playing = false;

  constructor(file: string, id: string) {
    this.id = id;

    this.gain = game.audioContext.createGain();
    this.gain.connect(game.audioContext.destination);

    const sound = Object.keys(sounds).find(
      (x) => x.replace(/\.[^/.]+$/, "") == `../../game/sounds/${file}`,
    );
    if (!sound) throw Error(`sound '${file}' not found`);

    this.bufferPromise = sounds[sound]()
      .then((url) => fetch(url as string))
      .then((fetchResult) => fetchResult.arrayBuffer())
      .then((arrayBuffer) => game.audioContext.decodeAudioData(arrayBuffer));
  }

  setVolume(volume: number): Sound {
    this.gain.gain.setValueAtTime(volume, game.audioContext.currentTime);
    return this;
  }

  setLoop(doLoop?: boolean): Sound {
    this.loop = doLoop || true;
    return this;
  }

  async play(shouldPlay?: boolean) {
    if (shouldPlay == false) {
      this.source?.stop();
    } else if (!this.playing) {
      this.source = game.audioContext.createBufferSource();
      this.source.connect(this.gain);

      this.source.buffer = await this.bufferPromise;
      this.source.loop = this.loop;

      this.source.onended = () => {
        this.playing = false;
      };
      this.source.start();
      this.playing = true;
    }
    return this;
  }

  async pause() {
    await this.play(false);
  }
}
