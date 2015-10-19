# solve-3d

###*Stereoscopic OnLine Video Engine*###

#### Usage

Video player for .mp4 or .webm stereoscopic 3D videos. Supports playing local files or from URL.

Supported formats:
 * Side-by-side (right eye, left eye)
 * Side-by-side (left eye, right eye)
 * Top-bottom (right eye, left eye)
 * Top-bottom (left eye, right eye)

Video size
 * rendered at view resolution (each eye is squished)
 * rendered at 2x view resolution (each eye is native resolution) **TODO**

Playback options
 * Anaglyph (red-blue)
 * Interleaved
 * Left eye only
 * Right eye only
 * Whole video

Rendering
 * Attempts to use WebGL to render various stereo formats
 * If WebGL is unavailable, defaults back to Canvas 2D (does not support 'anaglyph' - too intensive)

#### Live Site

Use without downloading by visiting (http://www.mcs.anl.gov/~marrinan/solve-3d/)[http://www.mcs.anl.gov/~marrinan/solve-3d/]
