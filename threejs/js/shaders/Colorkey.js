/**
 * @author frankiezafe / http://polymorph.cool
 *
 * Colorkey shader
 * see https://forum.unity.com/threads/chroma-key-shader.48938/#post-771229
 */

THREE.ColorkeyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"colorkey": { value: new THREE.Vector3( 0, 1, 1 ) },
		"threshold": { value: 0.3 }

	},

	vertexShader: [
		"uniform vec3 colorkey;",
		"varying vec2 vUv;",
		"varying vec3 norm_ckey;",
		"void main() {",
			"vUv = uv;",
			"norm_ckey = colorkey / dot(colorkey, vec3(0.22, 0.707, 0.071));",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),

	fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform float threshold;",
		"varying vec2 vUv;",
		"varying vec3 norm_ckey;",
		"void main() {",
			"vec4 color = texture2D( tDiffuse, vUv );",
			"vec3 norm_color = color.rgb / dot(color.rgb, vec3(0.22, 0.707, 0.071));",
			"float a = distance( norm_color, norm_ckey );",
			"if ( a <= threshold ) { a = 0.0; } else { a = 1.0; }",
			"gl_FragColor = vec4( color.rgb, a );",
			"//gl_FragColor.rgb = mulRGB * pow( ( gl_FragColor.rgb + addRGB ), powRGB );",
		"}"
	].join( "\n" )

};