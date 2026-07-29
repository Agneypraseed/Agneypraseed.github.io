/* eslint-disable react/prop-types, react/no-unknown-property */
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import useIsMobile from "../hooks/useIsMobile";
import { CATEGORIES, getSkillNodeId } from "./skillsGraphData";

const HUB_POSITIONS = {
  languages: [-3.25, 1.55, 0.65],
  frameworks: [3.1, 1.2, -0.85],
  "data-cloud": [-2.35, -2.05, -1.1],
  "ai-ml": [2.45, -1.85, 1.15],
};

const HUB_LINKS = [
  ["languages", "frameworks"],
  ["languages", "data-cloud"],
  ["languages", "ai-ml"],
  ["frameworks", "data-cloud"],
  ["frameworks", "ai-ml"],
  ["data-cloud", "ai-ml"],
];

const DEFAULT_CAMERA_POSITION = [0, 0.38, 10.2];
const MOBILE_CAMERA_POSITION = [0, 0.6, 12.2];
const CONSTELLATION_SCALE = 0.9;
const FOCUS_DIRECTION = new THREE.Vector3(0.85, 0.5, 1).normalize();

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
};

const getCategoryIdFromNodeId = (nodeId) => {
  if (!nodeId) return null;
  return nodeId.includes("--") ? nodeId.split("--")[0] : nodeId;
};

const buildConstellation = () =>
  CATEGORIES.map((category, categoryIndex) => {
    const skillCount = category.skills.length;
    const orbitRadius = 1.04 + skillCount * 0.03;
    const orbitDepth = 0.48 + (categoryIndex % 2) * 0.14;
    const phase = categoryIndex * Math.PI * 0.47;
    const tilt = [
      categoryIndex % 2 === 0 ? 0.28 : -0.22,
      categoryIndex % 3 === 0 ? -0.18 : 0.16,
      categoryIndex % 2 === 0 ? 0.14 : -0.12,
    ];

    return {
      ...category,
      phase,
      position: HUB_POSITIONS[category.id],
      orbitSpeed: 0.085 + categoryIndex * 0.018,
      tilt,
      skills: category.skills.map((skill, skillIndex) => {
        const angle = (skillIndex / skillCount) * Math.PI * 2 + phase * 0.55;
        const wobble = skillIndex % 2 === 0 ? 0.28 : -0.2;

        return {
          ...skill,
          id: getSkillNodeId(category.id, skill.name),
          label: skill.name,
          categoryId: category.id,
          radius: 0.11 + skill.size * 0.075,
          position: [
            Math.cos(angle) * orbitRadius,
            Math.sin(angle) * orbitRadius * 0.56 + wobble * 0.82,
            Math.sin(angle * 1.35 + phase) * orbitDepth,
          ],
        };
      }),
    };
  });

function CameraRig({
  isMobile,
  nodeRefs,
  prefersReducedMotion,
  selectedNodeId,
}) {
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const focusTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraGoal = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const selectedObject = selectedNodeId
      ? nodeRefs.current[selectedNodeId]
      : null;

    if (selectedObject) {
      selectedObject.getWorldPosition(focusTarget);
      cameraGoal
        .copy(focusTarget)
        .addScaledVector(FOCUS_DIRECTION, isMobile ? 7.6 : 6.8);
    } else {
      focusTarget.set(0, 0, 0);
    }

    const targetLerp = 1 - Math.exp(-delta * (selectedObject ? 4.6 : 1.4));
    const cameraLerp = 1 - Math.exp(-delta * 2.8);

    if (prefersReducedMotion) {
      controls.target.copy(focusTarget);
    } else {
      controls.target.lerp(focusTarget, targetLerp);
    }

    if (selectedObject) {
      if (prefersReducedMotion) {
        camera.position.copy(cameraGoal);
      } else {
        camera.position.lerp(cameraGoal, cameraLerp);
      }
    }
    controls.autoRotate = !selectedObject && !prefersReducedMotion;
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={4.4}
      maxDistance={16}
      autoRotate={!selectedNodeId && !prefersReducedMotion}
      autoRotateSpeed={0.24}
    />
  );
}

