# Control Specification — Vortex Mixer

Based on Scientific Industries Vortex-Genie 2 and IKA MS 3 Digital.

## States

| State              | Description                   | Motor         | Mode                |
| ------------------ | ----------------------------- | ------------- | ------------------- |
| OFF                | Unit powered down             | Off           | —                   |
| IDLE               | Power on, ready               | Off           | Touch or Continuous |
| TOUCH_RUNNING      | Running with pressure applied | Running       | Touch               |
| CONTINUOUS_RUNNING | Running unattended            | Running       | Continuous          |
| ERROR              | Motor overload                | Off (thermal) | —                   |

## Controls

| Control             | Type                 | Function                      |
| ------------------- | -------------------- | ----------------------------- |
| Power switch        | Rocker switch        | Unit on/off (rear)            |
| Speed control       | Rotary potentiometer | Set speed (0–10 scale or rpm) |
| Mode switch         | 3-position toggle    | Touch / Off / Continuous      |
| Speed display (IKA) | Digital LED          | Speed in rpm                  |

## Safety

| Condition           | Behavior                                      |
| ------------------- | --------------------------------------------- |
| Motor overload      | Thermal cutout, auto-reset after cooling      |
| Excessive vibration | Unit may walk on bench (suction feet prevent) |
