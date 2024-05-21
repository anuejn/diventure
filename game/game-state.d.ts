interface GameState {
    mapNextLocation?: string;
    hasLocksmithHint?: boolean;
    experiencedLocksmithFail?: boolean;
    triedDumpsterDiving?: boolean;
    partyOver?: boolean;
}