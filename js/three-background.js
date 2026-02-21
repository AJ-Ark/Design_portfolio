/**
 * Three.js animated wave background for the hero section
 */

function initThreeBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    /* ---- Renderer ---- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    /* ---- Scene & Camera ---- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        55,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    /* ---- Mouse tracking ---- */
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    /* ---- Shader Material ---- */
    const vertexShader = `
        uniform float uTime;
        uniform float uMouseX;
        uniform float uMouseY;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vUv = uv;

            vec3 pos = position;

            // Primary wave
            float wave1 = sin(pos.x * 1.5 + uTime * 0.8) * 0.35;
            float wave2 = sin(pos.y * 2.0 + uTime * 0.6) * 0.25;
            float wave3 = cos(pos.x * 0.8 + pos.y * 1.2 + uTime * 0.5) * 0.3;

            // Mouse influence — ripple from mouse position
            float distMouse = length(pos.xy - vec2(uMouseX * 10.0, uMouseY * 10.0));
            float mouseWave = sin(distMouse * 0.6 - uTime * 2.0) * 0.4 * exp(-distMouse * 0.08);

            pos.z += wave1 + wave2 + wave3 + mouseWave;
            vElevation = pos.z;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            // Trmeric orange dominant palette
            // #FF6B35 → 1.0, 0.42, 0.21
            // #FF8C61 → 1.0, 0.55, 0.38 (lighter orange)
            // #E55A2B → 0.898, 0.353, 0.169 (darker orange)

            vec3 orangeBright = vec3(1.0, 0.42, 0.21);
            vec3 orangeLight  = vec3(1.0, 0.55, 0.38);
            vec3 orangeDark   = vec3(0.898, 0.353, 0.169);

            // Blend across UV x-axis with slight time shift
            float t = vUv.x + sin(uTime * 0.15) * 0.15;

            vec3 color;
            if (t < 0.5) {
                color = mix(orangeDark, orangeBright, t * 2.0);
            } else {
                color = mix(orangeBright, orangeLight, (t - 0.5) * 2.0);
            }

            // Boost peaks for brightness variation
            float brightness = 0.55 + vElevation * 0.2;
            color *= brightness;

            // Subtle alpha fade at edges
            float alpha = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y) * 0.75;

            gl_FragColor = vec4(color, alpha);
        }
    `;

    const uniforms = {
        uTime:   { value: 0.0 },
        uMouseX: { value: 0.0 },
        uMouseY: { value: 0.0 }
    };

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: false
    });

    /* ---- Geometry (reduce segments on smaller screens) ---- */
    const segments = window.innerWidth <= 1024 ? 25 : 50;
    const geometry = new THREE.PlaneGeometry(20, 20, segments, segments);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.35;
    scene.add(plane);

    /* ---- Debounced resize handler ---- */
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }, 150);
    }
    window.addEventListener('resize', onResize);

    /* ---- Animation loop ---- */
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        uniforms.uTime.value = elapsed;

        // Smooth mouse interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        uniforms.uMouseX.value = mouse.x;
        uniforms.uMouseY.value = mouse.y;

        renderer.render(scene, camera);
    }

    animate();
}
