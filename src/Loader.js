/**
 * @author mrdoob / http://mrdoob.com/
 */
import * as THREE from 'three';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader.js';

var Loader = function () {
	var scope = this;
	this.texturePath = '';
	this.loadFiles = function (files, onLoad) {
		if (files.length > 0) {
			var filesMap = createFileMap(files);
			var manager = new THREE.LoadingManager();
			manager.setURLModifier(function (url) {
				var file = filesMap[url];
				if (file) {
					console.log('Loading', url);
					return URL.createObjectURL(file);
				}
				return url;
			});
			for (var i = 0; i < files.length; i++) {
				scope.loadFile(files[i], manager, onLoad);
			}
		}
	};

	this.loadFile = function (file, manager, onLoad) {
		var filename = file.name;
		var extension = filename.split('.').pop().toLowerCase();
		var reader = new FileReader();
		reader.addEventListener('progress', function (event) {
			var size = '(' + Math.floor(event.total / 1000) + ' KB)';
			var progress = Math.floor((event.loaded / event.total) * 100) + '%';
			console.log('Loading', filename, size, progress);
		});
		switch (extension) {
			case '3ds':
				reader.addEventListener('load', function (event) {
					var loader = new TDSLoader();
					var object = loader.parse(event.target.result);
					onLoad(object);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'amf':
				reader.addEventListener('load', function (event) {
					var loader = new AMFLoader();
					var amfobject = loader.parse(event.target.result);
					onLoad(amfobject);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'dae':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var loader = new ColladaLoader(manager);
					var collada = loader.parse(contents);
					collada.scene.name = filename;
					onLoad(collada.scene);
				}, false);
				reader.readAsText(file);
				break;

			case 'fbx':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var loader = new FBXLoader(manager);
					var object = loader.parse(contents);
					onLoad(object);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'glb':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath('../examples/js/libs/draco/gltf/');
					var loader = new GLTFLoader();
					loader.setDRACOLoader(dracoLoader);
					loader.parse(contents, '', function (result) {
						var scene = result.scene;
						scene.name = filename;
						onLoad(scene);
					});
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'gltf':

				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var loader;
					loader = new GLTFLoader(manager);
					loader.parse(contents, '', function (result) {
						var scene = result.scene;
						scene.name = filename;
						onLoad(scene);
					});
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'js':
			case 'json':
			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					// 2.0
					if (contents.indexOf('postMessage') !== -1) {
						var blob = new Blob([contents], {
							type: 'text/javascript'
						});
						var url = URL.createObjectURL(blob);
						var worker = new Worker(url);
						worker.onmessage = function (event) {
							event.data.metadata = {
								version: 2
							};
							handleJSON(event.data, file, filename);
						};
						worker.postMessage(Date.now());
						return;
					}
					// >= 3.0
					var data;
					try {
						data = JSON.parse(contents);
					} catch (error) {
						alert(error);
						return;
					}
					handleJSON(data, file, filename);
				}, false);
				reader.readAsText(file);
				break;

			case 'kmz':
				reader.addEventListener('load', function (event) {
					var loader = new KMZLoader();
					var collada = loader.parse(event.target.result);
					collada.scene.name = filename;
					onLoad(collada.scene);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'md2':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var geometry = new MD2Loader().parse(contents);
					var material = new THREE.MeshStandardMaterial({
						morphTargets: true,
						morphNormals: true
					});
					var mesh = new THREE.Mesh(geometry, material);
					mesh.mixer = new THREE.AnimationMixer(mesh);
					mesh.name = filename;
					onLoad(mesh);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'obj':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var object = new OBJLoader().parse(contents);
					object.name = filename;
					onLoad(object);
				}, false);
				reader.readAsText(file);
				break;

			case 'ply':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var geometry = new PLYLoader().parse(contents);
					geometry.sourceType = 'ply';
					geometry.sourceFile = file.name;
					var material = new THREE.MeshStandardMaterial();
					var mesh = new THREE.Mesh(geometry, material);
					mesh.name = filename;
					onLoad(mesh);
				}, false);
				reader.readAsArrayBuffer(file);
				break;

			case 'stl':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var geometry = new STLLoader().parse(contents);
					geometry.sourceType = 'stl';
					geometry.sourceFile = file.name;
					var material = new THREE.MeshStandardMaterial();
					var mesh = new THREE.Mesh(geometry, material);
					mesh.name = filename;
					onLoad(mesh);
				}, false);

				if (reader.readAsBinaryString !== undefined) {
					reader.readAsBinaryString(file);
				} else {
					reader.readAsArrayBuffer(file);
				}
				break;

			case 'svg':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var loader = new SVGLoader();
					var paths = loader.parse(contents).paths;
					var group = new THREE.Group();
					group.scale.multiplyScalar(0.1);
					group.scale.y *= -1;
					for (var i = 0; i < paths.length; i++) {
						var path = paths[i];
						var material = new THREE.MeshBasicMaterial({
							color: path.color,
							depthWrite: false
						});
						var shapes = path.toShapes(true);
						for (var j = 0; j < shapes.length; j++) {
							var shape = shapes[j];
							var geometry = new THREE.ShapeBufferGeometry(shape);
							var mesh = new THREE.Mesh(geometry, material);
							group.add(mesh);
						}
					}
					onLoad(group);
				}, false);
				reader.readAsText(file);
				break;

			case 'vtk':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var geometry = new VTKLoader().parse(contents);
					geometry.sourceType = 'vtk';
					geometry.sourceFile = file.name;
					var material = new THREE.MeshStandardMaterial();
					var mesh = new THREE.Mesh(geometry, material);
					mesh.name = filename;
					onLoad(mesh);
				}, false);
				reader.readAsText(file);
				break;

			case 'wrl':
				reader.addEventListener('load', function (event) {
					var contents = event.target.result;
					var result = new VRMLLoader().parse(contents);
					onLoad(result);
				}, false);
				reader.readAsText(file);
				break;

			case 'zip':
				reader.addEventListener('load', function (event) {
					handleZIP(event.target.result);
				}, false);
				reader.readAsBinaryString(file);
				break;

			default:
				// alert( 'Unsupported file format (' + extension +  ').' );
				break;
		}
	};

	function handleJSON(data, file, filename) {
		if (data.metadata === undefined) { // 2.0
			data.metadata = {
				type: 'Geometry'
			};
		}
		if (data.metadata.type === undefined) { // 3.0
			data.metadata.type = 'Geometry';
		}
		if (data.metadata.formatVersion !== undefined) {
			data.metadata.version = data.metadata.formatVersion;
		}

		switch (data.metadata.type.toLowerCase()) {

			case 'buffergeometry':
				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse(data);
				var mesh = new THREE.Mesh(result);
				onLoad(mesh);
				break;

			case 'geometry':
				console.error('Loader: "Geometry" is no longer supported.');
				break;

			case 'object':
				var loader = new THREE.ObjectLoader();
				loader.setResourcePath(scope.texturePath);
				var result = loader.parse(data);
				if (result.isScene) {
					onLoad(result);
				} else {
					onLoad(result);
				}
				break;

			case 'app':
				//editor.fromJSON(data);
				break;

		}

	}

	function createFileMap(files) {
		var map = {};
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			map[file.name] = file;
		}
		return map;
	}

	function handleZIP(contents) {
		var zip = new JSZip(contents);
		// Poly
		if (zip.files['model.obj'] && zip.files['materials.mtl']) {
			var materials = new MTLLoader().parse(zip.file('materials.mtl').asText());
			var object = new OBJLoader().setMaterials(materials).parse(zip.file('model.obj').asText());
			onLoad(object);
		}
		zip.filter(function (path, file) {
			var manager = new THREE.LoadingManager();
			manager.setURLModifier(function (url) {
				var file = zip.files[url];
				if (file) {
					console.log('Loading', url);
					var blob = new Blob([file.asArrayBuffer()], {
						type: 'application/octet-stream'
					});
					return URL.createObjectURL(blob);
				}
				return url;
			});
			var extension = file.name.split('.').pop().toLowerCase();
			switch (extension) {
				case 'fbx':
					var loader = new FBXLoader(manager);
					var object = loader.parse(file.asArrayBuffer());
					onLoad(object);
					break;

				case 'glb':
					var loader = new GLTFLoader();
					loader.parse(file.asArrayBuffer(), '', function (result) {
						var scene = result.scene;
						onLoad(scene);
					});
					break;

				case 'gltf':
					var loader = new GLTFLoader(manager);
					loader.parse(file.asText(), '', function (result) {
						var scene = result.scene;
						onLoad(scene);
					});
					break;

			}
		});
	}

	function isGLTF1(contents) {
		var resultContent;
		if (typeof contents === 'string') {
			// contents is a JSON string
			resultContent = contents;
		} else {
			var magic = THREE.LoaderUtils.decodeText(new Uint8Array(contents, 0, 4));
			if (magic === 'glTF') {
				// contents is a .glb file; extract the version
				var version = new DataView(contents).getUint32(4, true);
				return version < 2;
			} else {
				// contents is a .gltf file
				resultContent = THREE.LoaderUtils.decodeText(new Uint8Array(contents));
			}
		}
		var json = JSON.parse(resultContent);
		return (json.asset != undefined && json.asset.version[0] < 2);
	}
};

export { Loader };