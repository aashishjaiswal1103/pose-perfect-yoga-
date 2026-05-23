import React, { JSX } from 'react';
import {
  CheckCircle,
  Heart,
  Brain,
  Bone,
  Forward,
  Triangle,
  Mountain,
  Wind,
  Shield,
  Users,
  VenetianMask,
  Star,
  Waves,
  Sun,
  Moon,
  Zap,
  RefreshCw,
  Bird,
} from 'lucide-react';

export const bodyPartIcon: Record<string, JSX.Element> = {
  Legs: <Bone className="h-6 w-6 text-primary" />,
  Core: <Heart className="h-6 w-6 text-primary" />,
  Mind: <Brain className="h-6 w-6 text-primary" />,
  Hips: <Bone className="h-6 w-6 text-primary" />,
  Shoulders: <Bone className="h-6 w-6 text-primary" />,
  Back: <Bone className="h-6 w-6 text-primary" />,
  Arms: <Bone className="h-6 w-6 text-primary" />,
  Spine: <Bone className="h-6 w-6 text-primary" />,
  Balance: <Brain className="h-6 w-6 text-primary" />,
};

export type Pose = {
  name: string;
  icon: JSX.Element;
  image: string;
  coverImage: string;
  description: string;
  benefits: string[];
  bodyParts: string[];
  steps: string[];
  precautions: string[];
};