function HubNode({
  category,
  darkMode,
  dimmed,
  onSelectNode,
  prefersReducedMotion,
  registerNode,
  selected,
}) {
  const groupRef = useRef(null);
  const torusRef = useRef(null);
  const coreColor = darkMode ? category.darkColor : category.color;
  const accentColor = coreColor;
  const labelColor = darkMode ? "#fafaf9" : "#171717";

  useEffect(() => {
    registerNode(category.id, groupRef.current);
    return () => registerNode(category.id, null);
  }, [category.id, registerNode]);

  useFrame(({ clock }) => {
    if (prefersReducedMotion) return;

    const elapsed = clock.elapsedTime;
    const pulse = 1 + Math.sin(elapsed * 1.8 + category.phase) * 0.032;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(pulse);
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = elapsed * 0.58 + category.phase;
      torusRef.current.rotation.y = elapsed * 0.42;
      torusRef.current.rotation.z = elapsed * 0.24;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation();
        onSelectNode(null);
      }}
    >
      <pointLight
        color={accentColor}
        distance={4.6}
        intensity={dimmed ? 0.28 : darkMode ? 1.9 : 1.2}
      />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.38, 40, 40]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={dimmed ? 0.46 : 1}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={torusRef}>
        <torusGeometry args={[0.58, 0.018, 16, 96]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={dimmed ? 0.12 : selected ? 0.78 : 0.55}
          toneMapped={false}
        />
      </mesh>
      <Billboard position={[0, -0.72, 0]}>
        <Text
          color={labelColor}
          fillOpacity={dimmed ? 0.3 : 0.95}
          fontSize={0.2}
          letterSpacing={0.08}
          maxWidth={1.9}
          anchorX="center"
          anchorY="middle"
          outlineColor={darkMode ? "#171717" : "#fafaf9"}
          outlineWidth={0.004}
        >
          {category.label}
        </Text>
      </Billboard>
    </group>
  );
}

function SkillNode({
  category,
  darkMode,
  dimmed,
  onSelectNode,
  prefersReducedMotion,
  registerNode,
  selected,
  skill,
}) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const skillColor = darkMode ? category.darkColor : category.color;
  const accentColor = skillColor;
  const labelColor = darkMode ? "#e4e4e7" : "#71717a";

  useEffect(() => {
    registerNode(skill.id, groupRef.current);
    return () => registerNode(skill.id, null);
  }, [registerNode, skill.id]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const elapsed = clock.elapsedTime;
    const pulse =
      selected && !prefersReducedMotion
        ? 1 + Math.sin(elapsed * 4.2) * 0.055
        : 1;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group
      ref={groupRef}
      position={skill.position}
      onClick={(event) => {
        event.stopPropagation();
        onSelectNode(skill.id);
      }}
    >
      {selected && (
        <pointLight
          color={accentColor}
          distance={1.6}
          intensity={darkMode ? 1.2 : 0.65}
        />
      )}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[skill.radius, 24, 24]} />
        <meshBasicMaterial
          color={skillColor}
          transparent
          opacity={dimmed ? 0.28 : 0.95}
          toneMapped={false}
        />
      </mesh>
      <Billboard position={[0, skill.radius + 0.2, 0]}>
        <Text
          color={labelColor}
          fillOpacity={dimmed ? 0.24 : selected ? 1 : 0.88}
          fontSize={selected ? 0.19 : 0.145}
          maxWidth={1.55}
          anchorX="center"
          anchorY="middle"
          outlineColor={darkMode ? "#171717" : "#fafaf9"}
          outlineWidth={0.004}
        >
          {skill.label}
        </Text>
      </Billboard>
    </group>
  );
}

function SkillEdges({ category, darkMode, selectedNodeId }) {
  const selectedCategoryId = getCategoryIdFromNodeId(selectedNodeId);
  const selectedInCluster = selectedCategoryId === category.id;
  const selectionActive = Boolean(selectedNodeId);
  const edgeColor = darkMode ? "#e4e4e7" : "#171717";

  return category.skills.map((skill) => {
    const selected = selectedNodeId === skill.id;
    const dimmed = selectionActive && !selectedInCluster;

    return (
      <Line
        key={`${category.id}-${skill.id}-edge`}
        points={[[0, 0, 0], skill.position]}
        color={
          selected
            ? darkMode
              ? category.lightColor
              : category.color
            : edgeColor
        }
        transparent
        opacity={dimmed ? 0.045 : selected ? 0.62 : 0.18}
        lineWidth={selected ? 1.45 : 0.7}
      />
    );
  });
}

