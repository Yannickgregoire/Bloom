# Bloom

## bookmarks

### 3d engine online

- threejs.org
- WebGL Raytracing: http://webraytracer.alexandra.dk/
- Realtime GLSL Pathtracing: https://geometrian.com/programming/webgl-pt/

### about json export for threejs

*NOTICE: The Blender exporter for the Three.js JSON format has been removed, to focus on better support for other workflows. For recommended alternatives, see Loading 3D Models. The Three.js Object/Scene JSON format is still fully supported for use with Object3D.toJSON, the Editor, THREE.ObjectLoader and converters.*

found here: https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender

therefore, going to: https://threejs.org/docs/#manual/en/introduction/Loading-3D-models

### blender -> glTF -> threejs

- https://www.electronicarmory.com/articles/exporting-blender-models-to-threejs-webgl/
- https://github.com/KhronosGroup/glTF-Blender-IO
- https://gltf-viewer.donmccurdy.com (to see the exported glTF)

out-of-the-box results:
- OK: meshes, camera (to be fixed), point lights, animations (to be fixed), textures
- NOT SURE: spot lights should be exported, but can not see where they are in gltf-viewer... -> investigate the loaded scene programmatically
- KO: directional lights, materials