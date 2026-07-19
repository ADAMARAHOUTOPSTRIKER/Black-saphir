"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS } from "@/lib/assets";

/**
 * The signature WebGL moment: a domain-warped "gold veil" shader breathing
 * over the hero video, plus a handful of drifting gold dust motes.
 * The veil leans toward the cursor and dissolves as you scroll.
 * Mounted only on fine-pointer devices without reduced motion, and the
 * render loop is fully stopped when the hero leaves the viewport.
 */

type SceneProps = {
  /** 0..1 hero scroll progress, written by the Hero's ScrollTrigger. */
  scrollRef: RefObject<number>;
  active: boolean;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uAspect;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);
    vec2 m = vec2(uMouse.x * uAspect, uMouse.y);

    // Slow domain-warped veil
    vec2 warp = vec2(fbm(p * 1.6 + uTime * 0.030), fbm(p * 1.6 - uTime * 0.024));
    float veil = fbm(p * 2.2 + warp * 1.4 + vec2(0.0, uTime * 0.02));
    veil = smoothstep(0.42, 0.92, veil);

    // Cursor halo
    float mouseGlow = exp(-length(p - m) * 3.0) * 0.45;

    // Sits mostly in the lower half; edges stay charcoal
    float band = smoothstep(0.95, 0.10, uv.y);
    float vign = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.6);

    vec3 gold = vec3(0.788, 0.635, 0.294);
    vec3 goldHot = vec3(0.878, 0.737, 0.416);
    float intensity = (veil * 0.5 + mouseGlow) * band * vign * (1.0 - uScroll * 0.9);
    vec3 col = mix(gold, goldHot, veil) * intensity;
    gl_FragColor = vec4(col, intensity * 0.8);
  }
`;

function GoldVeil({ scrollRef }: SceneProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.4));
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.4) },
      uScroll: { value: 0 },
      uAspect: { value: 1.6 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uAspect.value = size.width / size.height;
    u.uScroll.value = scrollRef.current ?? 0;
    // Lerp toward the pointer for a weighted, liquid feel
    mouse.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    (u.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.045);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function DustMotes({ scrollRef }: SceneProps) {
  const points = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glow = useTexture(ASSETS.textures.glow);

  const positions = useMemo(() => {
    // Seeded LCG: render-pure and stable across re-renders.
    let seed = 20260719;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const count = 90;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 9;
      arr[i * 3 + 1] = (rand() - 0.5) * 5;
      arr[i * 3 + 2] = (rand() - 0.5) * 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.z = t * 0.008;
    points.current.position.y = Math.sin(t * 0.12) * 0.12;
    materialRef.current.opacity = 0.4 * (1 - (scrollRef.current ?? 0));
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={glow}
        color="#c9a24b"
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene({ scrollRef, active }: SceneProps) {
  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4], fov: 60 }}
      className="!absolute !inset-0"
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <GoldVeil scrollRef={scrollRef} active={active} />
        <DustMotes scrollRef={scrollRef} active={active} />
      </Suspense>
    </Canvas>
  );
}
