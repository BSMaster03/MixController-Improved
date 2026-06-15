import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeonBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5, 25);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // Grid neon
    const gridHelper = new THREE.GridHelper(40, 80, 0x00ff88, 0x003322);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // Partículas
    const particlesCount = 400;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Luz suave
    const ambient = new THREE.AmbientLight(0x00ff88, 0.4);
    scene.add(ambient);

    const point = new THREE.PointLight(0x00ff88, 1.2, 30);
    point.position.set(0, 5, 5);
    scene.add(point);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      gridHelper.position.z = (t * 1.2) % 2;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="neon-bg-canvas" />;
}