function CategoryCluster({
  category,
  darkMode,
  onSelectNode,
  prefersReducedMotion,
  registerNode,
  selectedNodeId,
}) {
  const orbitRef = useRef(null);
  const selectedCategoryId = getCategoryIdFromNodeId(selectedNodeId);
  const selectedInCluster = selectedCategoryId === category.id;
  const selectionActive = Boolean(selectedNodeId);
  const dimCluster = selectionActive && !selectedInCluster;

  useFrame(({ clock }, delta) => {
    if (!orbitRef.current || prefersReducedMotion) return;

    const elapsed = clock.elapsedTime;
    const orbitMultiplier = selectedNodeId ? 0 : 1;
    orbitRef.current.rotation.x =
      category.tilt[0] + Math.sin(elapsed * 0.18 + category.phase) * 0.045;
    orbitRef.current.rotation.y +=
      delta * category.orbitSpeed * orbitMultiplier;
    orbitRef.current.rotation.z =
      category.tilt[2] + Math.cos(elapsed * 0.16 + category.phase) * 0.035;
  });

  return (
    <group
      position={category.position}
      rotation={[category.tilt[0], category.tilt[1], category.tilt[2]]}
    >
      <HubNode
        category={category}
        darkMode={darkMode}
        dimmed={dimCluster}
        onSelectNode={onSelectNode}
        prefersReducedMotion={prefersReducedMotion}
        registerNode={registerNode}
        selected={selectedNodeId === category.id || selectedInCluster}
      />
      <group ref={orbitRef}>
        <SkillEdges
          category={category}
          darkMode={darkMode}
          selectedNodeId={selectedNodeId}
        />
        {category.skills.map((skill) => (
          <SkillNode
            key={skill.id}
            category={category}
            darkMode={darkMode}
            dimmed={dimCluster}
            onSelectNode={onSelectNode}
            prefersReducedMotion={prefersReducedMotion}
            registerNode={registerNode}
            selected={selectedNodeId === skill.id}
            skill={skill}
          />
        ))}
      </group>
    </group>
  );
}

function HubLinks({ categories, darkMode, selectedNodeId }) {
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const selectedCategoryId = getCategoryIdFromNodeId(selectedNodeId);
  const edgeColor = darkMode ? "#fafaf9" : "#171717";

  return HUB_LINKS.map(([sourceId, targetId]) => {
    const source = categoryById.get(sourceId);
    const target = categoryById.get(targetId);
    const selected =
      selectedCategoryId === sourceId || selectedCategoryId === targetId;
    const dimmed = selectedNodeId && !selected;

    return (
      <Line
        key={`${sourceId}-${targetId}`}
        points={[source.position, target.position]}
        color={edgeColor}
        transparent
        opacity={dimmed ? 0.08 : selected ? 0.58 : 0.34}
        lineWidth={selected ? 1.95 : 1.25}
      />
    );
  });
}

function ConstellationScene({
  darkMode,
  isMobile,
  onSelectNode,
  prefersReducedMotion,
  selectedNodeId,
}) {
  const nodeRefs = useRef({});
  const categories = useMemo(() => buildConstellation(), []);

  const registerNode = useCallback((id, object) => {
    if (object) {
      nodeRefs.current[id] = object;
      return;
    }

    delete nodeRefs.current[id];
  }, []);

  return (
    <>
      <fog attach="fog" args={[darkMode ? "#171717" : "#fafaf9", 9, 18]} />
      <ambientLight intensity={darkMode ? 0.52 : 0.85} />
      <directionalLight
        position={[5, 5, 7]}
        intensity={darkMode ? 0.7 : 1.25}
      />
      <directionalLight
        position={[-5, -3, -4]}
        intensity={darkMode ? 0.22 : 0.35}
      />

      <Suspense fallback={null}>
        <group scale={CONSTELLATION_SCALE} position={[0, -0.08, 0]}>
          <HubLinks
            categories={categories}
            darkMode={darkMode}
            selectedNodeId={selectedNodeId}
          />
          {categories.map((category) => (
            <CategoryCluster
              key={category.id}
              category={category}
              darkMode={darkMode}
              onSelectNode={onSelectNode}
              prefersReducedMotion={prefersReducedMotion}
              registerNode={registerNode}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </group>
      </Suspense>
      <CameraRig
        isMobile={isMobile}
        nodeRefs={nodeRefs}
        prefersReducedMotion={prefersReducedMotion}
        selectedNodeId={selectedNodeId}
      />
    </>
  );
}

const SkillsGraph = ({
  darkMode,
  expanded = false,
  onInteract = () => {},
  onSelectNode = () => {},
  selectedNodeId = null,
}) => {
  const { isMobile } = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const height = isMobile ? 500 : expanded ? 680 : 660;

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        minHeight: height,
      }}
    >
      <Canvas
        camera={{
          position: isMobile ? MOBILE_CAMERA_POSITION : DEFAULT_CAMERA_POSITION,
          fov: isMobile ? 52 : 48,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={onInteract}
        onWheel={onInteract}
        onPointerMissed={() => onSelectNode(null)}
        style={{
          width: "100%",
          height,
          background: darkMode ? "#171717" : "#fafaf9",
          overflow: "hidden",
          cursor: selectedNodeId ? "default" : "grab",
        }}
      >
        <ConstellationScene
          darkMode={darkMode}
          isMobile={isMobile}
          onSelectNode={onSelectNode}
          prefersReducedMotion={prefersReducedMotion}
          selectedNodeId={selectedNodeId}
        />
      </Canvas>
    </div>
  );
};

export default SkillsGraph;
