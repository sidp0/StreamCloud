import StreamCloud from '../client/StreamCloud';

describe('StreamCloud', () => {
  // Initial, unmodified body.
  document.body.innerHTML =
  `
  <div id="appContainer">
    <div class="bar-row">
      <i class="material-icons md-48" id="back">swap_horiz</i>
      <h2 id="trackTitle"></h2>
      <i class="material-icons md-48" id="queue">list</i>
    </div>
    <div id="queueContainer">
    </div>
    <div id="titleContainer">
      <h1>Stream<strong>Cloud</strong></h1>
    </div>
    <div id="searchContainer">
      <input id="searchBox" type="text" name="track" placeholder="Search for tracks">
      <input id="submitSearch" type="submit" value="Search">
    </div>
    <div id="trackContainer">
    </div>
    <div id="playerContainer">
      <i id="backTrack" class="material-icons md-48">fast_rewind</i>
      <i id="playButton" class="material-icons md-48">play_arrow</i>
      <i id="pauseButton" class="material-icons md-48">pause</i>
      <i id="skipTrack" class="material-icons md-48">fast_forward</i>
    </div>
  </div>
  `

  const testTrack = {
    title: 'test',
    id: '123',
    user: {
      username: 'test123'
    }
  }

  const realTrack = {
    id: "214439881",
    title: "Raincoats (MUSIC VIDEO IN DESCRIPTION)"
  }

  const S = new StreamCloud();

  it('initializes', () => {
    expect(S.init()).toBeTruthy();
  });

  it('appends tracks to the DOM', () => {
    S.appendTracks([testTrack]);
    expect(S.trackContainer.innerHTML).toBeTruthy();
  });

  it('appends Notices to the DOM', () => {
    S.appendNotice('test');
    expect(S.trackContainer.innerHTML).toBeTruthy();
  });

  it('enqueues a track', () => {
    S.enqueue(testTrack);
    expect(S.queue).toBeTruthy();
  });

  it('dequeues a track', () => {
    S.queue.push(testTrack);
    let track = S.dequeue();
    expect(track).toBeTruthy();
  });

  it('pushes previous tracks onto stack', () => {
    S.pushToPrevious(testTrack);
    expect(S.previousTracks).toBeTruthy();
  });

  it('shows the tracks screen', () => {
    S.showTracks();
    expect(S.titleContainer.style.display).toBe('none');
    expect(S.queueContainer.style.display).toBe('none');
    expect(S.searchContainer.style.display).toBe('none');
    expect(S.trackContainer.style.display).toBe('flex');
    expect(S.appContainer.style.justifyContent).toBe('flex-end');
    expect(S.queueShowing).toBeFalsy();
    expect(S.currentScreen).toBe('tracks');
  });

  it('shows the search screen', () => {
    S.showSearch();
    expect(S.trackContainer.style.display).toBe('none');
    expect(S.queueContainer.style.display).toBe('none');
    expect(S.titleContainer.style.display).toBe('flex');
    expect(S.searchContainer.style.display).toBe('flex');
    expect(S.appContainer.style.justifyContent).toBe('center');
    expect(S.queueShowing).toBeFalsy();
    expect(S.currentScreen).toBe('search');
  });

  it('toggle the queue view', () => {
    S.queue = [];
    S.queue.push(testTrack);
    S.toggleQueueContainer();
    expect(S.queueContainer.innerHTML).toBeTruthy();
    S.toggleQueueContainer();
    expect(S.queueContainer.style.display).toBe('none');

  });

  it('toggles player controls', () => {
    S.toggleControls(true);
    expect(S.playerContainer.style.display).not.toBe('none');
    S.toggleControls(false);
    expect(S.playerContainer.style.display).toBe('none');
  });

  it('starts a player', () => {
    let player = S.startPlayer('test');
    expect(player).toBeTruthy();
  });

  it('streams a track', async () => {
    S.currentPlayer = null;

    // Will log warning about not being able to stream from SC.
    // Request could probably be mocked for speed.
    await S.immediateStream(realTrack);
    expect(S.currentPlayer).toBeTruthy();
    expect(S.currentTrack).toBe(realTrack);
    expect(S.playerContainer.innerHTML).not.toBe('none');
  });

  it('skips a track', () => {
    S.queue.push(realTrack);
    S.currentTrack = testTrack;
    S.skipTrack();

    expect(S.previousTracks.includes(testTrack)).toBeTruthy();
  });

  it('back tracks', () => {
    S.currentTrack = realTrack;
    S.queue = [];
    S.backTrack();

    expect(S.queue[0]).toBe(S.currentTrack);

  });
});
