# solve-3d

###*Stereoscopic OnLine Video Engine*###

#### Usage

Video player for MP4 (.mp4) or WEBM (.webm) stereoscopic 3D videos. Also can be used to view JPEG (.jpg, .jps) and PNG (.png, .pns) stereoscopic 3D images. Supports local files or from URL.

Supported formats:
 * Side-by-side (right eye, left eye)
 * Side-by-side (left eye, right eye)
 * Top-bottom (right eye, left eye)
 * Top-bottom (left eye, right eye)

Supported video sizes
 * Saved at native video resolution (image for each eye is squished)
 * Saved at 2x native video resolution (image for each eye is native resolution)

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

Use without downloading by visiting [http://web.alcf.anl.gov/~marrinan/solve-3d/](http://web.alcf.anl.gov/~marrinan/solve-3d/)