export const poses: Pose[] = [
  {
    name: 'Warrior Pose',
    icon: <Forward className="h-10 w-10" />,
    image: '/face_cards/warriorpose.jpeg',
    coverImage: '/warrior.jpeg',
    description: 'A powerful standing pose that builds strength and confidence.',
    benefits: ['Strengthens legs and core', 'Improves balance and focus', 'Opens hips and chest'],
    bodyParts: ['Legs', 'Core', 'Shoulders'],
    steps: [
      'Stand with feet wide apart.',
      'Turn your right foot out 90 degrees.',
      'Extend arms out parallel to the floor.',
      'Bend your right knee until it is directly over your ankle.',
      'Look over your right hand and hold.'
    ],
    precautions: [
      'Avoid if you have recent hip or knee injuries.',
      'Keep your neck aligned and do not strain.',
      'Do not let the bent knee extend past the toes.'
    ]
  },
  {
    name: 'Tree Pose',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-4M15 15l-3-3-3 3M12 12V2M7 7l-3 3 3 3M17 7l3 3-3 3"/>
      </svg>
    ),
    image: '/face_cards/treepose.jpeg',
    coverImage: '/tree.jpeg',
    description: 'A balancing pose that cultivates focus and grounding.',
    benefits: ['Enhances concentration', 'Strengthens standing leg', 'Improves posture'],
    bodyParts: ['Balance', 'Legs', 'Core'],
    steps: [
      'Stand tall in Mountain Pose.',
      'Shift your weight onto your left leg.',
      'Place your right foot on your inner left thigh or calf (avoid the knee).',
      'Bring your hands to your chest in prayer position.',
      'Find a focal point and hold for 5 breaths, then switch sides.'
    ],
    precautions: [
      'Avoid placing your foot directly on the knee joint.',
      'If balance is an issue, stand near a wall for support.',
      'Avoid if you suffer from low blood pressure or severe headaches.'
    ]
  },
  {
    name: 'Lotus Pose',
    icon: <Star className="h-10 w-10" />,
    image: '/face_cards/lotuspose.jpeg',
    coverImage: '/lotus.jpeg',
    description: 'A meditative seated posture symbolizing inner peace.',
    benefits: ['Opens hips', 'Calms the mind', 'Encourages deep breathing'],
    bodyParts: ['Hips', 'Spine', 'Mind'],
    steps: [
      'Sit on the floor with your legs extended forward.',
      'Bend your right knee and place your right foot on your left thigh.',
      'Carefully bring your left foot onto your right thigh.',
      'Rest your hands on your knees with palms facing up.',
      'Keep your spine straight, close your eyes, and breathe deeply.'
    ],
    precautions: [
      'Avoid if you have knee or ankle injuries.',
      'Do not force your legs into position; try half-lotus first if needed.',
      'Ensure you are fully warmed up before attempting this deep hip opener.'
    ]
  },
  {
    name: 'Downward Dog',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13.37L3.1 12l1.32.51L6.5 10l2.12 4.19.88 1.81 2.38-2.38 2.38 2.38.88-1.81L17.5 10l2.08 2.51L20.9 12l1.1 1.37"/>
      </svg>
    ),
    image: '/face_cards/downwardfacingdog.jpeg',
    coverImage: '/downwrad dog.jpeg',
    description: 'A foundational inversion that lengthens the spine and energizes the body.',
    benefits: ['Stretches hamstrings and calves', 'Strengthens shoulders', 'Improves circulation'],
    bodyParts: ['Legs', 'Shoulders', 'Back'],
    steps: [
      'Start on your hands and knees (tabletop position).',
      'Spread your fingers wide and press firmly into your palms.',
      'Tuck your toes and lift your hips up and back.',
      'Straighten your legs as much as possible, pressing heels toward the floor.',
      'Let your head hang loosely between your arms.'
    ],
    precautions: [
      'Avoid if you suffer from carpal tunnel syndrome.',
      'Not recommended for those in the late stages of pregnancy.',
      'Avoid if you have high blood pressure or a headache.'
    ]
  },
  {
    name: 'Triangle Pose',
    icon: <Triangle className="h-10 w-10" />,
    image: '/face_cards/trianglepose.jpeg',
    coverImage: '/traingle.jpeg',
    description: 'A lateral stretch that opens the hips and side body.',
    benefits: ['Improves spinal mobility', 'Strengthens legs', 'Enhances balance'],
    bodyParts: ['Legs', 'Spine', 'Hips'],
    steps: [
      'Stand with your feet about 3 to 4 feet apart.',
      'Turn your right foot out 90 degrees.',
      'Extend your arms parallel to the floor.',
      'Reach your right hand forward, then lower it to your shin or the floor.',
      'Extend your left arm toward the ceiling and gaze up at your left hand.'
    ],
    precautions: [
      'Avoid looking up if you have neck issues; look straight ahead instead.',
      'Do not rest your hand directly on your knee joint.',
      'Avoid if you have severe lower back pain.'
    ]
  },
  {
    name: 'Mountain Pose',
    icon: <Mountain className="h-10 w-10" />,
    image: '/face_cards/mountianpose.jpeg',
    coverImage: '/mountian.jpeg',
    description: 'A grounding standing posture that refines alignment and awareness.',
    benefits: ['Improves posture', 'Builds stability', 'Cultivates mindful breathing'],
    bodyParts: ['Balance', 'Spine', 'Core'],
    steps: [
      'Stand with your big toes touching and heels slightly apart.',
      'Distribute your weight evenly across both feet.',
      'Engage your thighs and gently tuck your tailbone.',
      'Roll your shoulders back and down, palms facing forward.',
      'Gaze straight ahead and take deep, steady breaths.'
    ],
    precautions: [
      'If balance is challenging, stand with feet hip-width apart.',
      'Avoid locking your knees.',
      'Not recommended if experiencing dizziness or lightheadedness.'
    ]
  },
  {
    name: 'Bridge Pose',
    icon: <Waves className="h-10 w-10" />,
    image: '/face_cards/bridgepose.jpeg',
    coverImage: '/bridge.jpeg',
    description: 'A gentle backbend that opens the chest and strengthens the posterior chain.',
    benefits: ['Strengthens glutes and back', 'Opens chest', 'Energizes the body'],
    bodyParts: ['Back', 'Core', 'Legs'],
    steps: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Keep your arms resting by your sides, palms facing down.',
      'Press into your feet and lift your hips toward the ceiling.',
      'Interlace your fingers beneath your back and roll your shoulders under.',
      'Hold for 5 deep breaths, then slowly roll your spine back down.'
    ],
    precautions: [
      'Avoid if you have a neck injury.',
      'Do not turn your head while in the pose.',
      'If you have lower back pain, keep the lift mild and gentle.'
    ]
  },
  {
    name: 'Cobra Pose',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 8.5L8 12l2.5 3.5"/>
        <path d="M16 8.5c-2.5 0-5 3.5-5 3.5s2.5 3.5 5 3.5"/>
        <path d="M2 12h6"/><path d="M22 12h-6"/>
      </svg>
    ),
    image: '/face_cards/cobrapose.jpeg',
    coverImage: '/cobra.jpeg',
    description: 'A heart-opening backbend that strengthens the spine.',
    benefits: ['Strengthens back', 'Opens chest and shoulders', 'Improves posture'],
    bodyParts: ['Back', 'Shoulders', 'Spine'],
    steps: [
      'Lie face down on the floor with your legs extended behind you.',
      'Place your hands under your shoulders, elbows close to your body.',
      'Press the tops of your feet and thighs firmly into the floor.',
      'Inhale and slowly lift your chest off the floor, keeping a slight bend in your elbows.',
      'Hold the pose, breathing smoothly, then gently lower back down.'
    ],
    precautions: [
      'Avoid if pregnant or experiencing severe back pain.',
      'Do not rely solely on arm strength; use your back muscles to lift.',
      'Keep your neck neutral and avoid throwing your head back.'
    ]
  },
  {
    name: 'Cat-Cow Pose',
    icon: <RefreshCw className="h-10 w-10" />,
    image: '/face_cards/catcowpose.jpeg',
    coverImage: '/cat cow.jpeg',
    description: 'A spinal articulation flow that warms up and mobilizes the back.',
    benefits: ['Improves spinal flexibility', 'Relieves tension', 'Coordinates breath and movement'],
    bodyParts: ['Spine', 'Back', 'Core'],
    steps: [
      'Start on your hands and knees in a tabletop position.',
      'Inhale: Drop your belly, lift your chest and tailbone toward the ceiling (Cow Pose).',
      'Exhale: Round your spine, tuck your chin to your chest, and pull your navel in (Cat Pose).',
      'Continue flowing smoothly between these two poses with your breath.',
      'Repeat for 5 to 10 breath cycles.'
    ],
    precautions: [
      'If you have wrist pain, practice on your forearms instead.',
      'Keep movements slow and controlled if recovering from a back injury.',
      'Avoid crunching your neck during Cow Pose.'
    ]
  },
  {
    name: 'Half Moon Pose',
    icon: <Moon className="h-10 w-10" />,
    image: '/face_cards/halfmoonpose.jpeg',
    coverImage: '/halfmoon.jpeg',
    description: 'A balancing back-body opener that challenges stability.',
    benefits: ['Improves balance', 'Strengthens legs', 'Opens hips and chest'],
    bodyParts: ['Balance', 'Legs', 'Hips'],
    steps: [
      'Begin in Triangle Pose on the right side.',
      'Bend your right knee and step your left foot slightly forward.',
      'Place your right hand on the floor (or a block) slightly in front of your right foot.',
      'Lift your left leg parallel to the floor, opening your hips.',
      'Extend your left arm up, gaze toward your left thumb, and balance.'
    ],
    precautions: [
      'Avoid if you have low blood pressure or frequent migraines.',
      'Use a yoga block under your bottom hand if you cannot reach the floor.',
      'Do not strain your neck; gaze down if it feels more stable.'
    ]
  },
  {
    name: 'Chair Pose',
    icon: <Users className="h-10 w-10" />,
    image: '/face_cards/chairpose.jpeg',
    coverImage: '/chair.jpeg',
    description: 'A powerful standing pose that builds heat and strength in the lower body.',
    benefits: ['Strengthens thighs and ankles', 'Tones the core', 'Improves balance'],
    bodyParts: ['Legs', 'Core', 'Balance'],
    steps: [
      'Stand in Mountain Pose with feet together.',
      'Inhale and raise your arms above your head, palms facing each other.',
      'Exhale and bend your knees, as if sitting back into a chair.',
      'Keep your weight in your heels and your chest lifted.',
      'Hold the posture for 5-8 breaths, then return to standing.'
    ],
    precautions: [
      'Avoid deep bends if you have a recent knee injury.',
      'Keep your knees behind your toes to protect the joints.',
      'If your lower back hurts, tuck your tailbone slightly.'
    ]
  },
  {
    name: 'Butterfly Pose',
    icon: <Heart className="h-10 w-10" />,
    image: '/face_cards/buterflypose.jpeg',
    coverImage: '/buterfly.jpeg',
    description: 'A seated posture that deeply opens the hips and groin.',
    benefits: ['Stretches inner thighs', 'Opens hips', 'Stimulates abdominal organs'],
    bodyParts: ['Hips', 'Legs', 'Mind'],
    steps: [
      'Sit on the floor with your legs extended in front of you.',
      'Bend your knees and bring the soles of your feet together.',
      'Let your knees fall out to the sides, bringing your heels close to your pelvis.',
      'Hold your feet with your hands and sit up tall with a straight spine.',
      'You can gently flutter your knees like butterfly wings, or hold still and breathe.'
    ],
    precautions: [
      'Do not force your knees down; let gravity do the work.',
      'If you have tight hips or lower back pain, sit on a folded blanket.',
      'Avoid if you have severe groin or knee injuries.'
    ]
  }
];
