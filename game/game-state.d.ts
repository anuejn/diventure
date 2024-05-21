interface GameState {
    mapNextLocation?: string;

    // prognress of the game (roughly in order)
    partyOver?: boolean;
    triedDumpsterDiving?: boolean;
    hasLocksmithHint?: boolean;
    experiencedLocksmithFail?: boolean;
    wasDumpsterDiving?: boolean;
}