import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PARTNER_LOGOS } from '../../data';
import { ORBITAL_CAMERA } from '../../config/orbital-camera';

const SETS = 3;
const COUNT = SETS * PARTNER_LOGOS.length;
const RING_RADIUS = 7;
/* Used to normalize distance-based dimming in LogoCard. */
const RADIUS_VAR = 4.5;
const BAND_OFFSET = ORBITAL_CAMERA.desktop.y;
/* Hand-tuned placement per logo slot (PARTNER_LOGOS order), applied to all
   three sets so the belt reads symmetrical. lat is a fraction of the card's
   radius (keeps every card inside the 60deg fov); rad offsets RING_RADIUS;
   ang nudges the card along the ring (negative reads as screen-right when
   the card faces the camera); size scales the card. Neighbors alternate
   high/low and near/far so no logo blocks another: Respawn sits low and
   near to fill the bottom of the frame, Nexon rides highest directly above
   a raised Xbox, Burn Ghost floats above Aruze and Joingo, Avalanche steps
   right to keep Aruze in view, Planet Bingo stays small on the nearest pass
   with the bigger WMS reading clearly behind it. */
const LAYOUT: { lat: number; rad: number; ang: number; size: number }[] = [
  { lat: 0.21, rad: 1.2, ang: 0.11, size: 1.15 }, // WMS Gaming: high, far, large, shifted left
  { lat: -0.24, rad: -0.8, ang: -0.05, size: 1.0 }, // Scientific Games: low, near, eased right
  { lat: 0.04, rad: 1.9, ang: 0.05, size: 1.2 },  // Aristocrat: deep background, large, lifted
  { lat: -0.14, rad: -1.6, ang: 0, size: 0.98 },  // Respawn: low and near, fills the lower band
  { lat: 0.34, rad: -0.2, ang: 0, size: 1.0 },    // Nexon: highest card in the belt
  { lat: 0.14, rad: 0.8, ang: 0, size: 1.0 },     // Xbox: raised, stacked below Nexon
  { lat: -0.2, rad: -1.2, ang: -0.07, size: 0.95 }, // Avalanche: low, nudged right off Aruze
  { lat: -0.01, rad: 1.5, ang: 0.11, size: 1.2 }, // Aruze: large at the horizon, shifted left
  { lat: 0.28, rad: -0.5, ang: 0, size: 1.02 },   // Burn Ghost: high, above Aruze and Joingo
  { lat: -0.22, rad: 0.3, ang: 0, size: 0.9 },    // Joingo: lowest
  { lat: 0.02, rad: -1.8, ang: 0, size: 0.68 },   // Planet Bingo: nearest pass, kept small
];
/* Static roll of the whole belt so it reads as a tilted asteroid belt:
   cards rise and fall as they orbit instead of tracking a flat disc. */
const BELT_TILT = 0.09;
const ROTATE_SPEED = 0.06;
const PULL_DISTANCE = 2.4;

/* Shared edge-glow texture: a soft rectangular frame with a transparent
   center, so the glow hugs the card border instead of washing the whole
   plane (logo PNGs have transparent backgrounds). Drawn white, tinted
   chartreuse by the material color. */
let glowTex: THREE.Texture | null = null;
function getGlowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255,255,255,1)';
  ctx.shadowBlur = 12;
  ctx.strokeRect(18, 18, 220, 124);
  ctx.strokeRect(18, 18, 220, 124);
  glowTex = new THREE.CanvasTexture(canvas);
  return glowTex;
}

/* Missing logo asset: draw the company name to a canvas in Space Mono
   chartreuse so the card still reads in 3D. Graceful fallback always. */
