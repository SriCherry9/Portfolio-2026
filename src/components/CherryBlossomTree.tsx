import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

interface Props { className?: string }

export function CherryBlossomTree({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    petals: FallingPetal[]
    raf: number
  } | null>(null)

  const spawnPetals = useCallback(() => {
    if (!sceneRef.current) return
    const { scene, petals } = sceneRef.current
    for (let i = 0; i < 30; i++) {
      const petal = createFallingPetal()
      scene.add(petal.mesh)
      petals.push(petal)
    }
  }, [])

  useEffect(() => {
    const mount = mountRef.current!
    const W = mount.clientWidth
    const H = mount.clientHeight

    // ── Renderer ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap
    renderer.setClearColor(0xF4EADE)
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ───────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    scene.fog    = new THREE.Fog(0xF4EADE, 28, 55)

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.set(6, 7, 11)
    camera.lookAt(0, 2.5, 0)

    // ── Lighting ─────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffe8d6, 1.2)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xfff4e8, 2.2)
    sun.position.set(6, 12, 8)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far  = 40
    sun.shadow.camera.left = sun.shadow.camera.bottom = -8
    sun.shadow.camera.right = sun.shadow.camera.top   =  8
    sun.shadow.bias = -0.001
    scene.add(sun)

    // Fill light from opposite side
    const fill = new THREE.DirectionalLight(0xd4f0ff, 0.6)
    fill.position.set(-5, 4, -4)
    scene.add(fill)

    // ── Ground ────────────────────────────────────────────────────────────
    const groundGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.18, 48)
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x6dbf4e })
    const ground    = new THREE.Mesh(groundGeo, groundMat)
    ground.position.y = -0.09
    ground.receiveShadow = true
    scene.add(ground)

    // Ground edge — slightly darker rim
    const rimGeo = new THREE.CylinderGeometry(3.85, 3.85, 0.12, 48)
    const rimMat = new THREE.MeshLambertMaterial({ color: 0x55a33a })
    const rim    = new THREE.Mesh(rimGeo, rimMat)
    rim.position.y = -0.15
    scene.add(rim)

    // ── Shadow disc on ground ─────────────────────────────────────────────
    const shadowGeo = new THREE.CircleGeometry(2.6, 48)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x2a5e18, transparent: true, opacity: 0.18, depthWrite: false
    })
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat)
    shadowDisc.rotation.x = -Math.PI / 2
    shadowDisc.position.y = 0.02
    shadowDisc.position.x = 0.4
    scene.add(shadowDisc)

    // ── Fallen petals on ground ───────────────────────────────────────────
    const petalPositions = [
      [-1.2, 0.5], [-0.4, 1.8], [0.8, 1.4], [1.6, 0.6],
      [1.9, -0.4], [1.1, -1.5], [0.2, -2.0], [-1.0, -1.6],
      [-2.0, -0.8], [-2.1, 0.4], [-1.5, 1.2], [0.5, -0.8],
      [2.4, 0.2], [-0.8, 2.4], [1.4, 2.0], [-2.6, -0.1],
    ]
    petalPositions.forEach(([x, z]) => {
      const fp = makeGroundPetal(x, z)
      scene.add(fp)
    })

    // ── Trunk ─────────────────────────────────────────────────────────────
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6b3a2a })
    addTrunk(scene, trunkMat)

    // ── Canopy clusters ───────────────────────────────────────────────────
    const canopyClusters: [number,number,number,number][] = [
      // [x, y, z, radius]
      [ 0.0,  6.8,  0.0, 1.85],
      [-1.5,  6.2, -0.3, 1.60],
      [ 1.6,  6.0,  0.2, 1.55],
      [-0.8,  7.6,  0.5, 1.40],
      [ 0.7,  7.4, -0.6, 1.35],
      [-2.2,  5.6,  0.8, 1.30],
      [ 2.3,  5.4, -0.5, 1.25],
      [ 0.2,  5.8,  1.5, 1.30],
      [-0.5,  5.4, -1.4, 1.20],
      [ 1.2,  8.0,  0.4, 1.10],
      [-1.2,  8.2, -0.3, 1.00],
      [ 2.8,  6.4,  0.8, 1.10],
      [-2.8,  6.2,  0.2, 1.05],
      [ 0.0,  8.6,  0.0, 0.90],
      [-0.6,  6.8,  1.8, 1.00],
      [ 0.8,  6.6, -1.7, 0.95],
    ]

    canopyClusters.forEach(([x, y, z, r], i) => {
      const shade = i % 3
      const color = shade === 0 ? 0xffb7c5 : shade === 1 ? 0xff8fab : 0xffc8d5
      const geo = new THREE.SphereGeometry(r, 9, 7)
      // Slight randomise vertices for low-poly feel
      const pos = geo.attributes.position
      for (let v = 0; v < pos.count; v++) {
        pos.setX(v, pos.getX(v) + (Math.random() - 0.5) * 0.25)
        pos.setY(v, pos.getY(v) + (Math.random() - 0.5) * 0.25)
        pos.setZ(v, pos.getZ(v) + (Math.random() - 0.5) * 0.25)
      }
      geo.computeVertexNormals()
      const mat  = new THREE.MeshLambertMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.castShadow    = true
      mesh.receiveShadow = true
      scene.add(mesh)
    })

    // ── Falling petals state ──────────────────────────────────────────────
    const petals: FallingPetal[] = []

    // ── Render loop ───────────────────────────────────────────────────────
    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)

      // Update falling petals
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.vel.y   -= 0.006
        p.vel.x   += Math.sin(p.phase) * 0.003
        p.vel.z   += Math.cos(p.phase) * 0.002
        p.phase   += 0.08
        p.mesh.position.add(p.vel)
        p.mesh.rotation.x += 0.04
        p.mesh.rotation.z += 0.03
        if (p.mesh.position.y < 0.1) {
          scene.remove(p.mesh)
          p.mesh.geometry.dispose()
          petals.splice(i, 1)
        }
      }

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    sceneRef.current = { renderer, scene, camera, petals, raf }

    // Resize
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      onClick={spawnPetals}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label="Click to make cherry blossoms fall"
    />
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function addTrunk(scene: THREE.Scene, mat: THREE.MeshLambertMaterial) {
  // Main trunk — tapered cylinder
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.42, 5.2, 10)
  const trunk    = new THREE.Mesh(trunkGeo, mat)
  trunk.position.set(0, 2.6, 0)
  trunk.castShadow = true
  scene.add(trunk)

  // Trunk highlight
  const hlMat = new THREE.MeshLambertMaterial({ color: 0x8b5a3a })
  const hlGeo = new THREE.CylinderGeometry(0.08, 0.14, 4.8, 6)
  const hl    = new THREE.Mesh(hlGeo, hlMat)
  hl.position.set(-0.1, 2.6, 0.15)
  scene.add(hl)

  // Branches
  const branches: [number,number,number,number,number,number,number,number][] = [
    // [topR, botR, len, px, py, pz, rx, rz]
    [0.10, 0.20, 2.2, -1.2, 5.2,  0.3,  0.45, -0.35],
    [0.10, 0.20, 2.0,  1.1, 5.0, -0.2,  0.40,  0.38],
    [0.08, 0.15, 1.8,  0.1, 5.5,  1.0,  0.50,  0.05],
    [0.08, 0.15, 1.6, -0.2, 5.3, -1.0,  0.48, -0.06],
    [0.07, 0.13, 1.6, -2.0, 5.4,  0.6,  0.52, -0.55],
    [0.07, 0.13, 1.5,  2.0, 5.2, -0.3,  0.50,  0.55],
  ]
  branches.forEach(([tR, bR, len, px, py, pz, rx, rz]) => {
    const geo  = new THREE.CylinderGeometry(tR, bR, len, 8)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(px, py, pz)
    mesh.rotation.x = rx
    mesh.rotation.z = rz
    mesh.castShadow = true
    scene.add(mesh)
  })
}

