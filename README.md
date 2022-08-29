# Web metronome
A web metronome built using the Web Audio API. The core approach to scheduling audio is taken from Chris Wilson's [A tale of two clocks](https://web.dev/audio-scheduling/) article, with some modifications to accomodate extra features. 

The metronome has a **speed trainer mode** that automatically increases the tempo by a set step after a selected amount of bars elapses
until it reaches the destination tempo. 

It also has a **tap tempo** feature that allows the user to rhythmically click a button to set the tempo. This feature keeps track of the user's last 4 clicks, and uses the average time elapsed between clicks to calculate and set the tempo. 

This metronome works well for tempos that are within reason, and it also has some headroom for tempos that are a little bit outside of reason.

However, it might behave unexpectedly if the user inputs extreme values, and it currently has no checks to limit the minimum / maximum tempo it will attempt to play.