function makeFallbackTexture(name: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = 'rgba(185,242,58,0.45)';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.strokeRect(14, 14, 484, 292);
  ctx.setLineDash([]);
  ctx.fillStyle = '#b9f23a';
  ctx.font = '700 40px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines: string[] = [];
  let line = '';
  for (const word of name.split(' ')) {
    const probe = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(probe).width > 440) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  }
  lines.push(line);
  const lineHeight = 54;
  const y0 = 160 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, 256, y0 + i * lineHeight));

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Loads each partner PNG by hand (no suspense) so a 404 can swap in the
   canvas-text fallback instead of breaking the scene. */
function usePartnerTextures() {
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(
    () => PARTNER_LOGOS.map(() => null)
  );

  useEffect(() => {
    let alive = true;
    const made: THREE.Texture[] = [];
    const assign = (i: number, tex: THREE.Texture) => {
      made.push(tex);
      setTextures(prev => {
        const next = prev.slice();
        next[i] = tex;
        return next;
      });
    };
    PARTNER_LOGOS.forEach((p, i) => {
      const img = new Image();
      img.onload = () => {
        if (!alive) return;
        const tex = new THREE.Texture(img);
        tex.needsUpdate = true;
        tex.colorSpace = THREE.SRGBColorSpace;
        assign(i, tex);
      };
      img.onerror = () => {
        // Wait for webfonts so the fallback actually renders in Space Mono.
        document.fonts.ready.then(() => {
          if (alive) assign(i, makeFallbackTexture(p.name));
        });
      };
      img.src = p.src;
    });
    return () => {
      alive = false;
      made.forEach(t => t.dispose());
    };
  }, []);

  return textures;
}

const _world = new THREE.Vector3();
const _toCard = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _target = new THREE.Vector3();

interface LogoCardProps {
  texture: THREE.Texture;
  name: string;
  angle: number;
  radius: number;
  latitude: number;
  size: number;
  selected: boolean;
  onClick: () => void;
}

function LogoCard({ texture, name, angle, radius, latitude, size, selected, onClick }: LogoCardProps) {
  const group = useRef<THREE.Group>(null);
  const cardMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const pull = useRef(0);

  const aspect = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const a = img && img.width && img.height ? img.width / img.height : 1.6;
    return THREE.MathUtils.clamp(a, 1.1, 2.2);
  }, [texture]);

  const home = useMemo(
    () => new THREE.Vector3(Math.sin(angle) * radius, latitude, Math.cos(angle) * radius),
    [angle, radius, latitude]
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !g.parent) return;
    const cam = state.camera;

    // Ease the pull toward / back from the camera on selection.
    pull.current += ((selected ? 1 : 0) - pull.current) * Math.min(1, delta * 5);

    cam.getWorldDirection(_forward);
    _target.copy(cam.position).addScaledVector(_forward, PULL_DISTANCE);
    g.parent.worldToLocal(_target);
    g.position.copy(home).lerp(_target, pull.current);
    g.lookAt(cam.position);

    // Facing factor: 1 when the card is dead ahead of the camera, 0 at the
    // edge of view. Drives scale, brightness and the chartreuse glow.
    g.getWorldPosition(_world);
    _toCard.copy(_world).sub(cam.position).normalize();
    const facing = _toCard.dot(_forward);
    const t = THREE.MathUtils.clamp((facing - 0.5) / 0.5, 0, 1);
    const dist = _world.distanceTo(cam.position);
    const far = THREE.MathUtils.clamp(
      (dist - (RING_RADIUS - RADIUS_VAR / 2)) / RADIUS_VAR, 0, 1
    );

    const orbitScale = size * (0.8 + 0.32 * t) * (1 - 0.1 * far);
    g.scale.setScalar(THREE.MathUtils.lerp(orbitScale, 1.25, pull.current));

    if (cardMat.current) {
      const orbitOpacity = (0.38 + 0.62 * t) * (1 - 0.25 * far);
      cardMat.current.opacity = THREE.MathUtils.lerp(orbitOpacity, 1, pull.current);
    }
    if (glowMat.current) {
      glowMat.current.opacity = THREE.MathUtils.lerp(0.8 * t * t, 0.95, pull.current);
    }
  });

  return (
    <group
      ref={group}
      position={home}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = ''; }}
    >
      <mesh scale={[aspect * 1.16, 1.2, 1]} position={[0, 0, -0.02]}>
        <planeGeometry />
        <meshBasicMaterial
          ref={glowMat}
          color="#b9f23a"
          map={getGlowTexture()}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[aspect, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          ref={cardMat}
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {selected && (
        <Html center position={[0, -0.72, 0]} zIndexRange={[40, 0]}>
          <div className="bwr-name">{name}</div>
        </Html>
      )}
    </group>
  );
}

