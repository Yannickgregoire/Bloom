/**
 * @author frankiezafe / http://polymorph.cool
 *
 * Colorkey pass
 */

THREE.ColorkeyPass = function ( dt_size ) {

	THREE.Pass.call( this );

	if ( THREE.ColorkeyShader === undefined ) console.error( "THREE.ColorkeyPass relies on THREE.Colorkey" );

	var shader = THREE.ColorkeyShader;
	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	if ( dt_size == undefined ) dt_size = 64;

	this.material = new THREE.ShaderMaterial( {
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} );

	this.fsQuad = new THREE.Pass.FullScreenQuad( this.material );

};

THREE.ColorkeyPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ColorkeyPass,

	render: function ( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear();
			this.fsQuad.render( renderer );

		}

	},
	
	set_color( r, g, b ) {
		this.uniforms[ 'colorkey' ].value = new THREE.Vector3( r, g, b );
	},
	
	set_threshold( t ) {
		this.uniforms[ 'threshold' ].value = t;
	}

} );