interface FallingPetal {
  mesh:  THREE.Mesh
  vel:   THREE.Vector3
  phase: number
}

function createFallingPetal(): FallingPetal {
  const geo = new THREE.EllipseCurve(0, 0, 0.18, 0.12, 0, Math.PI * 2)
  const pts = geo.getPoints(8)
  const shape = new THREE.Shape(pts)
  const sGeo  = new THREE.ShapeGeometry(shape)
  const color = [0xffb7c5, 0xff8fab, 0xffc8d5, 0xffd6e0][Math.floor(Math.random() * 4)]
  const mat   = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
  const mesh  = new THREE.Mesh(sGeo, mat)

  // Start from within canopy
  mesh.position.set(
    (Math.random() - 0.5) * 3.5,
    5.5 + Math.random() * 3,
    (Math.random() - 0.5) * 3.5,
  )
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

  return {
    mesh,
    vel:   new THREE.Vector3((Math.random() - 0.5) * 0.04, -0.02, (Math.random() - 0.5) * 0.04),
    phase: Math.random() * Math.PI * 2,
  }
}

function makeGroundPetal(x: number, z: number): THREE.Mesh {
  const geo = new THREE.EllipseCurve(0, 0, 0.22, 0.14, 0, Math.PI * 2)
  const pts = geo.getPoints(8)
  const shape = new THREE.Shape(pts)
  const sGeo  = new THREE.ShapeGeometry(shape)
  const color = [0xffb7c5, 0xffc8d5, 0xffd6e0][Math.floor(Math.random() * 3)]
  const mat   = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
  const mesh  = new THREE.Mesh(sGeo, mat)
  mesh.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3
  mesh.rotation.z = Math.random() * Math.PI
  mesh.position.set(x, 0.04, z)
  return mesh
}