interface RingProps {
  selected: number | null;
  onSelect: (idx: number | null) => void;
}

function Ring({ selected, onSelect }: RingProps) {
  const ring = useRef<THREE.Group>(null);
  const textures = usePartnerTextures();

  // 3 sets x 11 logos around a full 360 degree band, evenly spaced. Copies
  // of the same logo land 120 degrees apart and share the same hand-tuned
  // placement, with only a slight per-set depth and height nudge so the
  // three arcs stay symmetrical without reading as identical stamped layers.
  const instances = useMemo(() => {
    const list = [];
    for (let s = 0; s < SETS; s++) {
      for (let i = 0; i < PARTNER_LOGOS.length; i++) {
        const idx = s * PARTNER_LOGOS.length + i;
        const radius = RING_RADIUS + LAYOUT[i].rad + (s - 1) * 0.3;
        list.push({
          idx,
          logo: i,
          angle: (idx / COUNT) * Math.PI * 2 + LAYOUT[i].ang,
          latitude: (LAYOUT[i].lat + (s - 1) * 0.02) * radius + BAND_OFFSET,
          radius,
          size: LAYOUT[i].size,
        });
      }
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.y += delta * ROTATE_SPEED;
  });

  return (
    <group rotation={[0, 0, BELT_TILT]}>
      <group ref={ring}>
        {instances.map(inst => {
          const tex = textures[inst.logo];
          if (!tex) return null;
          return (
            <LogoCard
              key={inst.idx}
              texture={tex}
              name={PARTNER_LOGOS[inst.logo].name}
              angle={inst.angle}
              radius={inst.radius}
              latitude={inst.latitude}
              size={inst.size}
              selected={selected === inst.idx}
              onClick={() => onSelect(selected === inst.idx ? null : inst.idx)}
            />
          );
        })}
      </group>
    </group>
  );
}

/* Ambient particle field: tiny dots suggesting stars or signal noise,
   counter-rotating very slowly against the ring. */
function Particles() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const n = 500;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 4 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.sin(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = Math.cos(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y -= delta * 0.012;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#8fae46"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig() {
  const targetZ = useRef(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) targetZ.current = ORBITAL_CAMERA.mobile.z;
      else if (w < 768) targetZ.current = ORBITAL_CAMERA.tablet.z;
      else targetZ.current = ORBITAL_CAMERA.desktop.z;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useFrame((state, delta) => {
    const cam = state.camera;
    cam.position.x = ORBITAL_CAMERA.desktop.x;
    cam.position.y = BAND_OFFSET;
    cam.position.z += (targetZ.current - cam.position.z) * Math.min(1, delta * 3);
    cam.lookAt(ORBITAL_CAMERA.lookAt.x, ORBITAL_CAMERA.lookAt.y, ORBITAL_CAMERA.lookAt.z);
  });

  return null;
}

export default function BuiltWithRing({ active }: { active: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [ORBITAL_CAMERA.desktop.x, BAND_OFFSET, ORBITAL_CAMERA.desktop.z], fov: ORBITAL_CAMERA.fov, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={['#09090b']} />
      <CameraRig />
      <Particles />
      <Ring selected={selected} onSelect={setSelected} />
    </Canvas>
  );
}
