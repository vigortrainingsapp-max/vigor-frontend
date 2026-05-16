// src/data/exerciseData.js

export const exerciseGroups = {
  "chest": { // War "Brust"
    icon: "Heart",
    exercises: [
      "bench_press_flat",       // Bankdrücken (Flach)
      "bench_press_incline",    // Bankdrücken (Schräg)
      "butterfly_machine",      // Butterfly Maschine
      "chest_press",            // Brustpresse
      "chest_press_incline",    // Schräge Brustpresse
      "chest_press_negative",   // Negative Brustpresse
      "butterfly_dumbbell",     // Butterfly KH
      "pushups",                // Liegestütze
      "cable_crossover",        // Butterfly Kabelzug
    ]
  },
  "back": { // War "Rücken"
    icon: "Activity",
    exercises: [
      "pullups",                // Klimmzüge
      "lat_pulldown",           // Latzug
      "rowing_barbell",         // Rudern (LH)
      "rowing_dumbbell_single", // Einarmiges Rudern (KH)
      "rowing_cable_close",     // Rudern eng (Kabel)
      "rowing_cable_wide",      // Rudern breit (Kabel)
      "deadlift",               // Kreuzheben
      "rowing_machine_upper",   // Rudern oben (Maschine)
      "lat_pulldown_machine",   // Latzug Maschine
      "rowing_machine_single",  // Einarmiges Rudern (Maschine)
      "t_bar_row",              // T-Bar Rudern
      "back_extension",         // Rückenstrecker
      "low_row_machine"         // Low Row Maschine
    ]
  },
  "legs": { // War "Beine"
    icon: "TrendingUp",
    exercises: [
      "squat_dumbbell",         // Kniebeugen KH
      "squat_barbell",          // Kniebeugen LH
      "leg_press",              // Beinpresse
      "leg_extension",          // Beinstrecker
      "leg_curl_seated",        // Beinbeuger sitzend
      "leg_curl_lying",         // Beinbeuger liegend
      "lunges_dumbbell",        // Ausfallschritte KH
      "lunges_barbell",         // Ausfallschritte LH
      "calf_raises_standing",   // Wadenheben stehend
      "calf_raises_seated",     // Wadenheben sitzend
      "hack_squat",             // Hackenschmidt
      "romanian_deadlift",      // Rumänisches Kreuzheben
      "adductor_machine",       // Adduktoren
      "abductor_machine"        // Abduktoren
    ]
  },
  "shoulders": { // War "Schultern"
    icon: "Target",
    exercises: [
      "shoulder_press_barbell", // Schulterdrücken LH
      "shoulder_press_dumbbell_standing", // Schulterdrücken KH stehend
      "shoulder_press_dumbbell_seated",   // Schulterdrücken KH sitzend
      "lateral_raise_dumbbell", // Seitheben KH
      "lateral_raise_cable",    // Seitheben Kabel
      "front_raise",            // Frontheben
      "reverse_fly_dumbbell",   // Reverse Flys KH
      "reverse_fly_machine",    // Reverse Flys Maschine
      "face_pulls"              // Face Pulls
    ]
  },
  "arms": { // War "Arme"
    icon: "Dumbbell",
    exercises: [
      "bicep_curls_dumbbell",   // Bizeps Curls KH
      "bicep_curls_seated",     // Bizeps Curls sitzend
      "bicep_curls_standing",   // Bizeps Curls stehend
      "bicep_curls_barbell",    // Bizeps Curls LH
      "hammer_curls_seated",    // Hammer Curls sitzend
      "hammer_curls_standing",  // Hammer Curls stehend
      "preacher_curls_dumbbell",// Preacher Curls KH
      "preacher_curls_sz",      // Preacher Curls SZ
      "tricep_pushdown",        // Trizeps Drücken Kabel
      "tricep_pushdown_single", // Trizeps Drücken einarmig
      "dips",                   // Dips
      "close_grip_bench_press", // Enges Bankdrücken
      "skull_crushers",         // Skull Crushers
      "tricep_press_machine"    // Trizeps Maschine
    ]
  },
  "abs": { // War "Bauch"
    icon: "Apple",
    exercises: [
      "crunches",               // Crunches
      "plank",                  // Plank
      "leg_raises_lying",       // Beinheben liegend
      "leg_raises_hanging",     // Beinheben hängend
      "russian_twist",          // Russian Twist
      "ab_roller",              // Ab Roller
      "woodchopper",            // Woodchopper
      "sit_ups",                // Sit Ups
      "bicycle_crunches"        // Bicycle Crunches
    ]
  }
};