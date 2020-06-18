<script>
  const coefficient = .005;
  const rotationRadius = 3;
  const roadLenght = 100;
  const roads = Array(roadLenght);

  let frameCounter = 0;
  let roadPosition = -30;
  let cameraPosition = `0 2 ${rotationRadius}`;
  let cameraRotation = '-30 0 0';

  function update() {
    cameraPosition = `${Math.sin(frameCounter * coefficient) * rotationRadius} 2 ${Math.cos(frameCounter * coefficient) * rotationRadius}}`;
    cameraRotation = `-30 ${frameCounter * coefficient * 180 / Math.PI} 0`;
    frameCounter++;
    roadPosition += coefficient * 5;

    if (roadPosition > 30) {
      roadPosition = -30;
    }
  }

  setInterval(update, 10);
</script>

<main>

  <a href="https://www.acronis.com/en-us/lp/cyberfit/" class="link">Protect yourself with #CyberFit 👨‍💻</a>
	<a-scene>

    <a-entity position=".7 -.12 -1.85" rotation="0 -90 0" gltf-model="url(./cybertruck.glb)">
      <a-image position="1.32 .7 .8" src="logo.gif" width="1.2" height=".3" rotation="0 -90 0"></a-image>
      <a-image position="2.37 .7 .8" src="logo.gif" width="1.2" height=".3" rotation="0 90 0"></a-image>
      <a-text position="2.22 1.06 -.5" value="#CyberFit" color="#fff" line-height="50" rotation="-80 180 0" scale=".7 .7 .7"></a-text>
      <a-text position="1.5 .99 1.8" value="#CyberFit" color="#fff" line-height="50" rotation="-70 0 0" scale=".7 .7 .7"></a-text>

      <a-entity position="2.38 0.385 1.85" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true">
        <a-entity position="0 -.285 0" rotation="0 0 0" gltf-model="url(./wheel.glb)"></a-entity>
      </a-entity>
      <a-entity position="2.38 0.385 -.28" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true">
        <a-entity position="0 -.285 0" rotation="0 0 0" gltf-model="url(./wheel.glb)"></a-entity>
      </a-entity>
      <a-entity position="1.3 0.385 1.85" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true">
        <a-entity position="0 -.285 0" rotation="0 180 0" gltf-model="url(./wheel.glb)"></a-entity>
      </a-entity>
      <a-entity position="1.3 0.385 -.28" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true">
        <a-entity position="0 -.285 0" rotation="0 180 0" gltf-model="url(./wheel.glb)"></a-entity>
      </a-entity>

      <a-entity light="type: point; intensity: 2; distance: 5; decay: 1; color: #F00;"
          position="2 .9 -1"></a-entity>
      <a-entity light="type: point; intensity: 4; distance: 5; decay: 1; color: #FFF;"
          position="2 .5 3"></a-entity>

    </a-entity>

    <a-entity position="{roadPosition} 0 0">
      {#each roads as _, i}
        <a-plane rotation="-90 0 0" width="4" height="4" material="src: url(./road.jpg)" position="{(i - roadLenght / 2) * 4} 0 0"></a-plane>
      {/each}
    </a-entity>


    <a-sky color="#4875b3" src="./sky.jpg"></a-sky>
    <a-entity light="type: ambient; color: #BBB;"></a-entity>

    <a-camera position="{cameraPosition}" rotation="{cameraRotation}" look-controls="enabled: false"></a-camera>
  </a-scene>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

  .link {
    position: fixed;
    left: 0;
    padding: 24px;
    font-weight: bold;
    z-index: 1;
    font-size: 24px;
    color: white;
  }
</style>