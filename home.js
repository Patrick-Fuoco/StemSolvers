// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixLocation from "wix-location";

// For Biology
$w("#buttonbiology").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Biology");
});

// For Chemistry
$w("#buttonchemistry").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Chemistry");
});

// For Math
$w("#buttonmath").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Math");
});

// For Physics
$w("#buttonphysics").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Physics");
});

// For Programming
$w("#buttonprogramming").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Programming");
});

// For Engineering
$w("#buttonengineering").onClick(() => {
  wixLocation.to("/concordia-courses?subject=Engineering");
});
